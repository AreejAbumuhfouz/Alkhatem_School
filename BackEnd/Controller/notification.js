const Notification = require('../models/notification');
const User = require('../models/User');
const Resource = require('../models/resources'); // your Resource model
const { Op } = require('sequelize');

// Create notification only if actor is admin
exports.createNotificationForAdmins = async (req, res) => {
  try {
    const { actor_id, resource_id, quantity } = req.body;

    if (!actor_id || !resource_id || !quantity) {
      return res.status(400).json({ message: 'actor_id, resource_id, and quantity are required' });
    }

    // Check if actor is admin
    const actor = await User.findByPk(actor_id);
    if (!actor) return res.status(404).json({ message: 'Actor not found' });
    if (actor.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can trigger notifications' });
    }

    // Find all other admins except the actor
    const admins = await User.findAll({
      where: {
        role: 'admin',
        id: { [Op.ne]: actor_id } // exclude actor
      }
    });

    if (!admins || admins.length === 0) {
      return res.status(404).json({ message: 'No other admins found' });
    }

    // Create notifications for all other admins
    const notificationsData = admins.map(admin => ({
      recipient_id: admin.id,
      actor_id,
      resource_id,
      quantity,
      is_read: false,
    }));

    const notifications = await Notification.bulkCreate(notificationsData, { returning: true });

    return res.status(201).json({
      message: 'Notifications sent to all admins successfully',
      notifications,
    });
  } catch (error) {
    console.error('Error creating notifications:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all notifications for a specific admin
exports.getNotificationsForAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const notifications = await Notification.findAll({
      where: { recipient_id: adminId },
      include: [
        { model: User, as: 'actor', attributes: ['id', 'name', 'email'] },
        { model: Resource, as: 'resource', attributes: ['id', 'name'] },
      ],
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByPk(notificationId);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    notification.is_read = true;
    await notification.save();

    return res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
