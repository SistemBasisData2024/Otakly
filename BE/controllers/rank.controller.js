const Rank = require("../models/rankSchema.js");
const neonPool = require("../connect/connect.neon");

exports.getRank = async (req, res) => {
    try {
        const top10Query = `
            SELECT u.username, SUM(r.votes) AS total_votes, 
                   RANK() OVER (ORDER BY SUM(r.votes) DESC) AS rank
            FROM rank r
            JOIN users u ON r.user_id = u.user_id
            GROUP BY u.username
            ORDER BY total_votes DESC
            LIMIT 10
        `;
        
        const { rows: top10 } = await neonPool.query(top10Query);

        res.status(200).json({
            message: "Ranks retrieved successfully",
            payload: {
                topLeaderboard: top10,
            },
        });
    } catch (error) {
        console.error('Error retrieving rank:', error);
        res.status(500).json({ message: "An error occurred", error });
    }
};




