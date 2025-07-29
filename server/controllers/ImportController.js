const { Queue } = require('bullmq');
const JobService = require('../services/JobService');
const ImportLog = require('../models/ImportLog');
const config = require('../config/config');

const jobQueue = new Queue('job-queue');

const importJobs = async (req, res) => {

  const jobs = await Promise.all(
    require('../config/config').apiEndpoints.map(url => JobService.fetchJobsFromAPI(url))
  );
  for (let index = 0; index < jobs.length; index++) {
    const element = jobs[index];
    console.log("element.length : ", element.length)
    console.log("element.url : ", element[0].url)   
    
    
    
  }
  const flattenedJobs = jobs.flat();
  await jobQueue.add('import-jobs', { jobs: flattenedJobs });
  res.status(200).send({ message: 'Jobs queued for import', total: flattenedJobs.length });
};

const getImportLogs = async (req, res) => {
  const logs = await ImportLog.find().sort({ timestamp: -1 });
  res.status(200).send({ logs });
};

module.exports = {
  importJobs,
  getImportLogs,
};
