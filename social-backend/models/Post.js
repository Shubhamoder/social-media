const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  image: { type: String, default: "" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comment: { type: String, required: true },
      createdAt: { userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      userName: { type: String, required: true }, // Store commenting user's name
      userProfilePic: { type: String, default: "" }, // Store commenting user's profile picture
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now } }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
