// controllers/depense_ctrl.js
const pool = require("../connection/sqlConnection");
const { v4: uuidv4 } = require("uuid");

const allowedCategory = new Set(["besoins", "envies"]);
const allowedSubCategory = new Set([
  "logement",
  "factures_abonnements",
  "alimentation",
  "transport",
  "sante",
  "famille",
  "dette",
  "animaux",
]);

const isValidMonth = (m) => Number.isInteger(m) && m >= 1 && m <= 12;
const isValidYear = (y) => Number.isInteger(y) && y >= 1900 && y <= 2100;

function badRequest(res, msg) {
  return res.status(400).json({ msg });
}

function parseNumber(value) {
  const n = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(n) ? n : null;
}

/**
 * GET /
 * Renvoie toutes les dépenses du user
 * Optionnel: filtres ?year=2026&month=2 ou ?month=2026-02
 */
exports.getSalary = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const [salary] = await pool.execute('SELECT montant_net FROM salaire WHERE user_id = ?', [userId]);
    if (salary.length > 0) {
      return res.status(200).json({ data: salary[0] })
    } else {
      return res.status(404).json({ msg: 'salary not found' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}


exports.getAll = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { year, month } = req.query;

    // Si ?year=YYYY&month=M
    if (year && month && !String(month).includes("-")) {
      const y = parseInt(year, 10);
      const m = parseInt(month, 10);

      if (!isValidYear(y) || !isValidMonth(m)) {
        return badRequest(res, "Paramètres year/month invalides. Exemple: ?year=2026&month=2");
      }

      const [rows] = await pool.execute(
        `
        SELECT * FROM depense
        WHERE user_id = ?
          AND YEAR(created_at) = ?
          AND MONTH(created_at) = ?
        ORDER BY created_at DESC
        `,
        [userId, y, m]
      );

      return res.status(200).json({ depenses: rows });
    }

    // Si ?month=YYYY-MM
    if (month && String(month).includes("-") && !year) {
      const [yy, mm] = String(month).split("-");
      const y = parseInt(yy, 10);
      const m = parseInt(mm, 10);

      if (!isValidYear(y) || !isValidMonth(m)) {
        return badRequest(res, "Paramètre month invalide. Exemple: ?month=2026-02");
      }

      const [rows] = await pool.execute(
        `
        SELECT * FROM depense
        WHERE user_id = ?
          AND YEAR(created_at) = ?
          AND MONTH(created_at) = ?
        ORDER BY created_at DESC
        `,
        [userId, y, m]
      );

      return res.status(200).json({ depenses: rows });
    }

    const [rows] = await pool.execute(
      `SELECT * FROM depense WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    return res.status(200).json({ depenses: rows });
  } catch (err) {
    return res.status(500).json({ msg: `error: ${err.message || err}` });
  }
};

/**
 * GET /by-month?year=2026&month=2  OU  /by-month?month=2026-02
 */
exports.getDepenseByMonth = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { year, month } = req.query;

    let y, m;

    if (year && month && !String(month).includes("-")) {
      y = parseInt(year, 10);
      m = parseInt(month, 10);
    } else if (month && String(month).includes("-")) {
      const [yy, mm] = String(month).split("-");
      y = parseInt(yy, 10);
      m = parseInt(mm, 10);
    } else {
      return badRequest(res, "Utilise /by-month?year=2026&month=2 ou /by-month?month=2026-02");
    }

    if (!isValidYear(y) || !isValidMonth(m)) {
      return badRequest(res, "Paramètres de mois invalides.");
    }

    const [rows] = await pool.execute(
      `
      SELECT * FROM depense
      WHERE user_id = ?
        AND YEAR(created_at) = ?
        AND MONTH(created_at) = ?
      ORDER BY created_at DESC
      `,
      [userId, y, m]
    );

    return res.status(200).json({ depenses: rows, year: y, month: m });
  } catch (err) {
    return res.status(500).json({ msg: `error: ${err.message || err}` });
  }
};

/**
 * POST /
 * body: { category, sub_category, name, price }
 */
exports.addDepense = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { category, sub_category, name, price, is_automatique } = req.body;
    console.log(req.body);

    // 1) category
    if (!allowedCategory.has(category)) {
      return badRequest(res, "category invalide (besoin|envie)");
    }

    // 2) règles sub_category selon category
    if (category === "besoins") {
      if (!sub_category) {
        return badRequest(res, "sub_category requis pour une dépense besoin");
      }
      if (!allowedSubCategory.has(sub_category)) {
        return badRequest(res, "sub_category invalide");
      }
    } else if (category === "envies") {
      // soit tu refuses si le client en envoie une :
      if (sub_category) {
        return badRequest(res, "sub_category interdit pour une dépense envie");
      }
      // soit tu ignores silencieusement :
      // sub_category = null; // (mais const -> il faudrait le copier dans une variable)
    }

    // 3) name
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return badRequest(res, "name requis");
    }

    // 4) price
    const p = parseNumber(price);
    if (p === null || p < 0) return badRequest(res, "price invalide");

    const id = uuidv4();

    // 5) INSERT (sans created_at si ta colonne a DEFAULT CURRENT_TIMESTAMP)
    if (category === "besoins") {
      await pool.execute(
        `INSERT INTO depense (id, user_id, category, sub_category, name, price, is_automatique)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, userId, category, sub_category, name.trim(), p, is_automatique===false ? 0 : 1]
      );
    } else {
      await pool.execute(
        `INSERT INTO depense (id, user_id, category, name, price)
         VALUES (?, ?, ?, ?, ?)`,
        [id, userId, category, name.trim(), p]
      );
    }

    const [rows] = await pool.execute(
      "SELECT * FROM depense WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    return res.status(201).json({ depense: rows[0] });
  } catch (err) {
    return res.status(500).json({ msg: `error: ${err.message || err}` });
  }
};

