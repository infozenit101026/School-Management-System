import Notification from '../models/Notification.js';

// Create and dispatch a new notification
export const createNotification = async (req, res, next) => {
  try {
    const { title, message, type, recipientUsers, recipientRoles } = req.body;

    const notification = await Notification.create({
      title,      //[cite: 15]
      message,    //[cite: 15]
      type,       // e.g., 'FEE_DUE', 'EVENT', 'SYSTEM_ANNOUNCEMENT'[cite: 15]
      recipientUsers: recipientUsers || [], //[cite: 15]
      recipientRoles: recipientRoles || [], //[cite: 15]
      createdBy: req.user._id //[cite: 15]
    });

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

// Get notifications for the currently logged-in user
export const getMyNotifications = async (req, res, next) => {
  try {
    // Match notifications where the user is explicitly targeted OR their role is targeted[cite: 15]
    const notifications = await Notification.find({
      $or: [
        { recipientUsers: req.user._id },
        { recipientRoles: req.user.role }
      ]
    })
    .sort({ createdAt: -1 }) // Newest first
    .lean(); // Convert to plain JS objects for mapping

    // Add a boolean flag to easily indicate if the user has read it[cite: 15]
    const formattedNotifications = notifications.map(notif => ({
      ...notif,
      isRead: notif.isReadBy.some(id => id.toString() === req.user._id.toString())
    }));

    res.status(200).json({ success: true, data: formattedNotifications });
  } catch (error) {
    next(error);
  }
};

// Mark a specific notification as read by the current user
export const markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    // Use $addToSet to add the user's ID to the isReadBy array only if it doesn't already exist[cite: 15]
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { $addToSet: { isReadBy: req.user._id } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};