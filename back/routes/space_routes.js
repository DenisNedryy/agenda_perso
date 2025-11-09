const express = require("express");
const router = express.Router();
const spaceCtrl = require("../controllers/space_ctrl");
const auth = require("../middlewares/auth"); 

router.put("/:id", auth, spaceCtrl.updateSpace);
router.put("/reviewTomorow/:id", auth, spaceCtrl.reviewTomorow);
router.put("/reset/:id", auth, spaceCtrl.reset);
router.put('/intervalRollback/:id', auth, spaceCtrl.rollBack); 

module.exports = router; 