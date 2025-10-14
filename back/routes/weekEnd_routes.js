const express = require("express");
const router = express.Router();
const weekEndCtrl = require("../controllers/weekEnd_ctrl");
const auth = require("../middlewares/auth");

router.get("/", auth, weekEndCtrl.getWeekEnds);
router.post("/", auth, weekEndCtrl.createWeekEnd);
router.put("/:id", auth, weekEndCtrl.updateWeekEnd);

module.exports = router;  