import React from "react";
import { useUser } from "../../context/UserContext";
import defaultProfilePicture from "../../assets/default_propic.jpg";
import { useNavigate } from "react-router-dom";
import { updateUser, deleteUser} from "../../request/user.request";
import UploadWidget from "../../components/UploadWidget";
import { useState } from "react";

const ProfilePage = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  if (!user) {
    navigate("/login");
    return null; // Prevent further rendering until navigation completes
  }

  const handleImageUpload = (url) => {
    setImageUrl(url);
    console.log(url);
  };

  const updateUserHandler = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const email = user.email; // Assuming email is not being updated, adjust if necessary

    try {
      const response = await updateUser(
        user.user_id,
        username,
        password,
        email,
        imageUrl
      );
      if (response.message === "User updated successfully") {
        setUser(response.payload)
        navigate("/profile");
      } else {
        console.error('Update failed:', response.message);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const deleteUserHandler = async () => {
    try {
      const response = await deleteUser(user.user_id);
      if (response.message === "User deleted successfully") {
        setUser(null);
        navigate("/login");
      } else {
        console.error('Delete failed:', response.message);
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
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
        <form onSubmit={updateUserHandler}>
          <div className="mb-4">
            <UploadWidget onImageUpload={handleImageUpload}/>
          </div>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-bold mb-2"
            >
              New Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your new username"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your new password"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
