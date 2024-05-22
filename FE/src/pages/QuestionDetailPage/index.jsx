import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestionDetails } from "../../request/question.request";

const QuestionDetailPage = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await getQuestionDetails(questionId);
        if (response.message === "Question retrieved successfully") {
          setQuestion(response.payload);
        } else {
          console.error("Failed to retrieve question:", response.message);
        }
        console.log(response);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    fetchQuestion();
  }, [questionId]);

  const sortedAnswers = question?.answers.sort((a, b) => {
    const aScore = a.upvote - a.downvote;
    const bScore = b.upvote - b.downvote;
    return bScore - aScore;
  });

  return (
    <div className="mt-[80px] mx-5">
      {question ? (
        <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">{question.text}</h1>
          <img src={question.image} alt="Question" className="mt-2 max-w-full h-auto" />
          <div className="mt-4 flex items-center">
            <img
              className="w-10 h-10 rounded-full object-cover object-center"
              src={question.user.profile_picture}
              alt="Profile"
            />
            <span className="ml-2 text-sm text-gray-500">
              Asked by {question.user.username} on {new Date(question.written_at).toLocaleDateString('en-GB')}
            </span>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-bold">Answers</h2>
            {sortedAnswers.map(answer => (
              <div key={answer.id} className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p>{answer.text}</p>
                {answer.image && <img src={answer.image} alt="Answer" className="mt-2 max-w-full h-auto" />}
                <div className="mt-2 text-sm text-gray-500">
                  <span>Upvotes: {answer.upvote}</span>
                  <span className="ml-4">Downvotes: {answer.downvote}</span>
                  <span className="ml-4">Written on {new Date(answer.written_at).toLocaleDateString('en-GB')}</span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-bold">Comments</h3>
                  {answer.comments.map(comment => (
                    <div key={comment.id} className="mt-2 p-2 bg-white rounded-lg">
                      <div className="flex items-center">
                        <img
                          className="w-8 h-8 rounded-full object-cover object-center"
                          src={comment.user.profile_picture}
                          alt="Profile"
                        />
                        <p className="ml-2 font-bold">{comment.user.username}</p>
                      </div>
                      <p className="mt-1">{comment.text}</p>
                      <p className="mt-1 text-sm text-gray-500">Likes: {comment.likes}</p>
                      <p className="text-sm text-gray-500">Written on {new Date(comment.written_at).toLocaleDateString('en-GB')}</p>
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
