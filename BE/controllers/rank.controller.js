const Rank = require("../models/rankSchema.js");
const neonPool = require("../connect/connect.neon");

// Function to get the top 5 users ranked by upvotes
exports.getRank = async (req, res) => {
    try {
        const query = `
            SELECT u.username, r.upvote 
            FROM rank r 
            JOIN users u ON r.user_id = u.user_id 
            ORDER BY r.upvote DESC 
            LIMIT 5
        `;
        const { rows: rank } = await neonPool.query(query);
        
        res.status(200).json({
            message: "Rank retrieved successfully",
            payload: rank,
        });
    } catch (error) {
        console.error('Error retrieving rank:', error);
        res.status(500).json({ message: "An error occurred", error });
    }
};

// Function to get the rank of a specific user
exports.getUserRank = async (req, res) => {
    try {
        const { user_id } = req.params;
        const query = `
            SELECT rank, username FROM (
                SELECT 
                    u.username, 
                    u.user_id,
                    RANK() OVER (ORDER BY r.upvote DESC) AS rank
                FROM rank r
                JOIN users u ON r.user_id = u.user_id
            ) ranked_users
            WHERE user_id = $1
        `;
        const { rows } = await neonPool.query(query, [user_id]);
        
        res.status(200).json({
            message: "Rank retrieved successfully",
            payload: rows,
        });
    } catch (error) {
        console.error('Error retrieving user rank:', error);
        res.status(500).json({ message: "An error occurred", error });
    }
};

// Function to get the top users ranked by upvotes for a specific subject
exports.getRankBySubject = async (req, res) => {
    try {
        const { subject_id } = req.params;
        const query = `
            SELECT 
                ROW_NUMBER() OVER (ORDER BY r.upvote DESC) AS rank, 
                u.username, 
                r.upvote 
            FROM rank r 
            JOIN users u ON r.user_id = u.user_id 
            WHERE r.subject_id = $1 
            ORDER BY r.upvote DESC 
            LIMIT 100
        `;
        const { rows: rank } = await neonPool.query(query, [subject_id]);
        
        res.status(200).json({
            message: "Rank retrieved successfully",
            payload: rank,
        });
    } catch (error) {
        console.error('Error retrieving rank by subject:', error);
        res.status(500).json({ message: "An error occurred", error });
    }
};
