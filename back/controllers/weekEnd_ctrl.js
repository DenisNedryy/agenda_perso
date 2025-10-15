const pool = require("../connection/sqlConnection");
const { v4: uuidv4 } = require("uuid");

exports.getWeekEnds = async (req, res, next) => {
    try {
        const userId = req.auth.userId;

        const [rows] = await pool.execute("SELECT * FROM weekend WHERE user_id = ?", [userId]);
        if (rows.length === 0) return res.status(200).json({ weekEnd: [] });
        return res.status(200).json({ weekEnd: rows[0] });
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

        // si pas de table alors on la créer
        const [rows] = await pool.execute("SELECT * FROM weekend WHERE user_id = ?", [userId]);
        if (rows.length === 0) {
            await pool.execute("INSERT INTO weekend (uuid, user_id) VALUES(?,?)", [uuidv4(), userId]);
        }

        function toggleBooltinyint(num){
            return num===0 ? 1 : 0;
        }

        const days = {
            lundi: day === "lundi" ? toggleBooltinyint(rows[0]['lundi']) : rows[0]['lundi'],
            mardi: day === "mardi" ?  toggleBooltinyint(rows[0]['mardi']): rows[0]['mardi'],
            mercredi: day === "mercredi" ? toggleBooltinyint(rows[0]['mercredi']) : rows[0]['mercredi'],
            jeudi: day === "jeudi" ? toggleBooltinyint(rows[0]['jeudi']) : rows[0]['jeudi'],
            vendredi: day === "vendredi" ? toggleBooltinyint(rows[0]['vendredi']) : rows[0]['vendredi'],
            samedi: day === "samedi" ? toggleBooltinyint(rows[0]['samedi']) : rows[0]['samedi'],
            dimanche: day === "dimanche" ? toggleBooltinyint(rows[0]['dimanche']) : rows[0]['dimanche']
        }

        await pool.execute(`UPDATE weekend SET lundi = ?, mardi = ?, mercredi = ?, jeudi = ?, vendredi = ?, samedi = ?, dimanche = ?  WHERE user_id = ?`, [days['lundi'], days['mardi'], days['mercredi'], days['jeudi'], days['vendredi'], days['samedi'], days['dimanche'], userId]);
        return res.status(201).json({ msg: "weekEnd created" });
    } catch (err) {
        return res.status(500).json({ msg: `error : ${err}` });
    }
};