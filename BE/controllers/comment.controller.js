
const neonPool = require("../connect/connect.neon.js");

exports.postComment = async (req, res) => {
    const{user_id, question_id, text, image} = req.body;
    try {
        const query = `INSERT INTO comment(user_id, question_id, text, image) VALUES($1, $2, $3, $4) RETURNING *`;
        const { rows: comment } = await neonPool.query(query, [user_id, question_id, text, image]);
        res
            .status(201)
            .json({
                message: "Comment posted successfully",
                payload: comment[0],
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred", error });
    }
};

exports.likeComment = async (req, res) => {
    const { comment_id, user_id } = req.body;
    try {
        const query = `INSERT INTO commentLike_user(comment_id, user_id) VALUES($1, $2) RETURNING *`;
        const query2 = `UPDATE comment SET likes = likes + 1 WHERE id = $1 RETURNING *`;
        const { rows: like } = await neonPool.query(query, [comment_id, user_id]);
        const { rows: comment } = await neonPool.query(query2, [comment_id]);

        res
            .status(201)
            .json({
                message: "Comment liked successfully",
                payload: comment[0]
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred", error });
    }
}

exports.removeLike = async (req, res) => {
    const { comment_id, user_id } = req.body;
    try {
        const query = `DELETE FROM commentLike_user WHERE comment_id = $1 AND user_id = $2 RETURNING *`;
        const query2 = `UPDATE comment SET likes = likes - 1 WHERE id = $1 RETURNING *`;
        const { rows: like } = await neonPool.query(query, [comment_id, user_id]);
        const { rows: comment } = await neonPool.query(query2, [comment_id]);

        res
            .status(201)
            .json({
                message: "Like removed successfully",
                payload: comment[0]
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred", error });
    }
}

exports.isLiked = async (req, res) => {
    const { comment_id, user_id } = req.body;
    try {
        const query = `SELECT * FROM commentLike_user WHERE comment_id = $1 AND user_id = $2`;
        const { rows: like } = await neonPool.query(query, [comment_id, user_id]);
        const isLiked = like.length > 0;
        res
            .status(200)
            .json({
                message: "Like status retrieved successfully",
                payload: isLiked
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred", error });
    }
}

// controllers/comment.controller.js
exports.addComment = async (req, res) => {
    const { user_id, answer_id, text } = req.body;
    try {
        const query = `INSERT INTO comment(user_id, answer_id, text) VALUES($1, $2, $3) RETURNING *`;
        const { rows: comment } = await neonPool.query(query, [user_id, answer_id, text]);
        res.status(201).json({
            message: "Comment added successfully",
            payload: comment[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
};