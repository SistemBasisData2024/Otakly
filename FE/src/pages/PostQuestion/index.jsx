import React, { useState } from 'react';
import { postQuestion } from '../../request/question.request';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const PostQuestion = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [subjectId, setSubjectId] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.user_id) {
      alert("Silakan login terlebih dahulu.");
      return;
    }

    if (!subjectId || !text) {
      alert("Subjek ID dan Pertanyaan harus diisi.");
      return;
    }

    console.log("User ID:", user.id); // Debug log

    const questionData = {
      "user_id": user.user_id,
      "subject_id": subjectId,
      "text": text,
      "image": image
    }
  
    const response = await postQuestion(questionData);
    if (response.payload) {
      navigate('/home'); // Arahkan ke halaman yang sesuai setelah berhasil memposting
    } else {
      alert(response.message || "Gagal memposting pertanyaan.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-[80px] p-5">
      <div>
        <label>Subjek ID</label>
        <input
          type="text"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          required
          className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-full"
        />
      </div>
      <div>
        <label>Pertanyaan</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-full"
        ></textarea>
      </div>
      <div>
        <label>URL Gambar</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-full"
        />
      </div>
      <button type="submit" className="bg-[#CEAB79] text-white px-4 py-2 rounded-md">Posting Pertanyaan</button>
    </form>
  );
};

export default PostQuestion;
