
const pool = require("../connection/sqlConnection");
const { v4: uuidv4 } = require("uuid");
const fs = require('fs').promises;

exports.updateSpace = async (req, res, next) => {
    try {
        const id = req.params.id;
        const [spaceRepArr] = await pool.execute("SELECT * FROM spacedRepetitionCard WHERE task_id = ?", [id]);
        if (spaceRepArr.length === 0) {
            return res.status(404).json({ msg: "SpaceArr undefined" });
        }
        const spaceRep = spaceRepArr[0];

        const [tasksArr] = await pool.execute("SELECT * FROM tasks WHERE id = ?", [id]);
        if (tasksArr.length === 0) {
            return res.status(404).json({ msg: "task undefined" });
        }
        const task = tasksArr[0];

        let step = spaceRep.step;
        let date = spaceRep.review_date;

        const stepsDays = [1, 3, 7, 15, 30, 90, 180, 360];

        if (step < 7) {
            date = new Date(new Date(task.date).getTime() + (stepsDays[step] * (1000 * 60 * 60 * 24)));
            step++;
        } else if (step === 7) {
            date = new Date(new Date(task.date).getTime() + (stepsDays[step] * (1000 * 60 * 60 * 24)));
        }

        await pool.execute("UPDATE spacedRepetitionCard SET step = ?, review_date = ? WHERE task_id = ?", [step, date, id]);
        await pool.execute("UPDATE tasks SET date = ? WHERE id = ?", [date, id]);
        return res.status(200).json({ msg: "card spaced_repetition updated" })
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};


exports.reviewTomorow = async (req, res, next) => {
    try {
        const id = req.params.id;

        // selection task
        const [spaceRepArr] = await pool.execute("SELECT * FROM spacedRepetitionCard WHERE task_id = ?", [id]);
        if (spaceRepArr.length === 0) {
            return res.status(404).json({ msg: "SpaceArr undefined" });
        }
        const spaceRep = spaceRepArr[0];

        // selection de la spaced repetition de la task
        const [tasksArr] = await pool.execute("SELECT * FROM tasks WHERE id = ?", [id]);
        if (tasksArr.length === 0) {
            return res.status(404).json({ msg: "task undefined" });
        }
        const task = tasksArr[0];

        let step = spaceRep.step;
        let date = spaceRep.review_date;

        // ajout d'un jour à la date
        date = new Date(new Date(task.date).getTime() + (1 * (1000 * 60 * 60 * 24)));

        await pool.execute("UPDATE spacedRepetitionCard SET step = ?, review_date = ? WHERE task_id = ?", [step, date, id]);
        await pool.execute("UPDATE tasks SET date = ? WHERE id = ?", [date, id]);
        return res.status(200).json({ msg: "card spaced_repetition updated" })
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};


exports.reset = async (req, res, next) => {
    try {
        const id = req.params.id;

        // selection task
        const [spaceRepArr] = await pool.execute("SELECT * FROM spacedRepetitionCard WHERE task_id = ?", [id]);
        if (spaceRepArr.length === 0) {
            return res.status(404).json({ msg: "SpaceArr undefined" });
        }
        const spaceRep = spaceRepArr[0];

        // selection de la spaced repetition de la task
        const [tasksArr] = await pool.execute("SELECT * FROM tasks WHERE id = ?", [id]);
        if (tasksArr.length === 0) {
            return res.status(404).json({ msg: "task undefined" });
        }
        const task = tasksArr[0];

        let step = 0;
        let date = new Date();


        await pool.execute("UPDATE spacedRepetitionCard SET step = ?, review_date = ? WHERE task_id = ?", [step, date, id]);
        await pool.execute("UPDATE tasks SET date = ? WHERE id = ?", [date, id]);
        return res.status(200).json({ msg: "card spaced_repetition updated" })
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};


exports.rollBack = async (req, res, next) => {
    try {
        const id = req.params.id;
        const [spaceRepArr] = await pool.execute("SELECT * FROM spacedRepetitionCard WHERE task_id = ?", [id]);
        if (spaceRepArr.length === 0) {
            return res.status(404).json({ msg: "Task not found" });
        }
        const spaceRep = spaceRepArr[0];

        const [tasksArr] = await pool.execute("SELECT * FROM tasks WHERE id = ?", [id]);
        if (tasksArr.length === 0) {
            return res.status(404).json({ msg: "Task not found" });
        }
        const task = tasksArr[0];

        let step = spaceRep.step;
        let date = spaceRep.review_date;

        const stepsDays = [1, 3, 7, 15, 30, 90, 180, 360];

        if (step < 7) {
            if (step > 0) step--;

            date = new Date(new Date(task.date).getTime() + (stepsDays[step] * (1000 * 60 * 60 * 24)));

        } else if (step === 7) {
            step--;
            date = new Date(new Date(task.date).getTime() + (stepsDays[step] * (1000 * 60 * 60 * 24)));
        }
        console.log(step);
        await pool.execute("UPDATE spacedRepetitionCard SET step = ?, review_date = ? WHERE task_id = ?", [step, date, id]);
        await pool.execute("UPDATE tasks SET date = ? WHERE id = ?", [date, id]);
        return res.status(200).json({ msg: "Task's roll back updated" })
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};