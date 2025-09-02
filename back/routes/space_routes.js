const express = require("express");
const router = express.Router();
const spaceCtrl = require("../controllers/space_ctrl");
const auth = require("../middlewares/auth"); 

router.put("/:id", auth, spaceCtrl.updateSpace);

module.exports = router; 