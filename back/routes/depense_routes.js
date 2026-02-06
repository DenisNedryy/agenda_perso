const express = require("express");
const router = express.Router();
const depenseCtrl = require("../controllers/depense_ctrl");
const auth = require("../middlewares/auth");

// Toutes les dépenses (tu peux aussi filtrer via query: ?year=2026&month=2)
router.get("/", auth, depenseCtrl.getAll);

// Dépenses par mois: /by-month?year=2026&month=2  (ou month=2026-02)
router.get("/by-month", auth, depenseCtrl.getDepenseByMonth);

router.get("/salary", auth, depenseCtrl.getSalary);

// Salaire (ressource “spéciale”/unique)
router.post("/salaire", auth, depenseCtrl.addSalaire);
router.put("/salaire", auth, depenseCtrl.putSalaire);

// Dépenses CRUD
router.post("/", auth, depenseCtrl.addDepense);
router.put("/:id", auth, depenseCtrl.putDepense);
router.patch("/:id", auth, depenseCtrl.patchDepense);
router.delete("/:id", auth, depenseCtrl.deleteDepense);

module.exports = router;
