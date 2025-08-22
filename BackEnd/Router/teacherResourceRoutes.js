const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../config/authMiddleware');
const { Resource, UserResource } = require('../models'); // Import from index.js
const teacherResourceController = require('../Controller/teacherResourceController');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/resources/claim', auth, teacherResourceController.claimResource);

router.get('/with-users', teacherResourceController.getAllResourcesWithUsers);
router.get('/teacher', teacherResourceController.getAllResourcesTeacher);

// Get all resources assigned to a specific teacher
router.get('/teacher/:teacherId', teacherResourceController.getTeacherResources);

// Assign a resource to a teacher
router.post('/assign/:teacherId/:resourceId', teacherResourceController.assignResourceToTeacher);

router.post('/return', auth, upload.array('images', 5), teacherResourceController.returnResource);

// Teacher sees all resources they have taken
router.get('/my-resources', auth, teacherResourceController.getMyResources);
module.exports = router;
