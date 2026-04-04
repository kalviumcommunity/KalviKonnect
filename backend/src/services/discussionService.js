const prisma = require('../db');
const AppError = require('../utils/AppError');

exports.createThread = async (data, authorId) => {
  const { title, content, tags } = data;
  return await prisma.discussionThread.create({
    data: {
      title, content, authorId,
      tags: {
        create: tags ? tags.map(tagId => ({ tagId })) : []
      }
    }
  });
};

exports.getThreads = async (query) => {
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
};

exports.getThreadById = async (id) => {
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
};

exports.replyToThread = async (threadId, content, authorId, isBlocker = false) => {
  return await prisma.$transaction(async (tx) => {
    const thread = await tx.discussionThread.findUnique({ where: { id: threadId } });
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

    return reply;
  });
};
