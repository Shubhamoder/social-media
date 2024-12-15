import React, { useState } from "react";
import axios from "axios";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a FormData object to handle the file upload and post data
    const formData = new FormData();
    formData.append("content", content); // Append the content field
    if (image) formData.append("image", image); // Append the image if selected
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the correct content type is set for file upload
       Authorization: `Bearer ${token}`
        },
      });
      console.log("Post created successfully:", response.data);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
  <h1 className="text-3xl font-semibold text-center text-gray-700 mb-4">Create Post</h1>
  <form onSubmit={handleSubmit}>
    {/* Content Field */}
    <div className="mb-4">
      <label htmlFor="content" className="block text-sm font-medium text-gray-600">Content:</label>
      <input
        type="text"
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="What's on your mind?"
      />
    </div>
    
    {/* Image Upload Field */}
    <div className="mb-6">
      <label htmlFor="image" className="block text-sm font-medium text-gray-600">Image:</label>
      <input
        type="file"
        accept="image/*"
        id="image"
        onChange={(e) => setImage(e.target.files[0])}
        className="mt-1 block w-full text-sm text-gray-600 file:border file:border-gray-300 file:rounded-md file:p-2 file:text-sm file:font-medium file:bg-gray-50 hover:file:bg-gray-100"
      />
    </div>

    {/* Submit Button */}
    <div className="flex justify-center">
      <button
        type="submit"
        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Create Post
      </button>
    </div>
  </form>
</div>

  );
};

export default CreatePost;
