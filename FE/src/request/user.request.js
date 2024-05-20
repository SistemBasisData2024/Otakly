import axios from 'axios';

const baseApiResponse = (message, payload) => {
  return { message, payload };
};

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://localhost:5000' : 'http://localhost:5000';

export const login = async (username, password) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/login`, // Use the environment-specific base URL
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );
      return baseApiResponse(response.data.message, response.data.payload);
    } catch (error) {
        return baseApiResponse(error.response ? error.response.data.message : "An error accured", error.response ? error.response.data : null);
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
      return baseApiResponse(error.response ? error.response.data.message : "An error accured", error.response ? error.response.data : null);
    }
};

export const updateUser = async (user_id, username, password, email, profile_picture) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/user/updateUser/${user_id}`,
        { username, password, email, profile_picture },
        { headers: { "Content-Type": "application/json" } }
      );
      return baseApiResponse(response.data.message, response.data.payload);
    } catch (error) {
        return baseApiResponse(error.response ? error.response.data.message : "An error accured", error.response ? error.response.data : null);
    }
}

export const deleteUser = async (user_id) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/user/deleteUser/${user_id}`, 
        { headers: { "Content-Type": "application/json" } }
      );
      return baseApiResponse(response.data.message, response.data.payload);
    } catch (error) {
        return baseApiResponse(error.response ? error.response.data.message : "An error accured", error.response ? error.response.data : null);
    }
}
export const getNewestQuestions = async () => {
  try {
      const response = await axios.get(`${BASE_URL}/question/newestQuestions`);
      return baseApiResponse(response.data.message, response.data.payload);
  } catch (error) {
      console.error("Error fetching data:", error);
      return baseApiResponse("Failed to fetch data", error.response ? error.response.data : null);
  }
}
