// // const express = require('express');
// // const multer = require('multer');
// // const router = express.Router();
// // const upload = multer({ storage: multer.memoryStorage() });

// // const {
// //     getAllResources,
// // createResource,
// //     updateResource,
  
// //     toggleDeleteResource,

// // } = require('../Controller/resourcesController');
// // const verifyToken = require('../config/authMiddleware'); 

// // router.get('/getAllResources', getAllResources);
// // router.patch('/:id', updateResource);
// // router.patch('/:id/toggle', toggleDeleteResource);
// // router.get('/resources', createResource);

// // module.exports = router;

const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const {
  getAllResources,
  createResource,
  updateResource,
  toggleDeleteResource,
} = require('../Controller/resourcesController');

const verifyToken = require('../config/authMiddleware'); 

// Get all resources
router.get('/getAllResources', getAllResources);

// Create a resource (fix: use POST and add upload middleware)
router.post('/resources', verifyToken, upload.array('images', 5), createResource);

// Update a resource
router.patch('/:id', upload.array('images', 5), updateResource);

// Toggle isDeleted field
router.patch('/:id/toggle', verifyToken, toggleDeleteResource);

module.exports = router;
