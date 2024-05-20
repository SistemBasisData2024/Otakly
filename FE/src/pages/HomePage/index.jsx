import React, { useState, useEffect } from 'react';
import { getNewestQuestions } from '../../request/user.request';

function HomePage() {
    const [newestQuestions, setNewestQuestions] = useState([]);

    const fetchQuestions = async () => {
        const response = await getNewestQuestions();
        if (response.message === "Questions retrieved successfully") {
            setNewestQuestions(response.payload);
        } else {
            console.error('Failed to retrieve newest questions:', response.message);
        }
        console.log(response);
    };

    fetchQuestions();

    return (
        <div className='mt-[100px]'>
            <h1 className='text-4xl font-bold'>Welcome to the Homepage!</h1>
            <p className='text-lg'>This is a simple homepage created using React.</p>
            <div className='grid grid-cols-1 gap-4 mt-4'>
                {newestQuestions.map((question) => (
                    <div key={question.id} className='bg-white p-4 shadow'>
                        <h3 className='text-xl font-bold'>{question.text}</h3>
                        {question.image && <img src={question.image} className='mt-2' />}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;
