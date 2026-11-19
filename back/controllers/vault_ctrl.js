const { randomUUID, randomBytes, createCipheriv, createDecipheriv } = require("node:crypto");
const pool = require("../connection/sqlConnection");

const fields = {
    name: { max: 150 },
    category: { max: 100 },
    url: { max: 2048, optional: true },
    username: { max: 255, optional: true },
};

function readEntry(body, partial = false) {
    const entry = {};

    for (const [field, { max, optional }] of Object.entries(fields)) {
        const value = body[field];

        if (partial && value === undefined) continue;

        if (optional && (value == null || value === "")) {
            entry[field] = null;
            continue;
        }

        if (typeof value !== "string" || !value.trim() || value.trim().length > max) {
            throw badRequest(`Champ invalide : ${field}.`);
        }

        entry[field] = value.trim();
    }

    if (entry.url !== undefined && entry.url !== null) {
        const url = parseUrl(entry.url);
        if (!url || !["http:", "https:"].includes(url.protocol)) {
            throw badRequest("Saisis une URL commençant par http:// ou https://.");
        }
    }

    if (!partial || body.password !== undefined) {
        if (typeof body.password !== "string" || body.password.length === 0) {
            throw badRequest("Le mot de passe est requis.");
        }

        entry.password_encrypted = encryptPassword(body.password);
    }

    if (body.is_favorite !== undefined) {
        if (typeof body.is_favorite !== "boolean") {
            throw badRequest("is_favorite doit être un booléen.");
        }

        entry.is_favorite = body.is_favorite;
    }

    if (Object.keys(entry).length === 0) {
        throw badRequest("Aucun champ à modifier.");
    }

    return entry;
}

function parseUrl(value) {
    try {
        return new URL(value);
    } catch {
        return null;
    }
}

function badRequest(message) {
    return Object.assign(new Error(message), { status: 400 });
}

function getKey() {
    const key = process.env.VAULT_ENCRYPTION_KEY;

    if (!key || !/^[a-f0-9]{64}$/i.test(key)) {
        throw new Error("VAULT_ENCRYPTION_KEY doit contenir 64 caractères hexadécimaux.");
    }

    return Buffer.from(key, "hex");
}

function encryptPassword(password) {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
    const encrypted = Buffer.concat([cipher.update(password, "utf8"), cipher.final()]);

    return Buffer.concat([iv, cipher.getAuthTag(), encrypted]);
}

function decryptPassword(value) {
    const iv = value.subarray(0, 12);
    const tag = value.subarray(12, 28);
    const encrypted = value.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", getKey(), iv);

    decipher.setAuthTag(tag);

    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

function handleRequest(handler) {
    return async (req, res) => {
        res.set("Cache-Control", "no-store");

        try {
            return await handler(req, res);
        } catch (err) {
            if (err.status === 400) {
                return res.status(400).json({ msg: err.message });
            }

            console.error("Erreur du coffre :", err.message);
            return res.status(500).json({ msg: "Impossible de traiter la demande." });
        }
    };
}

function entryNotFound(res) {
    return res.status(404).json({ msg: "Accès introuvable." });
}

exports.getEntriesByAuth = handleRequest(async (req, res) => {
    const [entries] = await pool.execute(
        `SELECT id, name, category, is_favorite
         FROM vault_entries
         WHERE user_id = ?
         ORDER BY is_favorite DESC, name ASC, id ASC`,
        [req.auth.userId]
    );

    return res.status(200).json({ entries });
});

exports.getEntry = handleRequest(async (req, res) => {
    const [entries] = await pool.execute(
        `SELECT id, name, category, url, username, is_favorite
         FROM vault_entries
         WHERE id = ? AND user_id = ?`,
        [req.params.id, req.auth.userId]
    );

    if (!entries.length) return entryNotFound(res);

    return res.status(200).json({ entry: entries[0] });
});

exports.addEntry = handleRequest(async (req, res) => {
    const entry = readEntry(req.body ?? {});
    const id = randomUUID();

    await pool.execute(
        `INSERT INTO vault_entries
         (id, user_id, name, category, url, username, password_encrypted, is_favorite)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            req.auth.userId,
            entry.name,
            entry.category,
            entry.url,
            entry.username,
            entry.password_encrypted,
            entry.is_favorite ?? false,
        ]
    );

    return res.status(201).json({ id, msg: "Accès créé." });
});

exports.updateEntry = handleRequest(async (req, res) => {
    const changes = Object.entries(readEntry(req.body ?? {}, true));
    const assignments = changes.map(([column]) => `${column} = ?`).join(", ");
    const values = changes.map(([, value]) => value);

    const [result] = await pool.execute(
        `UPDATE vault_entries SET ${assignments} WHERE id = ? AND user_id = ?`,
        [...values, req.params.id, req.auth.userId]
    );

    if (result.affectedRows === 0) {
        const [entries] = await pool.execute(
            "SELECT id FROM vault_entries WHERE id = ? AND user_id = ?",
            [req.params.id, req.auth.userId]
        );

        if (!entries.length) return entryNotFound(res);
    }

    return res.status(200).json({ msg: "Accès mis à jour." });
});

exports.deleteEntry = handleRequest(async (req, res) => {
    const [result] = await pool.execute(
        "DELETE FROM vault_entries WHERE id = ? AND user_id = ?",
        [req.params.id, req.auth.userId]
    );

    if (result.affectedRows === 0) return entryNotFound(res);

    return res.status(204).end();
});

exports.getEntryPassword = handleRequest(async (req, res) => {
    const [entries] = await pool.execute(
        "SELECT password_encrypted FROM vault_entries WHERE id = ? AND user_id = ?",
        [req.params.id, req.auth.userId]
    );

    if (!entries.length) return entryNotFound(res);

    const encrypted = entries[0].password_encrypted;

    if (encrypted.length <= 28) {
        return res.status(422).json({
            msg: "Enregistre un mot de passe pour cet accès.",
        });
    }

    return res.status(200).json({ password: decryptPassword(encrypted) });
});