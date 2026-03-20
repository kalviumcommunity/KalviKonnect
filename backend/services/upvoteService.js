const prisma = require('../db');
const AppError = require('../utils/AppError');

exports.upvote = async (userId, target) => {
  const { noteId, placementId, replyId } = target;

  if (!noteId && !placementId && !replyId) {
    throw new AppError('At least one of noteId, placementId, or replyId must be provided', 400);
  }

  // Use a transaction
  return await prisma.$transaction(async (tx) => {
    // 1. Removed manual check to let Prisma P2002 throw

    // 2. Create the upvote
    const upvote = await tx.upvote.create({
      data: {
        userId,
        noteId: noteId || undefined,
        placementId: placementId || undefined,
        replyId: replyId || undefined,
      },
    });

    // 3. Atomically increment the vote count on the target post
    if (noteId) {
      await tx.note.update({
        where: { id: noteId },
        data: { upvoteCount: { increment: 1 } },
      });
    } else if (placementId) {
      await tx.placementPost.update({
        where: { id: placementId },
        data: { upvoteCount: { increment: 1 } },
      });
    } else if (replyId) {
      await tx.discussionReply.update({
        where: { id: replyId },
        data: { upvoteCount: { increment: 1 } },
      });
    }

    return upvote;
  });
};
