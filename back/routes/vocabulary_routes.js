const express = require("express");
const router = express.Router();
const vocabularyCtrl = require("../controllers/vocabulary_ctrl");
const auth = require("../middlewares/auth");
const { uploadCategory } = require("../middlewares/multer-config");
const multer = require("multer");
const upload = multer();

router.get("/", auth, vocabularyCtrl.getVocabulary);
router.get("/families", auth, vocabularyCtrl.getFamilies);
router.get("/categories", auth, vocabularyCtrl.getCategories);
router.get("/byCategories", auth, vocabularyCtrl.getVocabularyByCategories);
router.get("/isVocabulary", auth, vocabularyCtrl.isVocabulary);
router.get("/oneCategory/:category", auth, vocabularyCtrl.getOneVocabularyCategory);
router.get("/byFamily/:family", auth, vocabularyCtrl.getVocabularyByFamily);
router.post("/init", auth, vocabularyCtrl.initVocabulary);
router.post("/add", auth, uploadCategory, vocabularyCtrl.addVocabulary);
router.put("/updateCategory/:category", auth, vocabularyCtrl.updateCategory);
router.delete("/:id", auth, vocabularyCtrl.deleteVocabulary);
router.delete("/families/:family", auth, vocabularyCtrl.deleteFamily);
router.delete("/families/:family/categories/:category", auth, vocabularyCtrl.deleteCategory);


module.exports = router; 