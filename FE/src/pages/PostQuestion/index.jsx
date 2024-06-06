import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { postQuestion } from "../../request/question.request";
import UploadWidget from "../../components/UploadWidget";

const PostQuestion = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [imageUrl, setImageUrl] = useState("");
  if (!user) {
    navigate("/login");
  }
  const handleImageUpload = (url) => {
    setImageUrl(url);
  };
  const submitQuestion = async () => {
    try {
      const postQuestionResponse = await postQuestion({
        subject: selectedSubject,
        text: questionText,
        image: imageUrl,
        user_id: user.user_id,
      });
      if (postQuestionResponse.message === "Question created successfully") {
        console.log("Question posted successfully");
        navigate("/home");
      } else {
        console.error("Failed to post question:", postQuestionResponse.message);
      }
    } catch (error) {
      console.error("Error posting question:", error);
    }
  };
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questionText, setQuestionText] = useState("");

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="mt-10 flex flex-col items-center bg-white rounded p-4">
        <select
          className="w-64 p-2 mb-4 border border-gray-300 rounded-md"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="Math">Math</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Biology">Biology</option>
          <option value="Sociology">Sociology</option>
          <option value="Economy">Economy</option>
          <option value="Geology">Geology</option>
        </select>
        <textarea
          type="text"
          placeholder="Question text"
          className="w-[80vw] p-2 mb-4 border border-gray-300 rounded-md"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
        <UploadWidget onImageUpload={handleImageUpload} />
        <button
          onClick={submitQuestion}
          className="bg-[#CEAB79] text-white py-2 px-4 rounded-md hover:bg-[#a1865f] focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
        >
          Post Question
        </button>
      </div>
    </div>
  );
};

export default PostQuestion;
