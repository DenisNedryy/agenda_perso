const pool = require("../connection/sqlConnection");
const { v4: uuidv4 } = require("uuid");

exports.getWeekEnds = async (req, res, next) => {
    try {
        const userId = req.auth.userId;

        const [rows] = await pool.execute("SELECT * FROM weekend WHERE user_id = ?", [userId]);
        if (rows.length === 0) return res.status(200).json({ weekEnd: [] });
        return res.status(200).json({ weekEnd: rows });
    } catch (err) {
        return res.status(500).json({ msg: `error : ${err}` });
    }
};

exports.createWeekEnd = async (req, res, next) => {
    try {
        const userId = req.auth.userId;

        await pool.execute("INSERT INTO weekend (uuid, user_id) VALUES(?,?)", [uuidv4(), userId]);
        return res.status(201).json({ msg: "weekEnd created" });
    } catch (err) {
        return res.status(500).json({ msg: `error : ${err}` });
    }
};

exports.updateWeekEnd = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const day = req.body.day; // ex "lundi"

        const [rows] = await pool.execute("SELECT * FROM weekend WHERE user_id = ?", [userId]);
        if (rows.length === 0) return res.status(200).json({ msg: "weeEnd not know" });

        // si dans la bdd lundi = 0 alors on le toggle
        console.log(rows[0]);

        await pool.execute("UPDATE weekend SET ")
        return res.status(201).json({ msg: "weekEnd created" });
    } catch (err) {
        return res.status(500).json({ msg: `error : ${err}` });
    }
};