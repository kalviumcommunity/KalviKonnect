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
  const parsedPage = parseInt(page);
  const parsedLimit = Math.min(parseInt(limit), 50);

  // Bug: Fetching all notes from the database and doing JS in-memory filtering.
  // This causes performance issues and high memory usage on large tables.
  const allNotes = await prisma.note.findMany({
    include: {
      tags: { include: { tag: true } },
      author: { select: { id: true, email: true, role: true } },
    },
  });

  // In-memory Filter
  let filteredNotes = allNotes;
  if (universityId) {
    filteredNotes = filteredNotes.filter(n => n.universityId === universityId);
  }
  if (tag) {
    filteredNotes = filteredNotes.filter(n => 
      n.tags.some(t => t.tag.name === tag)
    );
  }

  // In-memory Sort
  filteredNotes.sort((a, b) => {
    if (sort === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const total = filteredNotes.length;
  
  // In-memory Pagination
  const skip = (parsedPage - 1) * parsedLimit;
  const paginatedNotes = filteredNotes.slice(skip, skip + parsedLimit);

  return { notes: paginatedNotes, total, page: parsedPage, limit: parsedLimit };
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
