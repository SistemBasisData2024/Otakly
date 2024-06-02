import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import { CheckUserVote, Upvote, Downvote, Unupvote, Undownvote } from "../../request/answer.request";

const QuestionDetailPage = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const { user } = useUser();
  const [commentLikes, setCommentLikes] = useState({});
  const [answerVotes, setAnswerVotes] = useState({});
  const [newAnswer, setNewAnswer] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentTexts, setCommentTexts] = useState({});
  

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

          // Check if payload contains subject information
          if (payload.subject) {
            console.log("Subject:", payload.subject.name);
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
      } else {
        await likeComment(commentId, user.user_id);
        setCommentLikes({
          ...commentLikes,
          [commentId]: {
            likedByUser: true,
            likes: currentLikes + 1,
          },
        });
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
      }
    } catch (error) {
      console.error("Error handling downvote:", error);
    }
  };

  // Fungsi untuk mengirim jawaban baru ke backend
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    // Cek apakah pengguna telah masuk
    if (!user) {
      alert("Silakan login untuk mengirim jawaban.");
      return;
    }

    try {
      // Kirim data jawaban baru ke backend menggunakan axios.post
      const response = await axios.post(
        `${BASE_URL}/answer/addAnswer`,
        {
          user_id: user.user_id,
          question_id: questionId,
          text: newAnswer
        },
        { headers: { "Content-Type": "application/json" } }
      );

      // Jawaban baru yang telah ditambahkan
      const newAnswerData = {
        id: response.data.id, // Pastikan Anda mendapatkan ID jawaban dari respons server
        text: newAnswer,
        // Tambahkan properti lainnya sesuai kebutuhan
      };

      // Perbarui state dengan menambahkan jawaban baru ke dalam array jawaban yang sudah ada
      setQuestion((prevQuestion) => ({
        ...prevQuestion,
        answers: [...prevQuestion.answers, newAnswerData],
      }));

      // Setelah jawaban berhasil ditambahkan, bersihkan input jawaban
      setNewAnswer("");
    } catch (error) {
      console.error("Error mengirim jawaban:", error);
    }
  };

  // Fungsi untuk mengirim komentar baru ke backend
  // Fungsi untuk mengirim komentar baru ke backend
const handleSubmitComment = async (e, answerId) => {
  e.preventDefault();

  if (!user) {
    alert("Silakan login untuk memberi komentar.");
    return;
  }

  try {
    const newText = commentTexts[answerId]; // Ambil teks komentar dari state commentTexts
    const response = await axios.post(
      `${BASE_URL}/comment/addComment`,
      {
        user_id: user.user_id,
        answer_id: answerId,
        text: newText
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const newComment = response.data; // Asumsikan respons dari backend berisi data komentar baru

    // Perbarui state untuk menambahkan komentar baru ke dalam array komentar pada jawaban yang sesuai
    setQuestion(prevQuestion => {
      const updatedAnswers = prevQuestion.answers.map(answer => {
        if (answer.id === answerId) {
          return {
            ...answer,
            comments: [...answer.comments, newComment]
          };
        }
        return answer;
      });
      return {
        ...prevQuestion,
        answers: updatedAnswers
      };
    });

    // Bersihkan input komentar setelah berhasil mengirim
    setCommentTexts(prevTexts => ({
      ...prevTexts,
      [answerId]: '' // Kosongkan input teks komentar untuk jawaban yang sesuai
    }));
  } catch (error) {
    console.error("Error submitting comment:", error);
  }
};


  const handleCommentTextChange = (e, answerId) => {
    const newText = e.target.value;
    setCommentTexts({
      ...commentTexts,
      [answerId]: newText
    });
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
            Subject: {question.subject.name}
          </span>
          <img
            src={question.image}
            alt="Question"
            className="mt-2 max-w-full h-auto"
          />
          <div className="mt-4 flex items-center">
            <form onSubmit={(e) => handleSubmitAnswer(e)}>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Masukkan jawaban Anda..."
                className="w-full h-24 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
              ></textarea>
              <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Submit Jawaban
              </button>
            </form>

            <img
              className="w-10 h-10 rounded-full object-cover object-center"
              src={question.user.profile_picture}
              alt="Profile"
            />
            <span className="ml-2 text-sm text-gray-500">
              Asked by {question.user.username} on{" "}
              {new Date(question.written_at).toLocaleDateString("en-GB")}
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
                    Written on{" "}
                    {new Date(answer.written_at).toLocaleDateString("en-GB")}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-bold">Comments</h3>
                  <form onSubmit={(e) => handleSubmitComment(e, answer.id)}>
                    <textarea
                      value={commentTexts[answer.id] || ''}
                      onChange={(e) => handleCommentTextChange(e, answer.id)}
                      placeholder="Tulis komentar Anda..."
                      className="w-full h-16 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                    ></textarea>
                    <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                      Submit Komentar
                    </button>
                  </form>
                  {answer.comments && answer.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="mt-2 p-2 bg-white rounded-lg"
                    >
                      <div className="flex items-center">
                        {comment.user && comment.user.profile_picture && (
                          <img
                            className="w-8 h-8 rounded-full object-cover object-center"
                            src={comment.user.profile_picture}
                            alt="Profile"
                          />
                        )}
                        <p className="ml-2 font-bold">
                          {comment.user ? comment.user.username : ""}
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
                          {commentLikes[comment.id]?.likes || 0}
                        </p>
                      </div>
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
