


require('./workers/JobWorker'); // Start the worker system (Important!)
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');
const routes = require('./routes/index');
const cors = require("cors");
require('./services/CronService'); // Start cron job

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use('/api', routes);

mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(process.env.PORT || 5000, () => console.log('Server running'));
