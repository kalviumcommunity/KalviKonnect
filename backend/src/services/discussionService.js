const prisma = require('../db');
const AppError = require('../utils/AppError');

exports.createThread = async (data, authorId) => {
  return await prisma.$withRetry(async () => {
    const { title, content, tags } = data;
    return await prisma.discussionThread.create({
      data: {
        title, content, authorId,
        tags: {
          create: (tags && Array.isArray(tags)) ? tags.filter(id => typeof id === 'string').map(tagId => ({ tag: { connect: { id: tagId } } })) : []
        }
      }
    });
  });
};

exports.getThreads = async (query) => {
  return await prisma.$withRetry(async () => {
    const { page = 1, limit = 10, tag } = query;
    const parsedPage = Math.max(parseInt(page), 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit), 1), 50);
    const skip = (parsedPage - 1) * parsedLimit;

    const where = {};
    if (tag) {
      where.tags = { some: { tag: { name: tag } } };
    }

    const [threads, total] = await prisma.$transaction([
      prisma.discussionThread.findMany({
        where, 
        skip, 
        take: parsedLimit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          content: true,
          replyCount: true,
          createdAt: true,
          author: { select: { id: true, name: true } },
          tags: { select: { tag: { select: { name: true } } } }
        }
      }),
      prisma.discussionThread.count({ where })
    ]);

    return { 
      threads, 
      total, 
      page: parsedPage, 
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
      hasNextPage: parsedPage < Math.ceil(total / parsedLimit)
    };
  });
};

exports.getThreadById = async (id) => {
  return await prisma.$withRetry(async () => {
    const thread = await prisma.discussionThread.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, role: true } },
        tags: { select: { tag: { select: { name: true } } } },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: { select: { id: true, name: true, role: true } }
          }
        }
      }
    });

    if (!thread) throw new AppError('Discussion thread not found', 404);
    return thread;
  });
};

const notificationService = require('./notificationService');

exports.replyToThread = async (threadId, content, authorId, isBlocker = false) => {
  return await prisma.$withRetry(async () => {
    return await prisma.$transaction(async (tx) => {
      const thread = await tx.discussionThread.findUnique({ 
        where: { id: threadId },
        select: { authorId: true, title: true }
      });
      if (!thread) throw new AppError('Thread not found', 404);

      const reply = await tx.discussionReply.create({
        data: { content, threadId, authorId, isBlocker },
        include: {
          author: { select: { id: true, name: true } }
        }
      });

      await tx.discussionThread.update({
        where: { id: threadId },
        data: { replyCount: { increment: 1 } }
      });

      // Notify the thread author (only if it's not self-reply)
      if (thread.authorId && thread.authorId !== authorId) {
        notificationService.createNotification(thread.authorId, {
          type: 'REPLY',
          title: 'New reply to your discussion',
          message: `${reply.author.name} replied to "${thread.title}"`,
          link: `/discussions/${threadId}`,
          senderId: authorId
        }).catch(err => console.error("Reply notification failed:", err));
      }

      return reply;
    });
  });
};

exports.deleteThread = async (threadId, userId) => {
  return await prisma.$withRetry(async () => {
    const thread = await prisma.discussionThread.findUnique({ where: { id: threadId } });
    if (!thread) throw new AppError('Thread not found', 404);
    if (thread.authorId !== userId) throw new AppError('You can only delete your own threads', 403);

    // Delete replies first, then thread
    await prisma.discussionReply.deleteMany({ where: { threadId } });
    await prisma.discussionThread.delete({ where: { id: threadId } });
  });
};
