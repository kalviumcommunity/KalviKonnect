const noteService = require('../services/notes.service');

exports.analyzeNote = async (req, res, next) => {
  try {
    const result = await noteService.analyzeNoteWithAI(req.params.id);
    if (!result.success) return res.status(200).json(result);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    let universityId = req.user.universityId;
    const prisma = require('../db');
    
    if (!universityId) {
      const currentUser = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { universityId: true }
      });
      universityId = currentUser?.universityId;
    }

    if (!universityId) {
      const firstUniv = await prisma.university.findFirst();
      universityId = firstUniv?.id;
    }

    // Still no universityId? We need a real fallback
    if (!universityId) {
       // Create a default if somehow none exist
       const defaultUniv = await prisma.university.upsert({
         where: { name: 'Kalvium University' },
         update: {},
         create: { name: 'Kalvium University', location: 'Hybrid' }
       });
       universityId = defaultUniv.id;
    }

    const noteData = { 
      ...req.body, 
      universityId: universityId,
      fileUrl: req.file ? req.file.path : null
    };
    const note = await noteService.createNote(noteData, req.user.userId);
    res.status(201).json({ success: true, data: note });
  } catch (err) {
    const fs = require('fs');
    fs.appendFileSync('notes_error.log', `[${new Date().toISOString()}] 🚨 ERROR: ${err.message}\n${err.stack}\n---\n`);
    next(err);
  }
};

exports.getNotes = async (req, res, next) => {
  try {
    const data = await noteService.getNotes(req.query);
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

exports.getNoteById = async (req, res, next) => {
  try {
    const note = await noteService.getNoteById(req.params.id);
    res.status(200).json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const note = await noteService.updateNote(req.params.id, req.user.userId, req.body);
    res.status(200).json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    await noteService.deleteNote(req.params.id, req.user.userId);
    res.status(200).json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};
