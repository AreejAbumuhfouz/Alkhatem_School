const express = require('express');
const router = express.Router();
const resourceController = require('../Controller/report');

// Existing routes ...
router.get('/report/download', resourceController.generateResourcesReport);

module.exports = router;
