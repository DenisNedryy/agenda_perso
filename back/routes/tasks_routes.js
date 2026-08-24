const express = require("express");
const router = express.Router();

const tasksCtrl = require("../controllers/tasks_ctrl");
const auth = require("../middlewares/auth");

router.get("/", auth, tasksCtrl.readTasks);
router.get("/today", auth, tasksCtrl.readTodayTasks);
router.get("/movies", auth, tasksCtrl.readMovies);

router.post("/tasksByFilter", auth, tasksCtrl.readTasksByFilter);
router.post("/", auth, tasksCtrl.createTask);

router.get("/alerts", auth, tasksCtrl.readAlerts);
router.get("/alerts/courses", auth, tasksCtrl.readCourses);
router.get("/tasksSortedByType/:type", auth, tasksCtrl.readTasksByAuthAndType);
router.get("/authTasks", auth, tasksCtrl.readTasksByAuth);

router.put("/order", auth, tasksCtrl.updateOrder);
router.put("/reviewTomorow/:id", auth, tasksCtrl.reviewTomorow);
router.put("/toDelete/:id", auth, tasksCtrl.toggleCardToDelete);
router.put("/:id", auth, tasksCtrl.updateTask);

router.delete("/:id", auth, tasksCtrl.deleteTask);

router.get("/:id", auth, tasksCtrl.readOneTask);

module.exports = router;