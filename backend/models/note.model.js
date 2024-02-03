const mongoose = require('mongoose');


const NoteSchema = new mongoose.Schema({
  author: String,
  subject: String,
  body: String,
  sentAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('note', NoteSchema);