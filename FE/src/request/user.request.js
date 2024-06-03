import axios from "axios";

const baseApiResponse = (message, payload) => {
  return { message, payload };
};

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://localhost:5000"
    : "http://localhost:5000";

export const login = async (username, password) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/login`, // Use the environment-specific base URL
      { username, password },
      { headers: { "Content-Type": "application/json" } }
    );
    return baseApiResponse(response.data.message, response.data.payload);
  } catch (error) {
    return baseApiResponse(
      error.response ? error.response.data.message : "An error accured",
      error.response ? error.response.data : null
    );
  }
};

export const register = async (username, password, email) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/register`, // Use the environment-specific base URL
      { username, password, email },
      { headers: { "Content-Type": "application/json" } }
    );
    return baseApiResponse(response.data.message, response.data.payload);
  } catch (error) {
    return baseApiResponse(
      error.response ? error.response.data.message : "An error accured",
      error.response ? error.response.data : null
    );
  }
};

export const updateUserUsername = async (user_id, username) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/user/updateUserUsername/${user_id}`,
      { username },
      { headers: { "Content-Type": "application/json" } }
    );
    return baseApiResponse(response.data.message, response.data.payload);
  } catch (error) {
    return baseApiResponse(
      error.response ? error.response.data.message : "An error accured",
      error.response ? error.response.data : null
    );
  }
};

export const updateUserPassword = async (user_id, password) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/user/updateUserPassword/${user_id}`,
      { password },
      { headers: { "Content-Type": "application/json" } }
    );
    return baseApiResponse(response.data.message, response.data.payload);
  } catch (error) {
    return baseApiResponse(
      error.response ? error.response.data.message : "An error accured",
      error.response ? error.response.data : null
    );
  }
};

export const updateUserEmail = async (user_id, email) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/user/updateUserEmail/${user_id}`,
      { email },
      { headers: { "Content-Type": "application/json" } }
    );
    return baseApiResponse(response.data.message, response.data.payload);
  } catch (error) {
    return baseApiResponse(
      error.response ? error.response.data.message : "An error accured",
      error.response ? error.response.data : null
    );
  }
};

export const updateUserProfilePicture = async (user_id, profile_picture) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/user/updateUserProfilePicture/${user_id}`,
      { profile_picture },
      { headers: { "Content-Type": "application/json" } }
    );
    return baseApiResponse(response.data.message, response.data.payload);
  } catch (error) {
    return baseApiResponse(
      error.response ? error.response.data.message : "An error accured",
      error.response ? error.response.data : null
    );
  }
};

export const deleteUser = async (user_id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/user/deleteUser/${user_id}`,
      { headers: { "Content-Type": "application/json" } }
    );
    return baseApiResponse(response.data.message, response.data.payload);
  } catch (error) {
    return baseApiResponse(
      error.response ? error.response.data.message : "An error accured",
      error.response ? error.response.data : null
    );
  }
};

export const getSearchQuestions = async (search) => {
  try {
    const response = await axios.get(`${BASE_URL}/question/searchQuestions`, {
      params: { search }
    });
    return baseApiResponse(response.data.message, response.data.payload);
  } catch (error) {
    console.error("Error fetching data:", error);
    return baseApiResponse(
      "Failed to fetch data",
      error.response ? error.response.data : null
    );
  }
};
