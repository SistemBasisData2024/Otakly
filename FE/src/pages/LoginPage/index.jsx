import React, { useState } from 'react';
import { login } from "../../request/user.request";
import { useUser } from "../../context/UserContext";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { setUser } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      if (response.message === "Login successful") {
        setUser(response.payload);  // Memastikan user diperbarui dengan benar
        navigate("/home");
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={loginHandler}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#CEAB79]"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#CEAB79]"
            />
          </div>
          <button type="submit" className="w-full bg-[#C2855F] text-white py-2 px-4 rounded-md hover:bg-[#855b41]">Login</button>
        </form>
        <p className="mt-4 text-center text-gray-600">Don't have an account? <a href="/register" className="text-[#CEAB79]">Register</a></p>
      </div>
    </div>
  );
};

export default LoginPage;
