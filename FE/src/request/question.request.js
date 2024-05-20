import axios from 'axios';

const baseApiResponse = (message, payload) => {
  return { message, payload };
};

const BASE_URL = process.env.NODE_ENV === 'http://localhost:5000';

export const getNewestQuestions = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/question/newestQuestions`);
        return baseApiResponse(response.data.message, response.data.payload);
    } catch (error) {
        console.error("Error fetching data:", error);
        return baseApiResponse("Failed to fetch data", error.response ? error.response.data : null);
    }
}
