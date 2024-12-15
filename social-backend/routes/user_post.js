// server.js or routes/user.js (Backend route)
const express = require('express');
const mongoose = require('mongoose');
// const bcrypt = require('bcrypt'); // For hashing passwords
const User = require('../models/User'); // Import your User model
const router = express.Router();
// Create a Post
router.post("/create", async (req, res) => {
    const { userId, content, image } = req.body;
  
    if (!userId || !content) {
      return res.status(400).json({ message: "User ID and content are required" });
    }
  
    try {
      const post = new Post({ userId, content, image });
      const savedPost = await post.save();
      res.status(201).json({ success: true, post: savedPost });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create post", error });
    }
  });
  
  // Get All Posts
  router.get("/", async (req, res) => {
    try {
      const posts = await Post.find()
        .populate("userId", "name profilePicture") // Populate user details
        .populate("comments.userId", "name profilePicture") // Populate comment authors
        .sort({ createdAt: -1 }); // Sort by newest first
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch posts", error });
    }
  });

  module.exports = router;