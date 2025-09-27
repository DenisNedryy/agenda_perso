const pool = require("../connection/sqlConnection");

async function tasksService() {
  const now = new Date();
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // today à 00:00

  const tasks = await readTasks();

  // Marque comme "passé" les tâches dont la date < aujourd'hui
  for (let i = 0; i < tasks.length; i++) {
    const taskDateRaw = new Date(tasks[i].date);
    const taskDate = new Date(taskDateRaw.getFullYear(), taskDateRaw.getMonth(), taskDateRaw.getDate());
    if (taskDate < currentDate && tasks[i].status === 0) {
      await updateStatus(tasks[i].id);
      tasks[i].status = 1; //  sync en mémoire
    }
  }

  // Ne garde que les dayOff passés ET status=1
  const daysOffPassed = tasks.filter((t) => {
    if (t.type !== "dayOff" || t.status !== 1) return false;
    const d = new Date(t.date);
    const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return d0 < currentDate;
  });

  await deleteDaysOffPassed(daysOffPassed);

  await deleteTasksToDelete();

}

async function readTasks() {
  try {
    const [tasks] = await pool.execute('SELECT * FROM tasks ORDER BY _index');
    return tasks;
  } catch (err) {
    console.error("Error reading tasks:", err);
    return [];
  }
}

async function updateStatus(taskId) {
  try {
    await pool.execute('UPDATE tasks SET status = 1 WHERE id = ?', [taskId]);
    console.log(`Tâche ${taskId} mise à jour`);
  } catch (err) {
    console.error("Erreur updateStatus: ", err);
  }
}


async function deleteDaysOffPassed(daysOff) {
  try {
    const ids = daysOff.map(t => t.id);
    if (ids.length === 0) return;

    const placeholders = ids.map(() => "?").join(",");
    const sql = `DELETE FROM tasks WHERE id IN (${placeholders})`;
    const [res] = await pool.execute(sql, ids);
    console.log(`${res.affectedRows} dayOff passés supprimés`);
  } catch (err) {
    console.error("Error deleteDaysOff: ", err);
  }
}

async function deleteTasksToDelete() {
  try {
    await pool.execute("DELETE FROM tasks WHERE to_delete = ?", [true]);
  } catch (err) {
    console.error("Error lors de la suppression des taches 'to delete': ", err);
  }
}

module.exports = { tasksService };
