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
  const skip = (parseInt(page)-1) * Math.min(parseInt(limit), 50);

  const where = {};
  if (tag) {
    where.tags = { some: { tag: { name: tag } } };
  }

  const [threads, total] = await Promise.all([
    prisma.discussionThread.findMany({
      where, skip, take: Math.min(parseInt(limit), 50),
      include: { author: { select: { id: true, email: true, role: true } } }
    }),
    prisma.discussionThread.count({ where })
  ]);

  return { threads, total, page: parseInt(page), limit: parseInt(limit) };
};

exports.replyToThread = async (threadId, content, authorId) => {
  return await prisma.$transaction(async (tx) => {
    const thread = await tx.discussionThread.findUnique({ where: { id: threadId } });
    if (!thread) throw new AppError('Thread not found', 404);

    const reply = await tx.discussionReply.create({
      data: { content, threadId, authorId }
    });

    await tx.discussionThread.update({
      where: { id: threadId },
      data: { replyCount: { increment: 1 } }
    });

    return reply;
  });
};
