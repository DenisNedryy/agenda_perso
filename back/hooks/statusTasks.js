const cron = require('node-cron');
const { tasksService } = require("../services/tasksService");

function startTaskStatusCron() {
    // Tous les jours à 00:00
cron.schedule('* * * * *', async () => {
  console.log('⏰ Vérification des tâches chaque minute');
  await tasksService();
  console.log('✅ Mise à jour des statuts terminée');
});
}

module.exports = { startTaskStatusCron };
