const prisma = require('../db');

exports.getDashboardFeed = async (universityId, page = 1) => {
  const limit = 10;
  // Bug: No composite index on [universityId, visibility, createdAt] in schema
  // We execute two queries and then merge/sort in memory, or just return them.
  // To keep it simple and represent the 'Dashboard dual feed', we fetch notes and announcements.
  
  const notes = await prisma.note.findMany({
    where: {
      universityId: universityId,
      visibility: 'UNIVERSITY_ONLY'
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit,
    include: {
      author: true
    }
  });

  const announcements = await prisma.announcement.findMany({
    where: {
      visibility: 'UNIVERSITY_ONLY',
      author: {
        universityId: universityId
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit,
    include: {
      author: true
    }
  });

  // Combine and sort in memory (dual feed behavior)
  const feed = [...notes.map(n => ({ ...n, type: 'NOTE' })), ...announcements.map(a => ({ ...a, type: 'ANNOUNCEMENT' }))]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);

  return feed;
};
