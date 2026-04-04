const prisma = require('../db');
const AppError = require('../utils/AppError');

exports.toggleUpvote = async (userId, target) => {
  const { noteId, placementId, replyId } = target;

  if (!noteId && !placementId && !replyId) {
    throw new AppError('A target (note, placement, or reply) must be provided', 400);
  }

  const where = { userId };
  if (noteId) where.noteId = noteId;
  else if (placementId) where.placementId = placementId;
  else if (replyId) where.replyId = replyId;

  return await prisma.$transaction(async (tx) => {
    const existing = await tx.upvote.findFirst({ where });

    if (existing) {
      await tx.upvote.delete({ where: { id: existing.id } });

      if (noteId) {
        await tx.note.update({ where: { id: noteId }, data: { upvoteCount: { decrement: 1 } } });
      } else if (placementId) {
        await tx.placementPost.update({ where: { id: placementId }, data: { upvoteCount: { decrement: 1 } } });
      } else if (replyId) {
        await tx.discussionReply.update({ where: { id: replyId }, data: { upvoteCount: { decrement: 1 } } });
      }

      return { upvoted: false };
    } else {
      await tx.upvote.create({ data: { userId, ...(noteId && { noteId }), ...(placementId && { placementId }), ...(replyId && { replyId }) } });

      if (noteId) {
        await tx.note.update({ where: { id: noteId }, data: { upvoteCount: { increment: 1 } } });
      } else if (placementId) {
        await tx.placementPost.update({ where: { id: placementId }, data: { upvoteCount: { increment: 1 } } });
      } else if (replyId) {
        await tx.discussionReply.update({ where: { id: replyId }, data: { upvoteCount: { increment: 1 } } });
      }

      return { upvoted: true };
    }
  });
};
