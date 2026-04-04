const notificationService = require('./notificationService');

exports.createAnnouncement = async (data, authorId) => {
  const { title, content, isSticky } = data;

  const user = await prisma.user.findUnique({
    where: { id: authorId },
    select: { universityId: true }
  });

  const announcement = await prisma.announcement.create({
    data: {
      title,
      content,
      isSticky: isSticky || false,
      author: { connect: { id: authorId } },
    },
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
};

exports.getAnnouncements = async (query = {}) => {
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
      select: {
        id: true,
        title: true,
        isSticky: true,
        createdAt: true,
        author: { select: { id: true, name: true } },
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
};
