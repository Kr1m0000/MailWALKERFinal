const Event = require("../models/event.model");
const User = require("../models/user.model");

// Controller for creating an event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const userId = req.params.id;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "User ID is required in the query parameters." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      user: user._id,
    });

    const savedEvent = await newEvent.save();

    res.status(201).json(savedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating the event." });
  }
};

// Controller for getting all events by user ID
exports.getAllEventsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "User ID is required in the query parameters." });
    }

    const events = await Event.find({ user: userId });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving events." });
  }
};

// Controller for deleting an event
exports.deleteEvent = async (req, res) => {
  try {
    const userId = req.params.id;
    const eventId = req.params.eventId;

    if (!userId || !eventId) {
      return res
        .status(400)
        .json({ error: "User ID and Event ID are required in the query parameters." });
    }

    // Ensure that the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Ensure that the event exists
    const event = await Event.findOne({ _id: eventId, user: userId });

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    // Delete the event
    await Event.deleteOne({ _id: eventId, user: userId });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting the event." });
  }
};
