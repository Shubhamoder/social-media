import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

// Create a socket connection
const socket = io("http://localhost:5000");

const ChatComponent = ({ userId }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState(null);
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      console.error("User ID is missing.");
      return;
    }

    console.log("User ID from localStorage:", storedUserId);

    socket.emit("userOnline", storedUserId); // Notify the server that the user is online

    // Fetch all users using axios
    axios
      .get("http://localhost:5000/api/users")
      .then((response) => {
        console.log(response.data.users);
        setAllUsers(response.data.users); // Store all users in the state
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });

    socket.on("updateOnlineUsers", (users) => {
      console.log("Received online users:", users);
    });

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("updateOnlineUsers");
      socket.off("receiveMessage");
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() && receiverId) {
      const newMessage = {
        conversationId,
        senderId: userId,
        receiverId,
        text: message,
      };

      socket.emit("sendMessage", newMessage); // Emit message to the server

      // Save message to the database
      axios
        .post("http://localhost:5000/api/messages/send", newMessage)
        .then((response) => {
          console.log("Message saved to database:", response.data.message);
        })
        .catch((error) => {
          console.error("Error saving message to database:", error);
        });

      setMessage(""); // Clear input after sending message
    }
  };

  const startChat = (id) => {
    setReceiverId(id);
    setConversationId([userId, id].sort().join("_"));
    setMessages([]);

    // Fetch messages for this conversation
    axios
  .get(`http://localhost:5000/api/messages/conversation/${[userId, id].sort().join("_")}`)
  .then((response) => {
    console.log("Messages for conversation:", response.data.messages);
    setMessages(response.data.messages);
  })
  .catch((error) => {
    console.error("Error fetching messages:", error);
  });

  };

  if (!userId) {
    return <div>Error: User ID is missing!</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Users</h3>
        {allUsers.length === 0 ? (
          <p>No users available</p>
        ) : (
          <ul>
            {allUsers
              .filter((user) => user.id !== userId)
              .map((user) => (
                <li
                  key={user._id || user.username}
                  onClick={() => startChat(user._id)}
                  className="cursor-pointer px-4 py-2 rounded-md hover:bg-gray-700 transition"
                >
                  {user.username}
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Chat Window */}
      {receiverId && (
        <div className="flex flex-col flex-grow bg-white p-6 border-l border-gray-300">
          <div className="bg-blue-600 text-white p-4 rounded-md mb-4">
            <h2 className="text-xl">Chat with {receiverId}</h2>
          </div>

          <div className="flex-grow overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.senderId === userId ? "bg-green-100 self-end" : "bg-gray-100 self-start"
                } p-3 mb-3 rounded-lg max-w-xs break-words`}
              >
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="ml-4 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
