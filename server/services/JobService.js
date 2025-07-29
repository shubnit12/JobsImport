const axios = require('axios');
const xml2js = require('xml2js');
const Job = require('../models/Job');

const fetchJobsFromAPI = async (url) => {
  try {
    const response = await axios.get(url);
    const result = await xml2js.parseStringPromise(response.data, { explicitArray: false });

    const jobs = result.rss.channel.item.map(item => ({
      url: url,
      title: item.title,
      jobId: item.id,
      link: item.link,
      description: item.description || item.encoded?.__cdata,
      publicationDate: item.pubDate,
      location: item["job_listing:location"],
      jobType: item["job_listing:job_type"],
      company: item["job_listing:company"],
    }));
    console.log("length of jobs from url :  ", url, jobs.length)
    return jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};
function getUpdatedFields(tempExistingJob, Job) {
  const updatedFields = {};

  Object.keys(Job).forEach((key) => {

    if (Job[key] !== tempExistingJob[key]) {
      updatedFields[key] = Job[key];
    }
  });

  return updatedFields;
}
const insertOrUpdateJobs = async (jobs) => {
  let ImportLogObject = {}
  require('../config/config').apiEndpoints.map(url => ImportLogObject[url] = { timestamp: new Date(), newJobs: 0, updatedJobs: 0, failedJobs: [], totalFetched: jobs.filter(job => job.url === url).length, totalImported: 0 })
  console.log("ImportLogObject emplty : " , ImportLogObject)
  for (const job of jobs) {
    // console.log("JobService job: ", job)
    try {
      const existingJob = await Job.findOne({ jobId: job.jobId });
      if (existingJob) {
        let tempExistingJob = {
          url: existingJob.url,
          title: existingJob.title,
          jobId: existingJob.jobId,
          link: existingJob.link,
          // description: existingJob.description,
          // publicationDate: existingJob.publicationDate, 
          publicationDate: existingJob.publicationDate,
          location: existingJob.location,
          jobType: existingJob.jobType,
          company: existingJob.company,
        }
        let tempJobFrmoAPI = {
          url: job.url,
          title: job.title,
          jobId: job.jobId,
          link: job.link,
          // description: job.description,
          // publicationDate: existingJob.publicationDate, 
          publicationDate: job.publicationDate,
          location: job.location,
          jobType: job.jobType,
          company: job.company,
        }

        const updatedFields = getUpdatedFields(tempExistingJob, tempJobFrmoAPI);
        if (JSON.stringify(tempJobFrmoAPI) === JSON.stringify(tempExistingJob) || Object.keys(updatedFields).length == 0) {
          // console.log("NO changes found in This Job : ", tempExistingJob.jobId)
        } else {
          console.log("updatedFields : ", updatedFields)
          if (Object.keys(updatedFields).length > 0) {
            console.log(" tempExistingJob : ", tempExistingJob)
            console.log(" Job : ", tempJobFrmoAPI)
            ImportLogObject[job.url].updatedJobs++;
            ImportLogObject[job.url].totalImported++;
            Job.updateOne(
              { jobId: tempExistingJob.jobId }, // Filter condition
              { $set: updatedFields } // Only set changed fields
            ).then(() => {
              console.log('Job updated successfully!');
            }).catch((err) => {
              console.error('Error updating job:', err);
            });
            console.log("changes found --> update the entry in db : ", tempExistingJob.jobId)
            // ImportLogObject[job.url].updatedJobs = ImportLogObject[job.url].updatedJobs + 1

            // updatedJobs++;
          }
          // Update only the changed fields in MongoDB

        }


      } else {
        await Job.create(job);
        console.log("new job has been created with id : ", job.jobId)
        // console.log("ImportLogObject[job.url].newJobs : " , ImportLogObject[job.url].newJobs , "ImportLogObject[job.url].newJobs + 1 : ", ImportLogObject[job.url].newJobs + 1)
        // ImportLogObject[job.url].newJobs = ImportLogObject[job.url].newJobs + 1
         ImportLogObject[job.url].newJobs++;
        ImportLogObject[job.url].totalImported++;
        // newJobs++;
      }
    } catch (error) {
      console.log("error : ", job.jobId, error.message)
      // failedJobs.push({ jobId: job.jobId, error: error.message });
      ImportLogObject[job.url].failedJobs.push({ jobId: job.jobId, error: error.message });


    }
  }
  // console.log("newJobs, updatedJobs, failedJobs : ", newJobs, updatedJobs, failedJobs)
  console.log("ImportLogObject:  ", ImportLogObject)



  return ImportLogObject;
};

module.exports = {
  fetchJobsFromAPI,
  insertOrUpdateJobs,
};
