import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import defaultProfilePicture from "../../assets/default_propic.jpg";
import { useNavigate } from "react-router-dom";
import {
  deleteUser,
  updateUserEmail,
  updateUserPassword,
  updateUserProfilePicture,
  updateUserUsername,
} from "../../request/user.request";
import UploadWidget from "../../components/UploadWidget";

const ProfilePage = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  if (!user) {
    window.location.href = "/login";
  }

  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState(user.profile_picture);
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);

  const handleImageUpload = (url) => {
    setImageUrl(url);
  };

  const updateUsernameHandler = async (e) => {
    e.preventDefault();
    const newUsername = e.target.username.value;

    try {
      const response = await updateUserUsername(user.user_id, newUsername);
      if (response.message === "Username updated successfully") {
        setUser({ ...user, username: newUsername });
        setMessage("Username updated successfully");
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      setMessage("Failed to update username");
    }
  };

  const updatePasswordHandler = async (e) => {
    e.preventDefault();
    const newPassword = e.target.password.value;

    try {
      const response = await updateUserPassword(user.user_id, newPassword);
      if (response.message === "Password updated successfully") {
        setMessage("Password updated successfully");
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      setMessage("Failed to update password");
    }
  };

  const updateEmailHandler = async (e) => {
    e.preventDefault();
    const newEmail = e.target.email.value;

    try {
      const response = await updateUserEmail(user.user_id, newEmail);
      if (response.message === "Email updated successfully") {
        setUser({ ...user, email: newEmail });
        setMessage("Email updated successfully");
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      setMessage("Failed to update email");
    }
  };

  const updateProfilePictureHandler = async () => {
    try {
      const response = await updateUserProfilePicture(user.user_id, imageUrl);
      if (response.message === "Profile picture updated successfully") {
        setUser({ ...user, profile_picture: imageUrl });
        setMessage("Profile picture updated successfully");
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      setMessage("Failed to update profile picture");
    }
  };

  const deleteUserHandler = async () => {
    try {
      const response = await deleteUser(user.user_id);
      if (response.message === "User deleted successfully") {
        setUser(null);
        navigate("/login");
      } else {
        setMessage(response.message);
        console.error("Delete failed:", response.message);
      }
    } catch (error) {
      setMessage("Failed to delete user");
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-sm p-4 rounded-md m-3 sm:mt-0 mt-[200px]">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        <img
          src={user.profile_picture || defaultProfilePicture}
          alt="Profile Picture"
          className="rounded-full w-32 h-32"
        />
        <button
          onClick={deleteUserHandler}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mt-4"
        >
          Delete User
        </button>
      </div>
      <div className="bg-white p-8 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        {message && <p className="text-red-500 mb-4">{message}</p>}

        <div className="mb-4">
          <UploadWidget onImageUpload={handleImageUpload} />
         
            {user.profile_picture != imageUrl ? <button
            onClick={updateProfilePictureHandler}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-2"
          >Save Profile Picture</button> : <></>}
        </div>

        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowUsernameInput(!showUsernameInput)}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
          >
            {showUsernameInput ? "Cancel" : "Change Username"}
          </button>
          {showUsernameInput && (
            <form onSubmit={updateUsernameHandler} className="mt-2">
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter your new username"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-2"
              >
                Save Username
              </button>
            </form>
          )}
        </div>

        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowPasswordInput(!showPasswordInput)}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
          >
            {showPasswordInput ? "Cancel" : "Change Password"}
          </button>
          {showPasswordInput && (
            <form onSubmit={updatePasswordHandler} className="mt-2">
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter your new password"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-2"
              >
                Save Password
              </button>
            </form>
          )}
        </div>

        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowEmailInput(!showEmailInput)}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
          >
            {showEmailInput ? "Cancel" : "Change Email"}
          </button>
          {showEmailInput && (
            <form onSubmit={updateEmailHandler} className="mt-2">
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter your new email"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-2"
              >
                Save Email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
