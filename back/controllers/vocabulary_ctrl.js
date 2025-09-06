const { v4: uuidv4 } = require("uuid");
const pool = require("../connection/sqlConnection");

const CHUNK_SIZE = 1000;

exports.initVocabulary = async (req, res) => {
  try {
    const vocabulary = req.body.vocabulary;
    if (!vocabulary || typeof vocabulary !== "object") {
      return res.status(400).json({ error: "Invalid vocabulary format" });
    }

    const categories = Object.keys(vocabulary);
    const conn = await pool.getConnection();
    try {
      for (const category of categories) {
        const rows = (vocabulary[category] || []).map(item => [
          uuidv4(),
          item.frName,
          item.ukName,
          category,
        ]);

        // insert en chunks
        for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
          const chunk = rows.slice(i, i + CHUNK_SIZE);
          await conn.beginTransaction();
          try {
            // INSERT multi-values
            await conn.query(
              `INSERT INTO vocabulary (uuid, fr_name, uk_name, category) VALUES ?`,
              [chunk]
            );
            await conn.commit();
          } catch (e) {
            await conn.rollback();
            throw e;
          }
        }
      }

      return res.status(201).json({ msg: "vocabulary init" });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  }
};

exports.getVocabulary = async (req, res, next) => {
  try {
    const [vocabulary] = await pool.execute("SELECT * FROM vocabulary");
    if (vocabulary.length === 0) {
      return res.status(200).json({ vocabulary: [] });
    }
    return res.status(200).json({ vocabulary: vocabulary });

  } catch (err) {
    return res.status(500).json({ error: "DataBase error" });
  }
};

exports.getVocabularyByCategories = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT uuid, fr_name AS frName, uk_name AS ukName, category 
       FROM vocabulary`
    );

    const data = {};
    for (let i = 0; i < rows.length; i++) {
      if (!data[rows[i].category]) {
        data[rows[i].category] = [];
      }
      data[rows[i].category].push(rows[i]);
    }

    return res.status(200).json({ vocabulary: data });

  } catch (err) {
    return res.status(500).json({ error: "DataBase error" + err });
  }

}

exports.addVocabulary = async (req, res, next) => {

};
