const mongoose = require('mongoose');

// const importLogSchema = new mongoose.Schema({
//     url: String,                // The API URL being imported from
//   timestamp: Date,
//   totalFetched: Number,
//   totalImported: Number,
//   newJobs: Number,
//   updatedJobs: Number,
//   failedJobs: Number,
//   failureReasons: [String],
// });
const importLogSchema = new mongoose.Schema({
  timestamp: Date,          // Overall timestamp for the log entry
  logs: Object,             // Entire ImportLogObject stored as an object
});
module.exports = mongoose.model('ImportLog', importLogSchema);
