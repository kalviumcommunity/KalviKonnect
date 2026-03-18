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

exports.getAnnouncements = async () => {
  return await prisma.announcement.findMany({
    orderBy: [
      { isSticky: 'desc' },
      { createdAt: 'desc' },
    ],
    include: {
      author: { select: { id: true, email: true, role: true } },
    },
  });
};
