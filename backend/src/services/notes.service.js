const prisma = require('../db');
const AppError = require('../utils/AppError');
const { generateResponse } = require("./aiService");
const { buildNoteSummaryPrompt, parseAIJson } = require("../utils/promptBuilder");
const { prepareMultimodalData } = require("../utils/aiUtils");

exports.analyzeNoteWithAI = async (noteId) => {
  return await prisma.$withRetry(async () => {
    const note = await prisma.note.findUnique({
      where: { id: noteId },
      select: { 
        id: true, 
        title: true, 
        content: true,
        fileUrls: true,
        aiSummary: true,
        aiKeyPoints: true,
        aiTopics: true,
        aiAnalyzedAt: true
      },
    });

    if (!note) throw new AppError("Note not found", 404);

    // Cache Check: Use cached results if analyzed within last 24 hours
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

    // Process first file if present (Multimodal)
    const { fileParts, extractedText } = await prepareMultimodalData(note.fileUrls[0]);
    
    let analysisContent = note.content || "";
    if (extractedText) {
      analysisContent = `${analysisContent}\n\n[ATTACHED FILE CONTENT]:\n${extractedText}`;
    }

    // Fallback if no content at all
    if (!analysisContent.trim() && fileParts.length === 0) {
      analysisContent = `Resource Title: ${note.title}. Please analyze based on the title as no other content is available.`;
    }


    // No valid cache -> Run Gemini Analysis (Multimodal)
    const { systemMsg, userPrompt } = buildNoteSummaryPrompt({ ...note, content: analysisContent });
    const aiResult = await generateResponse(userPrompt, systemMsg, fileParts);

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
  });
};

exports.createNote = async (noteData, authorId) => {
  return await prisma.$withRetry(async () => {
    console.log('[DEBUG] createNote called with:', { ...noteData, authorId });
    const { title, content, semester, universityId, tags, fileUrls } = noteData;

    // Bulletproof Semester (1-8)
    const safeSemester = parseInt(semester) || 1;

    // Parse tags if they come in as a JSON string
    let parsedTags = [];
    if (typeof tags === 'string' && tags.trim().length > 0) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = [];
      }
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }

    // Ensure parsedTags only contains valid string IDs
    const validTagIds = parsedTags.filter(id => typeof id === 'string' && id.startsWith('tag-'));

    // Transaction to create note and connect tags
    try {
      return await prisma.note.create({
        data: {
          title,
          content,
          semester: safeSemester,
          fileUrls: fileUrls || [],
          university: { connect: { id: universityId } },
          author: { connect: { id: authorId } },
          tags: {
            create: validTagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })),
          },
        },
        include: {
          tags: { include: { tag: true } },
          author: { select: { id: true, name: true, role: true } },
        },
      });
    } catch (err) {
      console.error('❌ PRISMA CREATE ERROR:', err);
      throw err;
    }
  });
};

exports.getNotes = async (query) => {
  return await prisma.$withRetry(async () => {
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
          content: true,
          fileUrls: true,
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
  });
};

exports.getNoteById = async (id) => {
  return await prisma.$withRetry(async () => {
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
  });
};

exports.updateNote = async (id, userId, updateData) => {
  return await prisma.$withRetry(async () => {
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
  });
};

exports.deleteNote = async (id, userId) => {
  return await prisma.$withRetry(async () => {
    const note = await prisma.note.findUnique({ where: { id } });
    if (!note) throw new AppError('Note not found', 404);

    // Ownership check
    if (note.authorId !== userId) {
      throw new AppError('You do not have permission to delete this note', 403);
    }

    return await prisma.note.delete({ where: { id } });
  });
};
