import React, { useState, useEffect } from 'react';
import { getNewestQuestions } from '../../request/user.request';
import QuestionSummary from '../../components/QuestionSummary';

function HomePage() {
    const [newestQuestions, setNewestQuestions] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await getNewestQuestions();
                if (response.message === "Questions retrieved successfully") {
                    setNewestQuestions(response.payload);
                } else {
                    console.error('Failed to retrieve newest questions:', response.message);
                }
                console.log(response);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, []);

    return (
        <div className='mt-[100px]'>
            <h1 className='text-4xl font-bold'>Welcome to the Homepage!</h1>
            <p className='text-lg'>This is a simple homepage created using React.</p>
            <div className='grid grid-cols-1 gap-4 mt-4'>
                {newestQuestions.map((question) => (
                    <QuestionSummary key={question.id} question={question} />
                ))}
            </div>
        </div>
    );
}

export default HomePage;
