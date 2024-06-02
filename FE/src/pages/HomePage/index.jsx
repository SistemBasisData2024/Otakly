import React, { useState, useEffect } from 'react';
import { getNewestQuestions } from '../../request/question.request';
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
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, []);

    return (
        <div className='mt-[80px]'>
            <div className='flex justify-center mx-5'>
                <input
                    type='text'
                    placeholder='Search...'
                    className='border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CEAB79] w-full sm:w-1/2'
                />
                <button
                    className='ml-2 px-4 py-2 bg-[#CEAB79] text-white rounded-md hover:bg-[#a1865f] focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                    Search
                </button>
            </div>
            <div className='grid grid-cols-1 gap-4 mt-4'>
                {newestQuestions.map((question) => (
                    <QuestionSummary key={question.id} question={question} />
                ))}
            </div>
        </div>
    );
}

export default HomePage;
