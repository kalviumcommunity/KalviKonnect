const prisma = require('../db');
const AppError = require('../utils/AppError');

exports.createBookmark = async (userId, target) => {
  const { noteId, placementId, hackathonId } = target;

  if (!noteId && !placementId && !hackathonId) {
    throw new AppError('At least one of noteId, placementId, or hackathonId must be provided', 400);
  }

  return await prisma.bookmark.create({
    data: {
      userId,
      noteId: noteId || undefined,
      placementId: placementId || undefined,
      hackathonId: hackathonId || undefined,
    },
  });
};

exports.getBookmarks = async (userId, query) => {
  const { page = 1, limit = 10 } = query;
  const skip = (parseInt(page)-1) * Math.min(parseInt(limit), 50);

  const [bookmarks, total] = await Promise.all([
    prisma.bookmark.findMany({
      where: { userId },
      skip, take: Math.min(parseInt(limit), 50),
      include: {
        note: true,
        placement: true,
        hackathon: true
      }
    }),
    prisma.bookmark.count({ where: { userId } })
  ]);

  return { bookmarks, total, page: parseInt(page), limit: parseInt(limit) };
};

exports.deleteBookmark = async (id, userId) => {
  const bookmark = await prisma.bookmark.findUnique({ where: { id } });
  if (!bookmark) throw new AppError('Bookmark not found', 404);

  if (bookmark.userId !== userId) {
    throw new AppError('You do not have permission to delete this bookmark', 403);
  }

  return await prisma.bookmark.delete({ where: { id } });
};
