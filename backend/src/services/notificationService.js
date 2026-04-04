const prisma = require('../db');
const socketUtil = require('../utils/socket');

/**
 * Creates a notification in the database and emits it via socket if user is online
 * @param {string} userId - Recipient user ID
 * @param {object} data - Notification content { type, title, message, link, senderId }
 */
const createNotification = async (userId, data) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: data.type || 'INFO',
        title: data.title,
        message: data.message,
        link: data.link,
        senderId: data.senderId
      }
    });

    // Emit live event via socket
    try {
      const io = socketUtil.getIO();
      io.to(`user_${userId}`).emit('new_notification', notification);
    } catch (socketErr) {
      // Socket not initialized or user not connected - non-critical
      console.warn("Socket emission failed for notification:", socketErr.message);
    }

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

const getNotifications = async (userId, limit = 20) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      sender: {
        select: { name: true, role: true }
      }
    }
  });
};

const markNotificationAsRead = async (id, userId) => {
  return await prisma.notification.updateMany({
    where: { id, userId },
    data: { isRead: true }
  });
};

const markAllAsRead = async (userId) => {
  return await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  });
};

module.exports = {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  markAllAsRead
};
