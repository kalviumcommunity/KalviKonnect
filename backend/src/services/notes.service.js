const prisma = require('../db');
const AppError = require('../utils/AppError');
const { generateResponse } = require("./aiService");
const { buildNoteSummaryPrompt, parseAIJson } = require("../utils/promptBuilder");

exports.getSummaryForNote = async (noteId) => {
  const note = await prisma.note.findUnique({
    where:  { id: noteId },
    select: { id: true, title: true, content: true },
  });
  if (!note) throw Object.assign(new Error("Note not found"), { statusCode: 404 });

  const { systemMsg, userPrompt } = buildNoteSummaryPrompt(note);
  const aiResult = await generateResponse(userPrompt, systemMsg);

  if (!aiResult.success) return aiResult;

  const parsed = parseAIJson(aiResult.data.result);
  return parsed.success ? { success: true, data: parsed.data } : parsed;
};

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
      author: true,
    },
  });
};

exports.getNotes = async (query) => {
  const { page = 1, limit = 10, tag, universityId, sort = 'latest' } = query;
  const parsedPage = Math.max(parseInt(page), 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit), 1), 50);
  const skip = (parsedPage - 1) * parsedLimit;

  const where = {};
  if (universityId) {
    where.universityId = universityId;
  }
  if (tag) {
    where.tags = {
      some: {
        tag: {
          name: tag
        }
      }
    };
  }

  const orderBy = sort === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' };

  const [notes, total] = await prisma.$transaction([
    prisma.note.findMany({
      where,
      orderBy,
      skip,
      take: parsedLimit,
      select: {
        id: true,
        title: true,
        semester: true,
        upvoteCount: true,
        visibility: true,
        createdAt: true,
        author: { select: { id: true, name: true } },
        university: { select: { name: true } },
        tags: {
          select: {
            tag: { select: { id: true, name: true } }
          }
        }
      }
    }),
    prisma.note.count({ where })
  ]);

  return { 
    notes, 
    total, 
    page: parsedPage, 
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
    hasNextPage: parsedPage < Math.ceil(total / parsedLimit)
  };
};

exports.getNoteById = async (id) => {
  const note = await prisma.note.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
      author: true,
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
