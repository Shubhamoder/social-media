const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Save the user's socket ID
    socket.on("userOnline", (userId) => {
      onlineUsers.set(userId, socket.id);
      
      console.log("Online Users:", onlineUsers);
    });

    // Join a conversation (this is for group conversations)
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });

    // Send a message
    socket.on("sendMessage", async ({ conversationId, senderId, receiverId, text }) => {
      try {
        // Save the message in the database
        const Message = require("../models/Message");
        
        const newMessage = await Message.create({ conversationId, senderId,receiverId, text });

        // Emit the message to the sender
        io.to(onlineUsers.get(senderId)).emit("receiveMessage", newMessage);

        // Emit the message to the receiver (if they are online)
        if (onlineUsers.has(receiverId)) {
          io.to(onlineUsers.get(receiverId)).emit("receiveMessage", newMessage);
        } else {
          console.log(`User ${receiverId} is not online.`);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      [...onlineUsers.entries()].forEach(([key, value]) => {
        if (value === socket.id) onlineUsers.delete(key);
      });
    });
  });
};

module.exports = socketHandler;
