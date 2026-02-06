const cors = require("cors");
require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const userRoutes = require("./routes/users_routes");
const tasksRoutes = require("./routes/tasks_routes");
const birthDaysRoutes = require("./routes/birthDays_routes");
const spaceRoutes = require("./routes/space_routes");
const weekEndRoutes = require("./routes/weekEnd_routes");
const vocabularyRoutes = require("./routes/vocabulary_routes");
const depenseRoutes = require("./routes/depense_routes");
const path = require('path');
const { startTaskStatusCron } = require("./hooks/statusTasks");

app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: `http://localhost:3000`,
    methods: "GET, POST, PUT,PATCH, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
}));


app.use("/api/welcome", (req, res, next) => {
    res.status(200).json({ msg: "Les cors marchent ! " });
});

app.use("/api/auth", userRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/birthDays", birthDaysRoutes);
app.use("/api/spaced_repetition", spaceRoutes);
app.use("/api/vocabulary", vocabularyRoutes);
app.use("/api/weekEnd", weekEndRoutes);
app.use("/api/depense", depenseRoutes);

app.use("/api/images/avatars", express.static(path.join(__dirname, "uploads/pictures/avatars")));
app.use("/api/images/categories", express.static(path.join(__dirname, "uploads/pictures/categories")));

startTaskStatusCron();

module.exports = app;