const noteService = require('../services/notes.service');

exports.summarizeNote = async (req, res, next) => {
  try {
    const result = await noteService.getSummaryForNote(req.params.id);
    if (!result.success) return res.status(503).json(result);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    const note = await noteService.createNote(req.body, req.user.id);
    res.status(201).json({ error: false, data: note });
  } catch (err) {
    next(err);
  }
};

exports.getNotes = async (req, res, next) => {
  try {
    const data = await noteService.getNotes(req.query);
    // Caching
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.status(200).json({ error: false, ...data });
  } catch (err) {
    next(err);
  }
};

exports.getNoteById = async (req, res, next) => {
  try {
    const note = await noteService.getNoteById(req.params.id);
    res.status(200).json({ error: false, data: note });
  } catch (err) {
    next(err);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const note = await noteService.updateNote(req.params.id, req.user.id, req.body);
    res.status(200).json({ error: false, data: note });
  } catch (err) {
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    await noteService.deleteNote(req.params.id, req.user.id);
    res.status(204).json({ error: false, data: null });
  } catch (err) {
    next(err);
  }
};
