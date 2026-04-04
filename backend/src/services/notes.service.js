const prisma = require('../db');
const AppError = require('../utils/AppError');
const { generateResponse } = require("./aiService");
const { buildNoteSummaryPrompt, parseAIJson } = require("../utils/promptBuilder");

exports.analyzeNoteWithAI = async (noteId) => {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    select: { 
      id: true, 
      title: true, 
      content: true,
      aiSummary: true,
      aiKeyPoints: true,
      aiTopics: true,
      aiAnalyzedAt: true
    },
  });

  if (!note) throw new AppError("Note not found", 404);

  // Cache Check: Use cached results if analyze within last 24 hours
  const CACHE_LIMIT = 24 * 60 * 60 * 1000; // 24 hours in ms
  const isCacheValid = note.aiAnalyzedAt && (Date.now() - new Date(note.aiAnalyzedAt).getTime() < CACHE_LIMIT);

  if (isCacheValid && note.aiSummary) {
    console.log(`[AI CACHE] Returning cached analysis for note: ${noteId}`);
    return {
      success: true,
      data: {
        summary: note.aiSummary,
        keyPoints: note.aiKeyPoints,
        examTopics: note.aiTopics,
        cached: true,
        lastAnalyzed: note.aiAnalyzedAt
      }
    };
  }

  // No valid cache -> Run Gemini Analysis
  const { systemMsg, userPrompt } = buildNoteSummaryPrompt(note);
  const aiResult = await generateResponse(userPrompt, systemMsg);

  if (!aiResult.success) return aiResult;

  const parsed = parseAIJson(aiResult.text);
  if (!parsed.success) return parsed;

  const { summary, keyPoints, examTopics } = parsed.data;

  // Save to Note for caching
  const updatedNote = await prisma.note.update({
    where: { id: noteId },
    data: {
      aiSummary: summary,
      aiKeyPoints: keyPoints,
      aiTopics: examTopics,
      aiAnalyzedAt: new Date()
    }
  });

  return {
    success: true,
    data: {
      summary: updatedNote.aiSummary,
      keyPoints: updatedNote.aiKeyPoints,
      examTopics: updatedNote.aiTopics,
      cached: false,
      lastAnalyzed: updatedNote.aiAnalyzedAt
    }
  };
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
  const { page = 1, limit = 10, tag, universityId, semester, sort = 'latest' } = query;
  const parsedPage = Math.max(parseInt(page), 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit), 1), 50);
  const skip = (parsedPage - 1) * parsedLimit;

  const where = {};
  if (universityId) {
    where.universityId = universityId;
  }
  if (semester) {
    where.semester = parseInt(semester);
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
      author: { select: { id: true, name: true, role: true } },
      university: { select: { id: true, name: true } }
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
