const notificationService = require('./notificationService');

exports.toggleUpvote = async (userId, target) => {
  const { noteId, placementId, replyId } = target;

  if (!noteId && !placementId && !replyId) {
    throw new AppError('A target (note, placement, or reply) must be provided', 400);
  }

  // Get the contents author name for notification logic later
  const upvoter = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true }
  });

  const where = { userId, noteId, placementId, replyId };
  // Clean nulls from where for findFirst
  Object.keys(where).forEach(key => where[key] === undefined && delete where[key]);

  return await prisma.$transaction(async (tx) => {
    const existing = await tx.upvote.findFirst({
       where: {
         userId,
         ...(noteId && { noteId }),
         ...(placementId && { placementId }),
         ...(replyId && { replyId })
       }
    });

    if (existing) {
      await tx.upvote.delete({ where: { id: existing.id } });

      if (noteId) {
        await tx.note.update({ where: { id: noteId }, data: { upvoteCount: { decrement: 1 } } });
      } else if (placementId) {
        await tx.placementPost.update({ where: { id: placementId }, data: { upvoteCount: { decrement: 1 } } });
      } else if (replyId) {
        await tx.discussionReply.update({ where: { id: replyId }, data: { upvoteCount: { decrement: 1 } } });
      }

      return { liked: false };
    } else {
      await tx.upvote.create({ 
        data: { 
          userId, 
          ...(noteId && { noteId }), 
          ...(placementId && { placementId }), 
          ...(replyId && { replyId }) 
        } 
      });

      let targetAuthorId = null;
      let targetTitle = "";
      let link = "";

      if (noteId) {
        const note = await tx.note.update({ 
          where: { id: noteId }, 
          data: { upvoteCount: { increment: 1 } },
          select: { authorId: true, title: true }
        });
        targetAuthorId = note.authorId;
        targetTitle = note.title;
        link = `/notes/${noteId}`;
      } else if (placementId) {
        const placement = await tx.placementPost.update({ 
          where: { id: placementId }, 
          data: { upvoteCount: { increment: 1 } },
          select: { authorId: true, company: true }
        });
        targetAuthorId = placement.authorId;
        targetTitle = `${placement.company} interview story`;
        link = `/placements/${placementId}`;
      } else if (replyId) {
        const reply = await tx.discussionReply.update({ 
          where: { id: replyId }, 
          data: { upvoteCount: { increment: 1 } },
          select: { authorId: true, threadId: true }
        });
        targetAuthorId = reply.authorId;
        targetTitle = "comment";
        link = `/discussions/${reply.threadId}`;
      }

      // Notify the author (only if it's not self-upvote)
      if (targetAuthorId && targetAuthorId !== userId) {
        notificationService.createNotification(targetAuthorId, {
          type: 'UPVOTE',
          title: 'Your content was upvoted!',
          message: `${upvoter.name} liked your ${targetTitle}`,
          link,
          senderId: userId
        }).catch(err => console.error("Upvote notification failed:", err));
      }

      return { liked: true };
    }
  });
};
