const neonPool = require("../connect/connect.neon.js");

exports.CheckUserVote = async (req, res) => {
  const { user_id, answer_id } = req.body;
  try {
    const query = `SELECT * FROM vote_user WHERE user_id = $1 AND answer_id = $2`;
    const { rows: upvote } = await neonPool.query(query, [user_id, answer_id]);
    if (upvote.length === 0) {
      return res
        .status(404)
        .json({
          message: "user vote checked successfully",
          payload: { upvote: false, downvote: false },
        });
    }
    res.status(200).json({
      message: "User vote checked successfully",
      payload: upvote[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

exports.Upvote = async (req, res) => {
  const { user_id, answer_id } = req.body;
  try {
    const checkQuery = `SELECT * FROM vote_user WHERE user_id = $1 AND answer_id = $2`;
    const { rows: existingVote } = await neonPool.query(checkQuery, [
      user_id,
      answer_id,
    ]);

    let voteChange = 1;
    if (existingVote.length > 0) {
      const { upvote, downvote } = existingVote[0];
      if (upvote) {
        // Already upvoted, do nothing
        return res.status(200).json({ message: "Already upvoted" });
      } else if (downvote) {
        // Transition from downvote to upvote
        voteChange = 2;
      }

      const updateQuery = `UPDATE vote_user SET upvote = TRUE, downvote = FALSE WHERE user_id = $1 AND answer_id = $2 RETURNING *`;
      await neonPool.query(updateQuery, [user_id, answer_id]);
    } else {
      const insertQuery = `INSERT INTO vote_user(user_id, answer_id, upvote, downvote) VALUES($1, $2, TRUE, FALSE) RETURNING *`;
      await neonPool.query(insertQuery, [user_id, answer_id]);
    }

    const updateAnswerQuery = `UPDATE answer SET upvote = upvote + 1, downvote = downvote - $2 WHERE id = $1 RETURNING *`;
    const { rows: answer } = await neonPool.query(updateAnswerQuery, [
      answer_id,
      voteChange - 1,
    ]);

    res.status(201).json({
      message: "Upvoted successfully",
      payload: answer[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

exports.Downvote = async (req, res) => {
  const { user_id, answer_id } = req.body;
  try {
    const checkQuery = `SELECT * FROM vote_user WHERE user_id = $1 AND answer_id = $2`;
    const { rows: existingVote } = await neonPool.query(checkQuery, [
      user_id,
      answer_id,
    ]);

    let voteChange = 1;
    if (existingVote.length > 0) {
      const { upvote, downvote } = existingVote[0];
      if (downvote) {
        // Already downvoted, do nothing
        return res.status(200).json({ message: "Already downvoted" });
      } else if (upvote) {
        // Transition from upvote to downvote
        voteChange = 2;
      }

      const updateQuery = `UPDATE vote_user SET upvote = FALSE, downvote = TRUE WHERE user_id = $1 AND answer_id = $2 RETURNING *`;
      await neonPool.query(updateQuery, [user_id, answer_id]);
    } else {
      const insertQuery = `INSERT INTO vote_user(user_id, answer_id, upvote, downvote) VALUES($1, $2, FALSE, TRUE) RETURNING *`;
      await neonPool.query(insertQuery, [user_id, answer_id]);
    }

    const updateAnswerQuery = `UPDATE answer SET downvote = downvote + 1, upvote = upvote - $2 WHERE id = $1 RETURNING *`;
    const { rows: answer } = await neonPool.query(updateAnswerQuery, [
      answer_id,
      voteChange - 1,
    ]);

    res.status(201).json({
      message: "Downvoted successfully",
      payload: answer[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

exports.Unupvote = async (req, res) => {
  const { user_id, answer_id } = req.body;
  try {
    const deleteVoteQuery = `DELETE FROM vote_user WHERE user_id = $1 AND answer_id = $2 AND upvote = TRUE RETURNING *`;
    const { rows: deletedVote } = await neonPool.query(deleteVoteQuery, [
      user_id,
      answer_id,
    ]);

    if (deletedVote.length > 0) {
      const updateAnswerQuery = `UPDATE answer SET upvote = upvote - 1 WHERE id = $1 RETURNING *`;
      const { rows: answer } = await neonPool.query(updateAnswerQuery, [
        answer_id,
      ]);

      res.status(200).json({
        message: "Upvote removed successfully",
        payload: answer[0],
      });
    } else {
      res.status(404).json({ message: "Vote not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

exports.Undownvote = async (req, res) => {
  const { user_id, answer_id } = req.body;
  try {
    const deleteVoteQuery = `DELETE FROM vote_user WHERE user_id = $1 AND answer_id = $2 AND downvote = TRUE RETURNING *`;
    const { rows: deletedVote } = await neonPool.query(deleteVoteQuery, [
      user_id,
      answer_id,
    ]);

    if (deletedVote.length > 0) {
      const updateAnswerQuery = `UPDATE answer SET downvote = downvote - 1 WHERE id = $1 RETURNING *`;
      const { rows: answer } = await neonPool.query(updateAnswerQuery, [
        answer_id,
      ]);

      res.status(200).json({
        message: "Downvote removed successfully",
        payload: answer[0],
      });
    } else {
      res.status(404).json({ message: "Vote not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};
exports.createAnswer = async (req, res) => {
  const { question_id, user_id, text, image } = req.body;
  try {
    const query = `INSERT INTO answer(question_id, user_id, text, image) VALUES($1, $2, $3, $4) RETURNING *`;
    const { rows: answer } = await neonPool.query(query, [
      question_id,
      user_id,
      text,
      image,
    ]);
    res.status(201).json({
      message: "Answer created successfully",
      payload: answer[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

exports.addAnswer = async (req, res) => {
  const { user_id, question_id, text, image} = req.body;
  try {
    if (!user_id || !question_id || !text) {
      return res.status(400).json({
        message: "Mohon lengkapi data yang diperlukan",
      });
    }
    const query = `INSERT INTO answer(user_id, question_id, text, image) VALUES($1, $2, $3, $4) RETURNING *`;
    const { rows: answer } = await neonPool.query(query, [
      user_id,
      question_id,
      text,
      image
    ]);
    const checkRankQuery = `SELECT * FROM rank WHERE user_id = $1 AND subject = (SELECT subject FROM question WHERE id = $2)`;
    const { rows: existingRank } = await neonPool.query(checkRankQuery, [
      user_id,
      question_id,
    ]);

    if (existingRank.length === 0) {
      const insertRankQuery = `INSERT INTO rank(user_id, subject, votes) VALUES($1, (SELECT subject FROM question WHERE id = $2), 0) RETURNING *`;
      await neonPool.query(insertRankQuery, [user_id, question_id]);
    }

    res.status(201).json({
      message: "Jawaban berhasil ditambahkan",
      payload: answer[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};
