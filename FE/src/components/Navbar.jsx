import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import profilePicture from "../assets/default_propic.jpg";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser(); // Assuming `user` is either an object or null
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full items-center flex justify-between flex-wrap p-3 bg-gray-900 rounded-bl-xl rounded-br-xl">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span
          className="font-semibold text-xl tracking-tight"
          onClick={() => navigate("/home")}
        >
          Big Brain
        </span>
      </div>

      <div className="block lg:hidden">
        <button
          className="flex items-center px-3 py-2 border rounded text-blue-200 border-blue-400 hover:border-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="fill-current h-5 w-5 text-white"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                fillRule="evenodd"
                d="M10 9.293L6.146 5.44a1 1 0 00-1.414 1.414L8.586 10l-3.854 3.854a1 1 0 101.414 1.414L10 11.414l3.854 3.854a1 1 0 001.414-1.414L11.414 10l3.854-3.854a1 1 0 00-1.414-1.414L10 8.586z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 6h14a1 1 0 010 2H3a1 1 0 010-2zm0 6h14a1 1 0 010 2H3a1 1 0 010-2z"
                clipRule="evenodd"
              />
            )}
          </svg>
        </button>
      </div>

      <div
        className={`w-full ${
          isOpen ? "block" : "hidden"
        } flex-grow lg:flex lg:items-center lg:w-auto hover:cursor-pointer transition-transform`}
      >
        <ul className="text-sm lg:flex-grow">
          <li className="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4">
            Ask
          </li>
          <li className="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4">
            Answer
          </li>
          <li className="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4">
            Ranks
          </li>
        </ul>
        {user ? (
          <div className="flex text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-blue-500 hover:bg-white mt-4 lg:mt-0 items-center" onClick={()=>navigate("/profile")}>
            <img
              src={user.profile_picture || profilePicture}
              alt="Profile"
              className="w-6 h-6 rounded-full mr-2"
            />
            <h1>{user.username}</h1>
          </div>
        ) : (
          <button
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-blue-500 hover:bg-white mt-4 lg:mt-0"
            onClick={() => navigate("/login")} // Redirect to login
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
