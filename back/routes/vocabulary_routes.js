const express = require("express");
const router = express.Router();
const vocabularyCtrl = require("../controllers/vocabulary_ctrl");
const auth = require("../middlewares/auth");

router.get("/", auth, vocabularyCtrl.getVocabulary);
router.get("/byCategories", auth, vocabularyCtrl.getVocabularyByCategories);
router.get("/byFamily/:family", auth, vocabularyCtrl.getVocabularyByFamily);
router.post("/init", auth, vocabularyCtrl.initVocabulary);
router.post("/add", auth, vocabularyCtrl.addVocabulary); 


module.exports = router; 