/**
 * PUT /:id
 * body: { category, sub_category, name, price }
 * Remplacement complet des champs (hors user_id, created_at)
 */
exports.putDepense = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;
    const { category, sub_category, name, price } = req.body;

    if (!allowedCategory.has(category)) {
      return badRequest(res, "category invalide (besoins|envies)");
    }
    if (!allowedSubCategory.has(sub_category)) {
      return badRequest(res, "sub_category invalide");
    }
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return badRequest(res, "name requis");
    }
    const p = parseNumber(price);
    if (p === null || p < 0) return badRequest(res, "price invalide");

    const [result] = await pool.execute(
      `
      UPDATE depense
      SET category = ?, sub_category = ?, name = ?, price = ?
      WHERE id = ? AND user_id = ?
      `,
      [category, sub_category, name.trim(), p, id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Dépense introuvable" });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM depense WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    return res.status(200).json({ depense: rows[0] });
  } catch (err) {
    return res.status(500).json({ msg: `error: ${err.message || err}` });
  }
};

/**
 * PATCH /:id
 * body: champs partiels parmi { category, sub_category, name, price }
 */
exports.patchDepense = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;

    const updates = [];
    const values = [];

    if (req.body.category !== undefined) {
      if (!allowedCategory.has(req.body.category)) {
        return badRequest(res, "category invalide (besoins|envies)");
      }
      updates.push("category = ?");
      values.push(req.body.category);
    }

    if (req.body.sub_category !== undefined) {
      if (!allowedSubCategory.has(req.body.sub_category)) {
        return badRequest(res, "sub_category invalide");
      }
      updates.push("sub_category = ?");
      values.push(req.body.sub_category);
    }

    if (req.body.name !== undefined) {
      if (typeof req.body.name !== "string" || req.body.name.trim().length === 0) {
        return badRequest(res, "name invalide");
      }
      updates.push("name = ?");
      values.push(req.body.name.trim());
    }

    if (req.body.price !== undefined) {
      const p = parseNumber(req.body.price);
      if (p === null || p < 0) return badRequest(res, "price invalide");
      updates.push("price = ?");
      values.push(p);
    }

    if (updates.length === 0) {
      return badRequest(res, "Aucun champ à mettre à jour");
    }

    values.push(id, userId);

    const [result] = await pool.execute(
      `
      UPDATE depense
      SET ${updates.join(", ")}
      WHERE id = ? AND user_id = ?
      `,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Dépense introuvable" });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM depense WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    return res.status(200).json({ depense: rows[0] });
  } catch (err) {
    return res.status(500).json({ msg: `error: ${err.message || err}` });
  }
};

/**
 * DELETE /:id
 */
exports.deleteDepense = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;

    const [result] = await pool.execute(
      "DELETE FROM depense WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Dépense introuvable" });
    }

    return res.status(200).json({ msg: "Dépense supprimée" });
  } catch (err) {
    return res.status(500).json({ msg: `error: ${err.message || err}` });
  }
};

/**
 * POST /salaire
 * body: { montant_net }
 * Crée ou remplace le salaire du user (unique par user)
 */
exports.addSalaire = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { montant_net } = req.body;

    const m = parseNumber(montant_net);
    if (m === null || m < 0) return badRequest(res, "montant_net invalide");

    // salaire unique par user -> UPSERT basé sur user_id (nécessite un UNIQUE sur salaire.user_id idéalement)
    // Si tu n'as pas UNIQUE(user_id), on fait un SELECT puis insert/update.
    const [existing] = await pool.execute(
      "SELECT id FROM salaire WHERE user_id = ? LIMIT 1",
      [userId]
    );

    if (existing.length === 0) {
      const id = uuidv4();
      await pool.execute(
        "INSERT INTO salaire (id, user_id, montant_net) VALUES (?, ?, ?)",
        [id, userId, m]
      );

      const [rows] = await pool.execute("SELECT * FROM salaire WHERE id = ?", [id]);
      return res.status(201).json({ salaire: rows[0] });
    } else {
      const salaireId = existing[0].id;
      await pool.execute(
        "UPDATE salaire SET montant_net = ? WHERE id = ? AND user_id = ?",
        [m, salaireId, userId]
      );
      const [rows] = await pool.execute(
        "SELECT * FROM salaire WHERE id = ? AND user_id = ?",
        [salaireId, userId]
      );
      return res.status(200).json({ salaire: rows[0] });
    }
  } catch (err) {
    return res.status(500).json({ msg: `error: ${err.message || err}` });
  }
};

/**
 * PUT /salaire
 * body: { montant_net }
 * Met à jour le salaire (s'il n'existe pas, on le crée)
 */
exports.putSalaire = async (req, res) => {
  // Même logique que addSalaire (PUT = idempotent)
  return exports.addSalaire(req, res);
};
