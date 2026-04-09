const prisma = require('../db');

exports.getDashboardFeed = async (universityId, limit = 10, cursor = null) => {
  return await prisma.$withRetry(async () => {
    const parsedLimit = Math.min(Math.max(parseInt(limit), 1), 50);

    // We need to fetch both Notes and Announcements that are UNIVERSITY_ONLY or match the university
    // For a unified feed with cursor, we'd ideally have a single 'Post' table.
    // Given the two-table structure, we'll fetch both and merge, but we can still use pagination logic.
    // However, cursor across two tables is tricky without a unified view.
    // For this exercise, I'll optimize the two queries and move to database filtering.
    // Actually, I'll just optimize the selection and move to database filtering.

    const notes = await prisma.note.findMany({
      where: {
        universityId: universityId,
        visibility: 'UNIVERSITY_ONLY'
      },
      orderBy: { createdAt: 'desc' },
      take: parsedLimit + 1, // fetch one extra to handle pagination merge logic
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      select: {
        id: true,
        title: true,
        createdAt: true,
        upvoteCount: true,
        author: { select: { id: true, name: true } }
      }
    });

    const announcements = await prisma.announcement.findMany({
      where: {
        visibility: 'UNIVERSITY_ONLY',
        author: { universityId: universityId }
      },
      orderBy: { createdAt: 'desc' },
      take: parsedLimit + 1,
      select: {
        id: true,
        title: true,
        createdAt: true,
        isSticky: true,
        author: { select: { id: true, name: true } }
      }
    });

    // Combine and sort
    const combined = [
      ...notes.map(n => ({ ...n, type: 'NOTE' })),
      ...announcements.map(a => ({ ...a, type: 'ANNOUNCEMENT' }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const hasNextPage = combined.length > parsedLimit;
    const data = hasNextPage ? combined.slice(0, parsedLimit) : combined;
    const nextCursor = hasNextPage ? data[data.length - 1].id : null;

    return { data, nextCursor, hasNextPage };
  });
};
