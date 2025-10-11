const { v4: uuidv4 } = require("uuid");
const pool = require("../connection/sqlConnection");
const fs = require('fs').promises;
const CHUNK_SIZE = 1000;

exports.isVocabulary = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const [vocabulary] = await pool.query("SELECT * FROM vocabulary WHERE user_id = ?", [userId]);
    if (vocabulary.length === 0) return res.status(404).json({ msg: "No vocabulary yet." });
    return res.status(200).json({ msg: "You added some vocabulary" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};


exports.initVocabulary = async (req, res) => {
  try {
    const vocabulary = req.body.vocabulary;
    const userId = req.auth.userId;
    if (!vocabulary || typeof vocabulary !== "object") {
      return res.status(400).json({ error: "Invalid vocabulary format" });
    }

    const [vocDB] = await pool.query("SELECT * FROM vocabulary WHERE user_id = ?", [userId]);
    const families = [
      { name: "maison et vie quotidienne", data: ["house", "bedroom", "kitchen", "tools", "clothing"] },
      { name: "nature et environnement", data: ["animals", "vegetation", "fruits", "vegetable", "weather"] },
      { name: "culture, arts et divertissements", data: ["arts", "cinema", "entertainment", "education", "sport"] },
      { name: "voyages et lieux", data: ["places", "city", "transport", "travel", "travelTerms"] },
      { name: "corps et émotions", data: ["bodyParts", "internalBodyParts", "emotions", "orientation", "connectives"] },
      { name: "langue et grammaire", data: ["irregularVerbs"] },
      { name: "travail et vie professionnelle", data: ["work", "informatique"] }
    ];
    try {
      await Promise.all(
        vocDB.map(async (vocabulary) => {
          const sameFamily = families.find((cell) => cell.name === vocabulary.family);
          if (sameFamily) {
            const sameCategory = sameFamily.data.find((cell) => cell === vocabulary.category);
            if (sameCategory) {
              await pool.execute("DELETE FROM vocabulary WHERE family = ? AND category = ? AND user_id = ?", [vocabulary.family, vocabulary.category, userId]);
            }
          }
        })
      )
    } catch (err) {
      console.error(err);
    }

    function getFamily(category) {
      for (const f of families) {
        if (f.data.includes(category)) return f.name;
      }
      return null;
    }

    const categories = Object.keys(vocabulary);
    const conn = await pool.getConnection();

    try {
      for (const category of categories) {
        const items = Array.isArray(vocabulary[category]) ? vocabulary[category] : [];
        if (items.length === 0) continue;

        const family = getFamily(category);
        const rows = items.map(item => [
          userId,
          uuidv4(),
          item.frName ?? null,
          item.ukName ?? null,
          category,
          family,
          `${category}.png` ?? null
        ]);

        for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
          const chunk = rows.slice(i, i + CHUNK_SIZE);
          await conn.beginTransaction();
          try {
            await conn.query(
              `INSERT INTO vocabulary (user_id, uuid, fr_name, uk_name, category, family, img_url) VALUES ?`,
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
    const userId = req.auth.userId;
    const [vocabulary] = await pool.execute("SELECT * FROM vocabulary WHERE user_id = ?", [userId]);
    if (vocabulary.length === 0) {
      return res.status(200).json({ vocabulary: [] });
    }

    const missingFamilies = [];
    for (let i = 0; i < vocabulary.length; i++) {

      if (!vocabulary[i].family && !missingFamilies.includes(vocabulary[i].category)) {
        missingFamilies.push(vocabulary[i].category);
      }
    }
    if (missingFamilies.length === 0) {
      console.log("Toutes les catégories ont une famille");
    } else {
      console.log("Certaines catégories n'ont pas de famille : " + missingFamilies)
    }
    // up
    return res.status(200).json({ vocabulary: vocabulary });

  } catch (err) {
    return res.status(500).json({ error: "DataBase error" });
  }
};

exports.getVocabularyByCategories = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const [rows] = await pool.query(
      `SELECT uuid, fr_name AS frName, uk_name AS ukName, category, family 
       FROM vocabulary WHERE user_id = ?`, [userId]
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

exports.getOneVocabularyCategory = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const category = req.params.category;
    const [rows] = await pool.query(
      `SELECT uuid, fr_name AS frName, uk_name AS ukName, category, family, img_url 
       FROM vocabulary
       WHERE category = ? AND user_id = ?`, [category, userId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ msg: "Introuvable" });
    }


    return res.status(200).json({ vocabulary: rows });

  } catch (err) {
    return res.status(500).json({ error: "DataBase error" + err });
  }

}


exports.getVocabularyByFamily = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const family = req.params.family;

    const [rows] = await pool.query(
      `SELECT uuid, fr_name AS frName, uk_name AS ukName, category, family, img_url 
       FROM vocabulary WHERE family = ? AND user_id = ?`, [family, userId]
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

exports.getFamilies = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const [rows] = await pool.query(
      `SELECT family 
       FROM vocabulary
       WHERE user_id = ?`, [userId],
    );


    const data = [];
    if (!rows || rows.length === 0) return res.status(404).json({ msg: "Empty array" });
    for (let i = 0; i < rows.length; i++) {
      if (!data.includes(rows[i].family)) {
        data.push(rows[i].family);
      }
    }


    return res.status(200).json({ families: data });

  } catch (err) {
    return res.status(500).json({ error: "DataBase error" + err });
  }
}

exports.addVocabulary = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { family, category, fr_name, uk_name } = req.body;
    const uuid = uuidv4();
    const img_url = req.file ? req.file.filename : null;

    if (img_url) {
      await pool.execute("INSERT INTO vocabulary(user_id, uuid, fr_name, uk_name, category, family, img_url) VALUES(?,?,?,?,?,?,?)", [userId, uuid, fr_name, uk_name, category, family, img_url]);
    } else {
      // récupération de l'image
      const [vocabularies] = await pool.query("SELECT img_url from vocabulary WHERE family = ? AND category = ? AND user_id = ?", [family, category, userId]);
      if (vocabularies.length === 0) return res.status(404).json({ msg: "vocabulary unfoundable" });
      const vocabulary = vocabularies[0];
      await pool.execute("INSERT INTO vocabulary(user_id, uuid, fr_name, uk_name, category, family, img_url) VALUES(?,?,?,?,?,?,?)", [userId, uuid, fr_name, uk_name, category, family, vocabulary.img_url]);
    }

    return res.status(200).json({ msg: "vocabulary added" });

  } catch (err) {
    return res.status(500).json({ error: err });
  }

};

