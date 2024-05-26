import axios from "axios";

const baseApiResponse = (message, payload) => {
  return { message, payload };
};

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://localhost:5000"
    : "http://localhost:5000";

export const isLiked = async (comment_id, user_id) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/comment/isLiked`,
      { comment_id, user_id },
      { headers: { "Content-Type": "application/json" } }
    );
    return baseApiResponse(response.data.message, response.data.payload);
  } catch (error) {
    console.error("Error fetching data:", error);
    return baseApiResponse(
      "Failed to fetch data",
      error.response ? error.response.data : null
    );
  }
};

export const likeComment = async (comment_id, user_id) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/comment/likeComment`,
      { comment_id, user_id },
      { headers: { "Content-Type": "application/json" } }
    );
    return baseApiResponse(response.data.message, response.data.payload);
  } catch (error) {
    console.error("Error fetching data:", error);
    return baseApiResponse(
      "Failed to fetch data",
      error.response ? error.response.data : null
    );
  }
};

export const removeLike = async (comment_id, user_id) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/comment/removeLike`,
      { comment_id, user_id },
      { headers: { "Content-Type": "application/json" } }
    );
    return baseApiResponse(response.data.message, response.data.payload);
  } catch (error) {
    console.error("Error fetching data:", error);
    return baseApiResponse(
      "Failed to fetch data",
      error.response ? error.response.data : null
    );
  }
};
