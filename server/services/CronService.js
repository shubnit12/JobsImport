
console.log('CronService loaded');
const cron = require('node-cron');
const ImportController = require('../controllers/ImportController');

cron.schedule('0 * * * *', () => {
  console.log('Cron job triggered: Importing jobs');
  ImportController.importJobs(null, { status: (code) => ({ send: (msg) => console.log('Cron import response:', code, msg) }) });
  console.log('Hourly job import triggered');
});
