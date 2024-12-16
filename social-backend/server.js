const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Register routes BEFORE starting the server
app.use("/api", require("./routes/user"));
app.use("/posts", require("./routes/posts"));
app.use('/api/messages',require("./routes/message.js"));
// MongoDB Connection and Server Start
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    console.log("Connected to database:", mongoose.connection.name); // Log the connected database
    // Start the server only after DB is connected
    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: "*" } });

    // Initialize socket.io handler
    const socketHandler = require("./socket/socket.js");
    socketHandler(io);

    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
