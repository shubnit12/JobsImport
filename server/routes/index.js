const express = require('express');
const ImportController = require('../controllers/ImportController');
const router = express.Router();

router.post('/import', ImportController.importJobs);
router.get('/logs', ImportController.getImportLogs);

module.exports = router;
