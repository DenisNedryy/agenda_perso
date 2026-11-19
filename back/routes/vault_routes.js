const express = require("express");
const auth = require("../middlewares/auth");
const vaultCtrl = require("../controllers/vault_ctrl");

const router = express.Router();

router.get("/", auth, vaultCtrl.getEntriesByAuth);
router.get("/:id/password", auth, vaultCtrl.getEntryPassword);
router.get("/:id", auth, vaultCtrl.getEntry);
router.post("/", auth, vaultCtrl.addEntry);
router.patch("/:id", auth, vaultCtrl.updateEntry);
router.delete("/:id", auth, vaultCtrl.deleteEntry);

module.exports = router;