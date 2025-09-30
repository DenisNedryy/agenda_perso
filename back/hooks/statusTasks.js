const cron = require('node-cron');
const { tasksService } = require('../services/tasksService');

function startTaskStatusCron() {
  cron.schedule('0 */6 * * *', async () => {
    console.log('Vérification des tâches toutes les 6 heures');
    await tasksService();
    console.log('Mise à jour des statuts terminée');
  }, {
    timezone: 'Europe/Paris'
  });
}

module.exports = { startTaskStatusCron };
