const NoteModel = require('../models/note.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.saveNote = async (req, res) => {
  try {
    const { author, subject, body, sentAt } = req.body;

    const newNote = new NoteModel({
      author,
      subject,
      body,
      sentAt,
    });

    await newNote.save();

    await UserModel.updateOne(
      { _id: author },
      { $push: { Notes: newNote._id } }
    );

    return res.status(201).json({ message: 'Note saved successfully.' });
  } catch (error) {
    console.error('Error saving and sending note:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports.getNotes = async (req, res) => {
  try {
    const loggedInUserId = req.params.id;
    const loggedInUser = await UserModel.findOne({ _id: loggedInUserId });

    const Notes = loggedInUser.Notes || [];

    const detailedNotes = await NoteModel.find({ _id: { $in: Notes } });

    res.json(detailedNotes);
  } catch (error) {
    console.error('Error retrieving notes:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports.getBinNotes = async (req, res) => {
  try {
    const loggedInUserId = req.params.id;
    const loggedInUser = await UserModel.findOne({ _id: loggedInUserId });

    const binNotes = loggedInUser.binNotes || [];

    const binNotesData = await NoteModel.find({ _id: { $in: binNotes } });

    res.json(binNotesData);
  } catch (error) {
    console.error('Error retrieving bin notes:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports.moveNoteToBin = async (req, res) => {
  try {
    const { noteIds } = req.body;

    if (!noteIds || !Array.isArray(noteIds)) {
      return res.status(400).json({ error: 'Invalid noteIds field.' });
    }

    const loggedInUserId = req.params.id;

    await UserModel.updateOne(
      { _id: loggedInUserId },
      {
        $push: { binNotes: { $each: noteIds } },
        $pull: {
          Notes: { $in: noteIds },
        },
      }
    );

    res.json({ message: 'Notes moved to bin successfully.' });
  } catch (error) {
    console.error('Error moving notes to bin:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
