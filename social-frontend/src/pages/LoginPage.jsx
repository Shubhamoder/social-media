import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      // Save the token to localStorage (or cookies)
      localStorage.setItem("token", response.data.token);

      // Redirect to the home page or dashboard
      navigate("/home");
    } catch (err) {
      // Handle login errors
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-full flex-col  px-6 py-12 lg:px-8">
      <div>
      <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Login</h2>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form onSubmit={handleLogin}>
      <div className="m-2">
      <label for="email" class="block text-start text-sm/6 font-medium text-gray-900">Email address</label>
        <div className="mt-2">
        <input className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        </div>
        </div>
        <div className="m-2">
          <div className="flex justify-between">
         <label for="password" class="block text-start text-sm/6 font-medium text-gray-900">Password</label>
         <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500 text-sm/6">Forgot Password?</a>
         </div>
        <div className="mt-2">
        <input
          type="password"
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        </div>
        </div>
        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Login</button>
      
      </form>
      </div>
      
      <p class="mt-10 text-center text-sm/6 text-gray-500">
      Not a member?
      <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">Register Now</a>
    </p>
    </div>
  );
};

export default Login;
