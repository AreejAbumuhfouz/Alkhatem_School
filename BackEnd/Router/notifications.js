const express = require('express');
const router = express.Router();
const notificationsController = require('../Controller/notification');

// Route to create notification (only admins can trigger)
router.post('/send', notificationsController.createNotificationForAdmins);

// Route to get all notifications for a specific admin
router.get('/admin/:adminId', notificationsController.getNotificationsForAdmin);

// Route to mark a notification as read
router.put('/read/:notificationId', notificationsController.markAsRead);

module.exports = router;
