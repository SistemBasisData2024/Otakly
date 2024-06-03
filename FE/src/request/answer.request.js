import axios from "axios";

const baseApiResponse = (message, payload) => {
  return { message, payload};
};

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://localhost:5000"
    : "http://localhost:5000";

export const CheckUserVote = async (user_id, answer_id) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/answer/checkUserVote`,
      { user_id, answer_id },
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

export const Upvote = async (user_id, answer_id) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/answer/upvoteAnswer`,
      { user_id, answer_id },
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

export const Downvote = async (user_id, answer_id) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/answer/downvoteAnswer`,
      { user_id, answer_id },
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

export const Unupvote = async (user_id, answer_id) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/answer/unupvote`,
      { user_id, answer_id },
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

export const Undownvote = async (user_id, answer_id) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/answer/undownvote`,
      { user_id, answer_id },
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

export const isVoted = async (user_id, answer_id) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/answer/isVoted`,
      { user_id, answer_id },
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