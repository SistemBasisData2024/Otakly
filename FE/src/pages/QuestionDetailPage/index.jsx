import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import defaultProfilePicture from "../../assets/default_propic.jpg";
import axios from "axios";
import { getQuestionDetails } from "../../request/question.request";
import upvoteClicked from "../../assets/upvoteClicked.svg";
import upvoteUnclicked from "../../assets/upvoteUnclicked.svg";
import downvoteClicked from "../../assets/downvoteClicked.svg";
import downvoteUnclicked from "../../assets/downvoteUnclicked.svg";
import liked from "../../assets/liked.svg";
import unliked from "../../assets/unliked.svg";
import { useUser } from "../../context/UserContext";
import {
  isLiked,
  likeComment,
  removeLike,
} from "../../request/comment.request";
import {
  CheckUserVote,
  Upvote,
  Downvote,
  Unupvote,
  Undownvote,
} from "../../request/answer.request";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import UploadWidget from "../../components/UploadWidget";

const QuestionDetailPage = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const { user } = useUser();
  const [commentLikes, setCommentLikes] = useState({});
  const [answerVotes, setAnswerVotes] = useState({});
  const [newAnswer, setNewAnswer] = useState("");
  const [commentTexts, setCommentTexts] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [imageUrl, setImageUrl] = useState("");

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://localhost:5000"
      : "http://localhost:5000";

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await getQuestionDetails(questionId);
        if (response.message === "Question retrieved successfully") {
          const payload = response.payload;
          const initialCommentLikes = {};
          const initialAnswerVotes = {};

          if (payload.subject) {
            console.log("Subject:", payload.subject);
          } else {
            console.log("Subject not found");
          }

          for (const answer of payload.answers) {
            initialAnswerVotes[answer.id] = {
              upvotedByUser: false,
              downvotedByUser: false,
              votes: answer.upvote - answer.downvote,
            };

            if (user) {
              const voteStatus = await CheckUserVote(user.user_id, answer.id);
              console.log("voteStatus:", voteStatus);
              initialAnswerVotes[answer.id].upvotedByUser =
                voteStatus.payload.upvote;
              initialAnswerVotes[answer.id].downvotedByUser =
                voteStatus.payload.downvote;
            }

            for (const comment of answer.comments) {
              initialCommentLikes[comment.id] = {
                likedByUser: false,
                likes: comment.likes,
              };

              if (user) {
                const likedStatus = await isLiked(comment.id, user.user_id);
                initialCommentLikes[comment.id].likedByUser =
                  likedStatus.payload;
              }
            }
          }

          setQuestion(payload);
          setCommentLikes(initialCommentLikes);
          setAnswerVotes(initialAnswerVotes);
          console.log("initialAnswerVotes:", initialAnswerVotes);
        } else {
          console.error("Failed to retrieve question:", response.message);
        }
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    fetchQuestion();
  }, [questionId, user]);

  const handleLikeClick = async (commentId) => {
    if (!user) {
      alert("Please log in to like comments.");
      return;
    }

    try {
      const currentLikes = commentLikes[commentId].likes;
      if (commentLikes[commentId].likedByUser) {
        await removeLike(commentId, user.user_id);
      } else {
        await likeComment(commentId, user.user_id);
      }
      window.location.reload();
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleVoteClick = async (answerId, type) => {
    if (!user) {
      alert("Please log in to vote.");
      return;
    }

    try {
      if (type === "upvote") {
        if (answerVotes[answerId].upvotedByUser) {
          await Unupvote(user.user_id, answerId);
        } else {
          await Upvote(user.user_id, answerId);
        }
      } else if (type === "downvote") {
        if (answerVotes[answerId].downvotedByUser) {
          await Undownvote(user.user_id, answerId);
        } else {
          await Downvote(user.user_id, answerId);
        }
      }
      window.location.reload();
    } catch (error) {
      console.error(`Error handling ${type}:`, error);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Silakan login untuk mengirim jawaban.");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/answer/addAnswer`,
        {
          user_id: user.user_id,
          question_id: questionId,
          text: newAnswer,
          image: imageUrl,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setNewAnswer("");
      window.location.reload();
    } catch (error) {
      console.error("Error mengirim jawaban:", error);
    }
  };

  const handleSubmitComment = async (e, answerId) => {
    e.preventDefault();

    if (!user) {
      alert("Silakan login untuk memberi komentar.");
      return;
    }

    try {
      const newText = commentTexts[answerId];
      await axios.post(
        `${BASE_URL}/comment/addComment`,
        {
          user_id: user.user_id,
          answer_id: answerId,
          text: newText,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setCommentTexts((prevTexts) => ({
        ...prevTexts,
        [answerId]: "",
      }));
      window.location.reload();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleCommentTextChange = (e, answerId) => {
    const newText = e.target.value;
    setCommentTexts({
      ...commentTexts,
      [answerId]: newText,
    });
  };

  const toggleCommentsVisibility = (answerId) => {
    setVisibleComments((prevState) => ({
      ...prevState,
      [answerId]: !prevState[answerId],
    }));
  };

  const sortedAnswers = question?.answers.sort((a, b) => {
    const aScore = answerVotes[a.id]?.votes || 0;
    const bScore = answerVotes[b.id]?.votes || 0;
    return bScore - aScore;
  });

  const handleImageUpload = (url) => {
    setImageUrl(url);
  };

  return (
    <div className="mt-[80px] mx-5">
      {question ? (
        <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">{question.text}</h1>
          <span className="mt-2 text-sm text-gray-500">
            Subject: {question.subject ? question.subject : "Subject not found"}
          </span>
          {question.image && (
            <img
              src={question.image}
              alt="Question"
              className="mt-2 max-w-full h-auto rounded-md"
            />
          )}
          <div className="mt-4 flex items-center">
            <img
              className="w-10 h-10 rounded-full object-cover object-center"
              src={question.user.profile_picture || defaultProfilePicture}
              alt="Profile"
            />
            <span className="ml-2 text-sm text-gray-500">
              Asked by {question.user.username}{" "}
              {formatDistanceToNow(
                new Date(new Date(question.written_at).toLocaleString()),
                { addSuffix: true, locale: enUS }
              )}
            </span>
          </div>

          <div className="mt-4 items-center">
            <form onSubmit={handleSubmitAnswer}>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Masukkan jawaban Anda..."
                className="w-full h-24 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
              ></textarea>
              <div className="mt-2 flex flex-col">
                <UploadWidget onImageUpload={handleImageUpload} />
                <button
                  type="submit"
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Submit Jawaban
                </button>
              </div>
            </form>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-bold">Answers</h2>
            {sortedAnswers.map((answer) => (
              <div key={answer.id} className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p>{answer.text}</p>
                {console.log(answer)}
                {answer.image && (
                  <img
                    src={answer.image}
                    alt="Answer"
                    className="mt-2 max-w-full h-auto rounded-md"
                  />
                )}
                <div className="mt-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <img
                      className="hover:cursor-pointer"
                      src={
                        answerVotes[answer.id]?.upvotedByUser
                          ? upvoteClicked
                          : upvoteUnclicked
                      }
                      alt="Upvote"
                      onClick={() => handleVoteClick(answer.id, "upvote")}
                    />
                    <img
                      className="hover:cursor-pointer"
                      src={
                        answerVotes[answer.id]?.downvotedByUser
                          ? downvoteClicked
                          : downvoteUnclicked
                      }
                      alt="Downvote"
                      onClick={() => handleVoteClick(answer.id, "downvote")}
                    />
                    <span className="ml-2">
                      {answerVotes[answer.id]?.votes || 0}
                    </span>
                  </div>
                  <div className="flex items-center mt-2">
                    <img
                      src={answer.user.profile_picture || defaultProfilePicture}
                      className="w-8 h-8 rounded-full object-cover object-center"
                      alt="Profile"
                    />
                    <span className="ml-4">
                      {formatDistanceToNow(new Date(answer.written_at), {
                        addSuffix: true,
                        locale: enUS,
                      })}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-bold">
                    Comments ({answer.comments.length})
                  </h3>
                  <button
                    onClick={() => toggleCommentsVisibility(answer.id)}
                    className="text-blue-500 underline"
                  >
                    {visibleComments[answer.id]
                      ? "Hide Comments"
                      : "Show Comments"}
                  </button>
                  {visibleComments[answer.id] && (
                    <div>
                      <form onSubmit={(e) => handleSubmitComment(e, answer.id)}>
                        <textarea
                          value={commentTexts[answer.id] || ""}
                          onChange={(e) =>
                            handleCommentTextChange(e, answer.id)
                          }
                          placeholder="Tulis komentar Anda..."
                          className="w-full h-16 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                        ></textarea>
                        <button
                          type="submit"
                          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                          Submit Komentar
                        </button>
                      </form>
                      {answer.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="mt-2 p-2 bg-white rounded-lg"
                        >
                          <div className="flex items-center">
                            {comment.user && comment.user.profile_picture && (
                              <img
                                className="w-8 h-8 rounded-full object-cover object-center"
                                src={
                                  comment.user.profile_picture ||
                                  defaultProfilePicture
                                }
                                alt="Profile"
                              />
                            )}
                            <p className="ml-2 font-bold">
                              {comment.user ? comment.user.username : ""}
                            </p>
                          </div>
                          <p className="mt-1">{comment.text}</p>
                          <div
                            className="mt-2 flex items-center hover:cursor-pointer"
                            onClick={() => handleLikeClick(comment.id)}
                          >
                            <img
                              src={
                                user && commentLikes[comment.id]?.likedByUser
                                  ? liked
                                  : unliked
                              }
                              alt={
                                commentLikes[comment.id]?.likedByUser
                                  ? "Liked"
                                  : "Unliked"
                              }
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              {commentLikes[comment.id]?.likes || 0}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(comment.written_at), {
                              addSuffix: true,
                              locale: enUS,
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default QuestionDetailPage;
