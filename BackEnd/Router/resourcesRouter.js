
// const express = require('express');
// const multer = require('multer');
// const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });

// const {
//   getAllResources,
//   createResource,
//   updateResource,
//   toggleDeleteResource,
// } = require('../Controller/resourcesController');

// const verifyToken = require('../config/authMiddleware'); 

// // Get all resources
// router.get('/getAllResources', getAllResources);

// // Create a resource (fix: use POST and add upload middleware)
// router.post('/resources', verifyToken, upload.array('images', 5), createResource);

// // Update a resource
// router.patch('/:id', upload.array('images', 5), updateResource);

// // Toggle isDeleted field
// router.patch('/:id/toggle', verifyToken, toggleDeleteResource);

// module.exports = router;

const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const {
  getAllResources,
  createResource,
  updateResource,
  toggleDeleteResource,
  uploadResourcesExcel, // استدعاء الكنترولر الجديد
} = require('../Controller/resourcesController');

const verifyToken = require('../config/authMiddleware'); 

// Get all resources
router.get('/getAllResources', getAllResources);

// Create a resource (single/multiple images)
router.post('/resources', verifyToken, upload.array('images', 5), createResource);

// Upload CSV with multiple resources
router.post('/resources/upload-csv', upload.single('file'), uploadResourcesExcel);

// Update a resource
router.patch('/:id', upload.array('images', 5), updateResource);

// Toggle isDeleted field
router.patch('/:id/toggle', verifyToken, toggleDeleteResource);

module.exports = router;
