
const { Worker } = require('bullmq');
const JobService = require('../services/JobService');
const ImportLog = require('../models/ImportLog');
const Redis = require('ioredis'); // Redis client
// Redis connection (using ioredis)
const connection = new Redis({
  maxRetriesPerRequest: null, // This must be null for BullMQ
  // other Redis connection options
});

const jobWorker = new Worker('job-queue', async (job) => {
  const jobs = job.data.jobs;
  // console.log(jobs)
  const ImportLogObject = await JobService.insertOrUpdateJobs(jobs);
await ImportLog.create({
      timestamp: new Date(),
      logs: ImportLogObject, // Store the whole ImportLogObject directly
    });
        console.log('Import logs saved successfully:', ImportLogObject);


  // Log the import details
  // await ImportLog.create({
  //   timestamp: new Date(),
  //   totalFetched: jobs.length,
  //   totalImported: newJobs + updatedJobs,
  //   newJobs,
  //   updatedJobs,
  //   failedJobs: failedJobs.length,
  //   failureReasons: failedJobs.map(f => f.error),
  // });

  // console.log(`Import complete: ${newJobs} new, ${updatedJobs} updated, ${failedJobs.length} failed.`);
},
{ connection });

jobWorker.on('failed', (job, err) => {
  console.error(`Job failed with error: ${err.message}`);
});

module.exports = jobWorker;
