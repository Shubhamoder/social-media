// routes/messageRoutes.js
const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

// Route to store a message (as previously discussed)
router.post("/send", async (req, res) => {
  try {
    const { conversationId, senderId, receiverId, text } = req.body;

    // Create a new message
    const newMessage = new Message({
      conversationId,
      senderId,
      receiverId,
      text,
    });

    // Save the message to the database
    await newMessage.save();

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error storing message:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Route to fetch all messages for a specific user
router.get("/conversation/:conversationId", async (req, res) => {
  const conversationId = req.params.conversationId; // Use conversationId from URL params
  const [userId1, userId2] = conversationId.split("_"); // Extract user IDs from conversationId

  try {
    // Find all messages where the sender or receiver matches userId1 or userId2
    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ],
    }).sort({ timestamp: -1 });

    if (!messages.length) {
      return res.status(404).json({ success: false, message: "No messages found" });
    }

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



module.exports = router;
