const prisma = require('../db');

exports.createAnnouncement = async (data, authorId) => {
  const { title, content, isSticky } = data;

  return await prisma.announcement.create({
    data: {
      title,
      content,
      isSticky: isSticky || false,
      author: { connect: { id: authorId } },
    },
  });
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
