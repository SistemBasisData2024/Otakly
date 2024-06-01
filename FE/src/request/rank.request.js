import axios from 'axios';

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://localhost:5000"
    : "http://localhost:5000";


export const fetchLeaderboard = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/rank/getRank`);
        return {
            message: response.data.message,
            topLeaderboard: response.data.payload.topLeaderboard
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            message: "Failed to fetch data",
            topLeaderboard: []
        };
    }
};

