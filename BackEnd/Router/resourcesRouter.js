
const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const {
  getAllResources,
  createResource,
  updateResource,
  toggleDeleteResource,
  uploadResourcesFile,
} = require('../Controller/resourcesController');

const verifyToken = require('../config/authMiddleware'); 

// Get all resources
router.get('/getAllResources', getAllResources);

// Create a resource (single/multiple images)
router.post('/resources', upload.array('images', 5), createResource);
router.post("/upload-file", upload.single("file"), uploadResourcesFile);

// Upload CSV with multiple resources

// Update a resource
router.patch('/:id', upload.array('images', 5), updateResource);

// Toggle isDeleted field
router.patch('/:id/toggle', verifyToken, toggleDeleteResource);

module.exports = router;