exports.getCategories = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const [rows] = await pool.query(
      `SELECT * FROM category WHERE user_id = ?`, [userId]
    );

    if (rows && rows.lenght === 0) {
      return res.status(404).json({ error: err })
    }
    return res.status(200).json({ categories: rows });

  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

exports.updateCategory = async (req, res, next) => {

  try {
    const userId = req.auth.userId;
    const category = req.params.category;
    const vocabularySession = req.body.vocabularySession;
    const successCount = vocabularySession.filter(item => item && item.success).length;
    const percentage = (successCount / vocabularySession.length) * 100;

    const [cat] = await pool.query(
      `SELECT * FROM category
      WHERE user_id = ? 
      AND name = ?
      AND user_id = ?
      ORDER BY index_id
      `, [userId, category, userId]
    );

    if (!cat || cat.length === 0) {
      await pool.execute(
        `INSERT INTO category (uuid, user_id, name, percentage)
         VALUES(?, ?, ?, ?)
        `, [uuidv4(), userId, category, percentage]
      );
    } else if (cat) {
      await pool.execute(
        `UPDATE category SET percentage = ?
         WHERE user_id = ?
         AND name = ?`, [percentage, userId, category]
      );
    }
    // determiner si category percentils est déjà créé, si oui put sinon push
    return res.status(200).json({ msg: "category updated" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}


exports.deleteFamily = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const family = req.params.family;
    const [families] = await pool.query("SELECT * FROM vocabulary WHERE family = ? AND user_id = ?", [family, userId]);
    if (families.length === 0) return res.status(404).json({ msg: "Family not found" });

    // récupérer toutes les categories de la famille et les supprimer + les images
    const categories = families.reduce((acc, currV) => {
      if (!acc.includes(currV.category)) {
        acc.push(currV.category);
      }
      return acc;
    }, []);

    const familiesProtected = [
      { name: "maison et vie quotidienne", data: ["house", "bedroom", "kitchen", "tools", "clothing"] },
      { name: "nature et environnement", data: ["animals", "vegetation", "fruits", "vegetable", "weather"] },
      { name: "culture, arts et divertissements", data: ["arts", "cinema", "entertainment", "education", "sport"] },
      { name: "voyages et lieux", data: ["places", "city", "transport", "travel", "travelTerms"] },
      { name: "corps et émotions", data: ["bodyParts", "internalBodyParts", "emotions", "orientation", "connectives"] },
      { name: "langue et grammaire", data: ["irregularVerbs"] },
      { name: "travail et vie professionnelle", data: ["work", "informatique"] }
    ];

    try {
      await Promise.all(
        categories.map(async (category) => {
          const userId = req.auth.userId;
          const famille = families.find((cell) => cell.category === category);
          const isFamilyProtected = familiesProtected.find((cell) => cell.name === family);
          if (!isFamilyProtected) await fs.unlink(`uploads/pictures/categories/${famille.img_url}`);
          await pool.execute("DELETE FROM vocabulary WHERE family = ? AND category = ? AND user_id = ?", [family, category, userId]);
        })
      )
    } catch (err) {
      console.error(err);
    }
    return res.status(200).json({ msg: "family deleted" });

  } catch (err) {
    return res.status(500).json({ error: err });
  }

};

exports.deleteCategory = async (req, res, next) => {
  try {
    const family = req.params.family;
    const category = req.params.category;
    const userId = req.auth.userId;

    const [rows] = await pool.query("SELECT img_url FROM vocabulary WHERE family = ? AND category = ? AND user_id = ? LIMIT 1", [family, category, userId]);
    if (rows.length === 0) return res.status(404).json({ msg: "Category not found" });
    if (!rows[0].img_url) return res.status(404).json({ msg: "No pictures found" });

    const families = [
      { name: "maison et vie quotidienne", data: ["house", "bedroom", "kitchen", "tools", "clothing"] },
      { name: "nature et environnement", data: ["animals", "vegetation", "fruits", "vegetable", "weather"] },
      { name: "culture, arts et divertissements", data: ["arts", "cinema", "entertainment", "education", "sport"] },
      { name: "voyages et lieux", data: ["places", "city", "transport", "travel", "travelTerms"] },
      { name: "corps et émotions", data: ["bodyParts", "internalBodyParts", "emotions", "orientation", "connectives"] },
      { name: "langue et grammaire", data: ["irregularVerbs"] },
      { name: "travail et vie professionnelle", data: ["work", "informatique"] }
    ];

    // on supprime l'image uniquement si pas la même family et category
    const sameFamily = families.find((cell) => cell.name === family);

    if (!sameFamily || !sameFamily.data.includes(category)) {
      await fs.unlink(`uploads/pictures/categories/${rows[0].img_url}`);
    }
    await pool.execute("DELETE FROM vocabulary WHERE family = ? AND category = ? AND user_id = ?", [family, category, userId]);

    return res.status(200).json({ msg: "category deleted" });

  } catch (err) {
    return res.status(500).json({ error: err });
  }

};


exports.deleteVocabulary = async (req, res, next) => {
  try {
    const vocabularyId = req.params.id;
    const userId = req.auth.userId;
    const [rows] = await pool.query("SELECT category FROM vocabulary WHERE uuid = ? AND user_id = ? ", [vocabularyId, userId]);
    await pool.execute("DELETE FROM vocabulary WHERE uuid = ? AND user_id = ?", [vocabularyId, userId]);

    return res.status(200).json({ msg: "vocabulary deleted", category: rows[0].category });

  } catch (err) {
    return res.status(500).json({ error: err });
  }

};
