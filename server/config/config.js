require('dotenv').config();

module.exports = {
  mongoURI: "mongodb+srv://PersonalWebsiteMondoClusterUser1:121901Shu6n!t@personalwebsitemodbclus.whlyyhw.mongodb.net/?retryWrites=true&w=majority&appName=PersonalWebsiteMoDBCluster1",
//   redisURI: process.env.REDIS_URI,
  apiEndpoints: [
    "https://jobicy.com/?feed=job_feed",
    "https://jobicy.com/?feed=job_feed&job_categories=data-science",
    "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
    "https://jobicy.com/?feed=job_feed&job_categories=management",
  ],
};
