const prisma = require('../db');
const AppError = require('../utils/AppError');

exports.createNote = async (noteData, authorId) => {
  const { title, content, semester, universityId, tags } = noteData;

  // Transaction to create note and connect tags
  return await prisma.note.create({
    data: {
      title,
      content,
      semester: parseInt(semester),
      university: { connect: { id: universityId } },
      author: { connect: { id: authorId } },
      tags: {
        create: tags ? tags.map((tagId) => ({ tag: { connect: { id: tagId } } })) : [],
      },
    },
    include: {
      tags: { include: { tag: true } },
      author: { select: { id: true, email: true, role: true } },
    },
  });
};

exports.getNotes = async (query) => {
  const { page = 1, limit = 10, tag, universityId, sort = 'latest' } = query;
  const skip = (parseInt(page) - 1) * Math.min(parseInt(limit), 50);

  const where = {};
  if (universityId) where.universityId = universityId;
  if (tag) {
    where.tags = {
      some: {
        tag: { name: tag },
      },
    };
  }

  const orderBy = sort === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' };

  const [notes, total] = await Promise.all([
    prisma.note.findMany({
      where,
      orderBy,
      skip,
      take: Math.min(parseInt(limit), 50),
      include: {
        tags: { include: { tag: true } },
        author: { select: { id: true, email: true, role: true } },
      },
    }),
    prisma.note.count({ where }),
  ]);

  return { notes, total, page: parseInt(page), limit: parseInt(limit) };
};

exports.getNoteById = async (id) => {
  const note = await prisma.note.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
      author: { select: { id: true, email: true, role: true } },
    },
  });

  if (!note) throw new AppError('Note not found', 404);
  return note;
};

exports.updateNote = async (id, userId, updateData) => {
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw new AppError('Note not found', 404);

  // Ownership check
  if (note.authorId !== userId) {
    throw new AppError('You do not have permission to edit this note', 403);
  }

  return await prisma.note.update({
    where: { id },
    data: updateData,
  });
};

exports.deleteNote = async (id, userId) => {
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw new AppError('Note not found', 404);

  // Ownership check
  if (note.authorId !== userId) {
    throw new AppError('You do not have permission to delete this note', 403);
  }

  return await prisma.note.delete({ where: { id } });
};
