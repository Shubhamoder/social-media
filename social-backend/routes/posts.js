// server.js or routes/user.js (Backend route)
const express = require('express');
const authMiddleware = require('.././middleware/authmiddleware');
const cloudinary=require('../config/cloudinary-config');
const multer = require("multer");
const path = require('path');
const mongoose = require('mongoose');
// const bcrypt = require('bcrypt'); // For hashing passwords
const Post = require('../models/Post'); // Import your User model
const storage = multer.memoryStorage();  // We will store the file in memory to upload it to Cloudinary directly
const upload = multer({ storage: storage });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,  // Replace with your Cloudinary Cloud Name
  api_key: process.env.API_KEY,        // Replace with your Cloudinary API Key
  api_secret: process.env.API_SECRET,  // Replace with your Cloudinary API Secret
});

const router = express.Router();

// Handle creating a post
router.post('/create', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { content } = req.body;
    let image = '';

    if (req.file) {
      // Upload the image to Cloudinary
      cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
        if (error) {
          return res.status(400).json({ message: 'Error uploading to Cloudinary', error });
        }

        // If upload is successful, get the image URL
        image = result.secure_url; // This is the image URL that you can store in the database

        // Create the post with the image URL
        const newPost = new Post({
          userId: req.user.id,
          content,
          image,
        });

        await newPost.save();
        return res.status(201).json(newPost); // Send back the created post with the image URL
      }).end(req.file.buffer);
    } else {
      // If no image, create a post without an image URL
      const newPost = new Post({
        userId: req.user.id,
        content,
        image: null,
      });

      await newPost.save();
      return res.status(201).json(newPost); // Send back the created post without the image URL
    }
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(400).json({ message: "Error creating post", error });
  }
});

// Create a Post
// router.post("/create", async (req, res) => {
//     const { userId, content, image } = req.body;
  
//     if (!userId || !content) {
//       return res.status(400).json({ message: "User ID and content are required" });
//     }
  
//     try {
//       const post = new Post({ userId, content, image });
//       const savedPost = await post.save();
//       res.status(201).json({ success: true, post: savedPost });
//     } catch (error) {
//       res.status(500).json({ success: false, message: "Failed to create post", error });
//     }
//   });
  
  // Get All Posts
  router.get("/", async (req, res) => {
    try {
      const posts = await Post.find()
        .populate("userId", "username profilePicture") // Populate user details
        .populate("comments.userId", "username profilePicture") // Populate comment authors
        .sort({ createdAt: -1 }); // Sort by newest first
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch posts", error });
    }
  });

  module.exports = router;