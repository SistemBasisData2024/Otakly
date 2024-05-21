const Rank = require("../models/rankSchema.js");
const neonPool = require("../connect/connect.neon");

exports.getRank = async (req, res) => {
    try {
        const query = 'SELECT u.username, r.upvote FROM rank r JOIN users u ON r.user_id = u.user_id ORDER BY r.upvote DESC limit 5';
        const { rows: rank } = await neonPool.query(query);
        
        res
            .status(200)
            .json({
                message: "Rank retreived successfully",
                payload: rank,
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred", error });
    }
};

exports.getUserRank = async (req,res) => {
    try {
        const user_id = req.params;
        const query = `
            SELECT rank, username FROM (
                SELECT u.username, u.user_id,
                RANK() OVER (ORDER BY r.upvote DESC) AS rank
                FROM rank r
                JOIN users u ON r.user_id = u.user_id
            ) ranked_users
            WHERE user_id = $1
        `;
        const { rows } = await neonPool.query(query, [user_id]);
        
        res
            .status(200)
            .json({
                message: "Rank retreived successfully",
                payload: rows,
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred", error });
    }
};