import React, { useState, useEffect } from "react";
import axios from "axios";

const MainComponent = () => {
  const [posts, setPosts] = useState([]); // Initialize posts as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/posts");
        console.log("API response:", response.data); // Debug the response
        setPosts(response.data || []); // Set the posts directly
        setLoading(false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Error loading posts");
        setLoading(false);
      }
    };
  
    fetchPosts();
  }, []); // Empty dependency array to run only once when the component mounts
  
  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
  <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">All Posts</h1>

  <div className="space-y-8">
    {posts.length === 0 ? (
      <p className="text-center text-gray-500">No posts available.</p>
    ) : (
      posts.map((post) => (
        <div
          key={post._id}
          className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out"
        >
          {/* Post Content */}
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">{post.content}</h2>
          </div>

          {/* Post Image */}
          {post.image && (
            <img
              className="w-full h-72 object-cover rounded-t-lg"
              src={post.image}
              alt="Post"
            />
          )}

          {/* Post Info */}
          <div className="px-6 py-4 flex justify-between items-center text-gray-600">
            <div className="flex items-center space-x-3">
              {/* User's Profile Picture */}
              {post.userId?.profilePicture ? (
                <img
                  src={post.userId.profilePicture}
                  alt="User Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                  <span>{post.userId?.username?.[0]}</span>
                </div>
              )}
              <p className="text-sm">{post.userId?.username || "Anonymous"}</p>
            </div>
            <p className="text-sm">Likes: {post.likes?.length || 0}</p>
          </div>

          {/* Comments Section */}
          <div className="px-6 pb-4">
            <h3 className="font-semibold text-lg text-gray-800">Comments:</h3>
            {post.comments?.length > 0 ? (
              <ul className="space-y-2">
                {post.comments.map((comment) => (
                  <li key={comment._id} className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      {/* Commenter's Profile Picture */}
                      {comment.userId?.profilePicture ? (
                        <img
                          src={comment.userId.profilePicture}
                          alt="Commenter Profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                          <span>{comment.userId?.username?.[0]}</span>
                        </div>
                      )}
                      <span className="font-medium text-gray-900">
                        {comment.userId?.username || "Anonymous"}:
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{comment.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No comments yet.</p>
            )}
          </div>
        </div>
      ))
    )}
  </div>
</div>

  );
};

export default MainComponent;
