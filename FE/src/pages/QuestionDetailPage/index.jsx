import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import { CheckUserVote, Upvote, Downvote, Unupvote, Undownvote } from "../../request/answer.request";
import { formatDistanceToNow } from "date-fns";
import { enUS } from 'date-fns/locale';

const QuestionDetailPage = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const { user } = useUser();
  const [commentLikes, setCommentLikes] = useState({});
  const [answerVotes, setAnswerVotes] = useState({});

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await getQuestionDetails(questionId);
        if (response.message === "Question retrieved successfully") {
          const payload = response.payload;
          const initialCommentLikes = {};
          const initialAnswerVotes = {};

          for (const answer of payload.answers) {
            initialAnswerVotes[answer.id] = {
              upvotedByUser: false,
              downvotedByUser: false,
              votes: answer.upvote - answer.downvote,
            };

            if (user) {
              const voteStatus = await CheckUserVote(user.user_id, answer.id);
              initialAnswerVotes[answer.id].upvotedByUser = voteStatus.upvote;
              initialAnswerVotes[answer.id].downvotedByUser = voteStatus.downvote;
            }

            for (const comment of answer.comments) {
              initialCommentLikes[comment.id] = {
                likedByUser: false,
                likes: comment.likes,
              };

              if (user) {
                const likedStatus = await isLiked(comment.id, user.user_id);
                initialCommentLikes[comment.id].likedByUser = likedStatus.payload;
              }
            }
          }

          setQuestion(payload);
          setCommentLikes(initialCommentLikes);
          setAnswerVotes(initialAnswerVotes);
        } else {
          console.error("Failed to retrieve question:", response.message);
        }
        console.log(response);
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
        setCommentLikes({
          ...commentLikes,
          [commentId]: {
            likedByUser: false,
            likes: currentLikes - 1,
          },
        });
        console.log("Removed like");
      } else {
        await likeComment(commentId, user.user_id);
        setCommentLikes({
          ...commentLikes,
          [commentId]: {
            likedByUser: true,
            likes: currentLikes + 1,
          },
        });
        console.log("Added like");
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleUpvoteClick = async (answerId) => {
    if (!user) {
      alert("Please log in to vote.");
      return;
    }

    try {
      const currentVotes = answerVotes[answerId].votes;
      if (answerVotes[answerId].upvotedByUser) {
        await Unupvote(user.user_id, answerId);
        setAnswerVotes({
          ...answerVotes,
          [answerId]: {
            upvotedByUser: false,
            downvotedByUser: false,
            votes: currentVotes - 1,
          },
        });
        console.log("Removed upvote");
      } else {
        await Upvote(user.user_id, answerId);
        setAnswerVotes({
          ...answerVotes,
          [answerId]: {
            upvotedByUser: true,
            downvotedByUser: false,
            votes: currentVotes + 1,
          },
        });
        console.log("Added upvote");
      }
    } catch (error) {
      console.error("Error handling upvote:", error);
    }
  };

  const handleDownvoteClick = async (answerId) => {
    if (!user) {
      alert("Please log in to vote.");
      return;
    }

    try {
      const currentVotes = answerVotes[answerId].votes;
      if (answerVotes[answerId].downvotedByUser) {
        await Undownvote(user.user_id, answerId);
        setAnswerVotes({
          ...answerVotes,
          [answerId]: {
            upvotedByUser: false,
            downvotedByUser: false,
            votes: currentVotes + 1,
          },
        });
        console.log("Removed downvote");
      } else {
        await Downvote(user.user_id, answerId);
        setAnswerVotes({
          ...answerVotes,
          [answerId]: {
            upvotedByUser: false,
            downvotedByUser: true,
            votes: currentVotes - 1,
          },
        });
        console.log("Added downvote");
      }
    } catch (error) {
      console.error("Error handling downvote:", error);
    }
  };

  const sortedAnswers = question?.answers.sort((a, b) => {
    const aScore = answerVotes[a.id]?.votes || 0;
    const bScore = answerVotes[b.id]?.votes || 0;
    return bScore - aScore;
  });

  

  return (
    <div className="mt-[80px] mx-5">
      {question ? (
        <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">{question.text}</h1>
          <span className="mt-2 text-sm text-gray-500">
            Subject: {question.subject ? question.subject.name : "Subject not found"}
          </span>
          {question.image && (
            <img
              src={question.image}
              alt="Question"
              className="mt-2 max-w-full h-auto"
            />
          )}
          <div className="mt-4 flex items-center">
            <img
              className="w-10 h-10 rounded-full object-cover object-center"
              src={question.user.profile_picture}
              alt="Profile"
            />
            <span className="ml-2 text-sm text-gray-500">
              Asked by {question.user.username} {" "}
              {formatDistanceToNow(new Date(new Date(question.written_at).toLocaleString()), { addSuffix: true, locale: enUS })}
            </span>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-bold">Answers</h2>
            {sortedAnswers.map((answer) => (
              <div key={answer.id} className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p>{answer.text}</p>
                {answer.image && (
                  <img
                    src={answer.image}
                    alt="Answer"
                    className="mt-2 max-w-full h-auto"
                  />
                )}
                <div className="mt-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <img
                      className="hover:cursor-pointer"
                      src={answerVotes[answer.id]?.upvotedByUser ? upvoteClicked : upvoteUnclicked}
                      alt="Upvote"
                      onClick={() => handleUpvoteClick(answer.id)}
                    />
                    <img
                      className="hover:cursor-pointer"
                      src={answerVotes[answer.id]?.downvotedByUser ? downvoteClicked : downvoteUnclicked}
                      alt="Downvote"
                      onClick={() => handleDownvoteClick(answer.id)}
                    />
                    <span className="ml-2">{answerVotes[answer.id]?.votes || 0}</span>
                  </div>
                  <span className="ml-4">
                    {formatDistanceToNow(new Date(answer.written_at), { addSuffix: true, locale: enUS })}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-bold">Comments</h3>
                  {answer.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="mt-2 p-2 bg-white rounded-lg"
                    >
                      <div className="flex items-center">
                        <img
                          className="w-8 h-8 rounded-full object-cover object-center"
                          src={comment.user.profile_picture}
                          alt="Profile"
                        />
                        <p className="ml-2 font-bold">
                          {comment.user.username}
                        </p>
                      </div>
                      <p className="mt-1">{comment.text}</p>
                      <div className="mt-2 flex items-center hover:cursor-pointer" onClick={() => handleLikeClick(comment.id)}>
                        <img
                          src={
                            user && commentLikes[comment.id]?.likedByUser
                              ? liked
                              : unliked
                          }
                          alt={commentLikes[comment.id]?.likedByUser ? "Liked" : "Unliked"}
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          {commentLikes[comment.id]?.likes}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(comment.written_at), { addSuffix: true, locale: enUS })}
                      </p>
                    </div>
                  ))}
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
