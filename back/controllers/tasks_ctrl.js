
const pool = require("../connection/sqlConnection");
const { v4: uuidv4 } = require("uuid");
const fs = require('fs').promises;


exports.readTasks = async (req, res, next) => {
    try {
        const [tasks] = await pool.execute('SELECT * FROM tasks ORDER BY _index');
        if (tasks.length === 0) {
            return res.status(200).json({ tasks: [] });
        }
        return res.status(200).json({ tasks: tasks });
    } catch (err) {
        return res.status(500).json({ err });
    }
};

exports.readTasksByAuthAndType = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const type = req.params.type;
        const [tasks] = await pool.execute(
            `SELECT id, user_id, author_id, owner_id, status, name, description, date,
              type, subject, sort_order, _index, author_img_url
       FROM tasks
       WHERE user_id = ? AND type = ?
       ORDER BY sort_order IS NULL, sort_order, _index`,
            [userId, type]
        );
        if (tasks.length === 0) {
            return res.status(200).json({ tasks: [] });
        }
        return res.status(200).json({ tasks: tasks });
    } catch (err) {
        return res.status(500).json({ err });
    }
}




exports.readCourses = async (req, res, next) => {
    try {
        const [tasks] = await pool.execute('SELECT * FROM tasks WHERE type = ? ORDER BY _index', ["courses"]);
        if (tasks.length === 0) {
            return res.status(200).json({ courses: [] });
        }
        return res.status(200).json({ courses: tasks });
    } catch (err) {
        return res.status(500).json({ err });
    }
};

exports.readAlerts = async (req, res, next) => {
    try {
        const type = "alert";
        const [tasks] = await pool.execute('SELECT * FROM tasks WHERE type = ? ORDER BY _index', [type]);
        if (tasks.length === 0) {
            return res.status(200).json({ tasks: [] });
        }
        return res.status(200).json({ alerts: tasks });
    } catch (err) {
        return res.status(500).json({ err });
    }
};

exports.readOneTask = async (req, res, next) => {
    try {
        const id = req.params.id;
        const [tasks] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [id]);
        if (tasks.length === 0) {
            return res.status(200).json({ tasks: [] });
        }
        const [spacedRepetitionAddOn] = await pool.execute('SELECT * FROM spacedRepetitionCard WHERE task_id = ?', [tasks[0].id])
        const task = tasks[0];

        const spaceRep = spacedRepetitionAddOn[0];

        if (spacedRepetitionAddOn.length > 0) {
            task.review_date = spaceRep.review_date;
            task.step = spaceRep.step;
        }


        return res.status(200).json({ tasks: task });
    } catch (err) {
        return res.status(500).json({ err });
    }
};

exports.readTasksByAuth = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const [tasks] = await pool.execute('SELECT * FROM tasks WHERE user_id = ? ORDER BY _index', [userId]);
        if (tasks.length === 0) {
            return res.status(200).json({ tasks: [] });
        }
        return res.status(200).json({ tasks: tasks });
    } catch (err) {
        return res.status(500).json({ err });
    }
};

exports.createTask = async (req, res, next) => {
    try {
        const { name, description, date, type, subject, author_id, owner_id, author_img_url } = req.body;
        const [tasks] = await pool.execute("SELECT _index FROM tasks",);

        // sort index pour toutes les tasks
        let newIndex = (tasks && tasks.length === 0) ? 1 : (tasks[tasks.length - 1]._index + 1);
        // un index uniquement pour les projects
        const [projectsIndexs] = await pool.query("SELECT sort_order from tasks WHERE type = ?", type);
        if (projectsIndexs.length > 0) {
            newIndex = projectsIndexs.length + 1;
        } else {
            newIndex = 1;
        }


        const data = {
            id: uuidv4(),
            name: name || null,
            description: description || null,
            date: date || null,
            type: type || null,
            subject: subject || null,
            author_id: author_id || null,
            owner_id: owner_id || null,
            author_img_url: author_img_url,
            sort_order: newIndex
        }

        data.user_id = owner_id;

        const keys = Object.keys(data).filter((key) => data[key] !== null);
        const values = keys.map((key) => data[key]);
        const placeholder = keys.map(() => "?").join(", ");

        await pool.execute(`INSERT INTO tasks (${keys.join(", ")}) VALUES(${placeholder})`, values);

        if (subject) {
            try {
                const arrayForSubject = [
                    data.id,
                    date,
                    0
                ];
                await pool.execute(`INSERT INTO spacedRepetitionCard (task_id, review_date, step) VALUES(?,?,?)`, arrayForSubject);
            } catch (err) {
                console.log(err);
            }
        };
        return res.status(200).json({ msg: "task created" })

    } catch (err) {
        return res.status(500).json({ err });
    }
};

exports.updateTask = async (req, res, next) => {
    try {
        const taskId = req.params.id;

        const [task] = await pool.execute("SELECT * FROM tasks WHERE id = ?", [taskId]);
        if (req.auth.userId !== task[0].user_id) {
            return res.status(400).json({ msg: "action non authorisée" });
        }
        const { name, description, type } = req.body;

        const data = {
            name: name || null,
            description: description || null,
            type: type || null
        }

        const keys = Object.keys(data).filter((key) => data[key] !== null);
        const values = Object.values(data).filter((value) => value !== null);
        const placeholder = keys.map((key) => `${key} = ?`).join(", ");
        values.push(taskId);

        await pool.execute(`UPDATE tasks SET ${placeholder} WHERE ID = ?`, values);
        return res.status(200).json({ msg: "task updated" })

    } catch (err) {
        return res.status(500).json({ err });
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const [task] = await pool.execute("SELECT * FROM tasks WHERE id = ?", [taskId]);

        if (req.auth.userId !== task[0].user_id) return res.status(400).json({ msg: "action non authorisée" })
        await pool.execute(`DELETE FROM tasks WHERE id = ?`, [taskId]);
        return res.status(200).json({ msg: "task deleted" });
    } catch (err) {
        return res.status(500).json({ err });
    }
};

exports.updateOrder = async (req, res, next) => {
    try {
        const orderArr = req.body.orderArr;

        const whenClauses = orderArr.map(() => "WHEN ? THEN ?").join(" ");
        const ids = orderArr.map(it => it.id);

        const sql = `
      UPDATE tasks
      SET sort_order = CASE id ${whenClauses} END
      WHERE id IN (${ids.map(() => "?").join(",")})
    `;

        const params = [];
        for (const { id, sort_order } of orderArr) {
            params.push(id, sort_order);
        }
        params.push(...ids);

        await pool.execute(sql, params);

        return res.status(200).json({ msg: "Tasks order updated." });
    } catch (err) {
        console.error("updateOrder error:", err);
        return res.status(500).json({ err: "Erreur lors de la mise à jour" });
    }
};



exports.toggleCardToDelete = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const [task] = await pool.execute("SELECT * FROM tasks WHERE id = ?", [taskId]);

        if (task.length === 0) {
            return res.status(404).json({ msg: "Tâche introuvable" });
        }

        const reverseToDelete = task[0].to_delete === 0 ? 1 : 0;

        if (req.auth.userId !== task[0].user_id) return res.status(400).json({ msg: "action non authorisée" })
        await pool.execute(`UPDATE tasks SET to_delete = ? WHERE id = ?`, [reverseToDelete, taskId]);
        return res.status(200).json({ msg: "task to_delete reversed" });
    } catch (err) {
        return res.status(500).json({ err });
    }
};