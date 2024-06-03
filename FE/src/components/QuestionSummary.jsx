import React from "react";
import { useNavigate } from "react-router-dom";
import defaultProfilePicture from "../assets/default_propic.jpg"; 

const QuestionSummary = ({ question }) => {
  const navigate = useNavigate();
  const date = new Date(question.written_at);

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);

  return (
    <div
      key={question.id}
      className="bg-white p-4 shadow mx-5 rounded-lg hover:cursor-pointer hover:scale-[102%] transition-all duration-100"
      onClick={() => navigate(`/question/${question.id}`)}
    >
      <h3 className="text-xl font-bold">{question.text}</h3>
      <div className="flex items-center">
        <img
          className="w-8 h-8 rounded-full object-cover object-center"
          src={question.user.profile_picture || defaultProfilePicture}
          alt="Profile Picture"
        />
        <p className="ml-2">{question.user.username}</p>
        <p className="ml-auto text-gray-500">{formattedDate}</p>
      </div>
    </div>
  );
};

export default QuestionSummary;
