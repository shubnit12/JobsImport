const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    url: String,                // The API URL being imported from
  title: String,
  jobId: String, // unique ID
  link: String,
  description: String,
  publicationDate: String,
  location: String,
  jobType: String,
  company: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', jobSchema);
