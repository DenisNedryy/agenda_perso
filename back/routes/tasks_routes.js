const express = require("express");
const router = express.Router();
const tasksCtrl = require("../controllers/tasks_ctrl");
const auth = require("../middlewares/auth");

router.get("/", auth, tasksCtrl.readTasks);
router.get("/alerts", auth, tasksCtrl.readAlerts);
router.get("/alerts/courses", auth, tasksCtrl.readCourses);
router.get("/tasksSortedByType/:type", auth, tasksCtrl.readTasksByAuthAndType);
router.get("/authTasks", auth, tasksCtrl.readTasksByAuth);
router.get("/:id", auth, tasksCtrl.readOneTask);
router.post("/", auth, tasksCtrl.createTask);
router.put("/order", auth, tasksCtrl.updateOrder);
router.put("/:id", auth, tasksCtrl.updateTask);
router.delete("/:id", auth, tasksCtrl.deleteTask);

module.exports = router; 