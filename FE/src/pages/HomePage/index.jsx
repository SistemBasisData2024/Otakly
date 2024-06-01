import React, { useState, useEffect, useCallback } from 'react';
import { getNewestQuestions, getSearchQuestions } from '../../request/user.request';
import QuestionSummary from '../../components/QuestionSummary';

function HomePage() {
    const [newestQuestions, setNewestQuestions] = useState([]);
    const [searchQuestions, setSearchQuestions] = useState([]);
    const [searchInput, setSearchInput] = useState('');

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

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    const fetchSearchQuestions = async (searchTerm) => {
        if (searchTerm.trim() === '') {
            setSearchQuestions([]);
            return;
        }

        try {
            const response = await getSearchQuestions(searchTerm);
            if (response.message === "Questions retrieved successfully") {
                setSearchQuestions(response.payload);
            } else {
                console.error('Failed to retrieve search questions:', response.message);
            }
        } catch (error) {
            console.error('Error searching questions:', error);
        }
    };

    const handleSearch = async () => {
        fetchSearchQuestions(searchInput);
    };

    return (
        <div className='mt-[80px]'>
            <div className='flex justify-center mx-5'>
                <input
                    type='text'
                    placeholder='Search...'
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    className='border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CEAB79] w-full sm:w-1/2'
                />
                <button
                    className='ml-2 px-4 py-2 bg-[#CEAB79] text-white rounded-md hover:bg-[#a1865f] focus:outline-none focus:ring-2 focus:ring-blue-500'
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>
            <div className='grid grid-cols-1 gap-4 mt-4'>
                {(searchInput ? searchQuestions : newestQuestions).map((question) => (
                    <QuestionSummary key={question.id} question={question} />
                ))}
            </div>
        </div>
    );
}

export default HomePage;
