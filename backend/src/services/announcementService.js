const prisma = require('../db');
const AppError = require('../utils/AppError');
const notificationService = require('./notificationService');

exports.createAnnouncement = async (data, authorId, role) => {
  return await prisma.$withRetry(async () => {
    // Only Campus Managers can post broadcasts
    if (role !== 'CAMPUS_MANAGER') {
      throw new AppError('Only Campus Managers can post broadcasts', 403);
    }

    const { title, content, isSticky, visibility } = data;

    const user = await prisma.user.findUnique({
      where: { id: authorId },
      select: { universityId: true }
    });

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        isSticky: isSticky || false,
        visibility: visibility || 'UNIVERSITY_ONLY',
        author: { connect: { id: authorId } },
      },
      include: {
        author: {
          select: { id: true, name: true, role: true }
        }
      }
    });

    // Background broadcast to all users in the same university
    if (user?.universityId) {
      const universityUsers = await prisma.user.findMany({
        where: { universityId: user.universityId, id: { not: authorId } },
        select: { id: true }
      });

      // Fire and forget broadcast
      Promise.all(universityUsers.map(u => 
        notificationService.createNotification(u.id, {
          type: 'ANNOUNCEMENT',
          title: `Campus Announcement: ${title}`,
          message: content.substring(0, 50) + '...',
          link: '/announcements',
          senderId: authorId
        })
      )).catch(err => console.error("Broadcast failed:", err));
    }

    return announcement;
  });
};

exports.getAnnouncements = async (query = {}) => {
  return await prisma.$withRetry(async () => {
    const { page = 1, limit = 10 } = query;
    const parsedPage = Math.max(parseInt(page), 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit), 1), 50);
    const skip = (parsedPage - 1) * parsedLimit;

    const [announcements, total] = await prisma.$transaction([
      prisma.announcement.findMany({
        skip,
        take: parsedLimit,
        orderBy: [
          { isSticky: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          author: {
            select: { id: true, name: true, role: true }
          }
        }
      }),
      prisma.announcement.count()
    ]);

    return { 
      announcements, 
      total, 
      page: parsedPage, 
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
      hasNextPage: parsedPage < Math.ceil(total / parsedLimit)
    };
  });
};

exports.deleteAnnouncement = async (id, userId, role) => {
  return await prisma.$withRetry(async () => {
    const announcement = await prisma.announcement.findUnique({ where: { id } });
    if (!announcement) throw new AppError('Announcement not found', 404);
    
    // Authorization: only the author or a Campus Manager can delete
    if (announcement.authorId !== userId && role !== 'CAMPUS_MANAGER') {
      throw new AppError('Not authorized to delete this announcement', 403);
    }
    
    await prisma.announcement.delete({ where: { id } });
    return { success: true };
  });
};
