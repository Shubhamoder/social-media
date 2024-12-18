const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User goes online
    socket.on("userOnline", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("Online Users:", onlineUsers);

      // Broadcast updated list of online users
      io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
    });

    // Send a message
    socket.on("sendMessage", async ({ conversationId, senderId, receiverId, text }) => {
      try {
        const Message = require("../models/Message");
        const newMessage = await Message.create({ conversationId, senderId, receiverId, text });

        io.to(onlineUsers.get(senderId)).emit("receiveMessage", newMessage);
        if (onlineUsers.has(receiverId)) {
          io.to(onlineUsers.get(receiverId)).emit("receiveMessage", newMessage);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // User disconnects
    socket.on("disconnect", () => {
      [...onlineUsers.entries()].forEach(([key, value]) => {
        if (value === socket.id) onlineUsers.delete(key);
      });
      console.log("User disconnected:", socket.id);

      // Broadcast updated list of online users
      io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
    });
  });
};

module.exports = socketHandler;
