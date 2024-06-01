import React, { useState, useEffect } from 'react';
import { fetchLeaderboard } from '../../request/rank.request'; 

const RankPage = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const getLeaderboard = async () => {
            try {
                const data = await fetchLeaderboard();
                console.log('Fetched Data:', data); // Debugging: Log fetched data
                if (data && data.topLeaderboard) {
                    setLeaderboard(data.topLeaderboard);
                } else {
                    console.error('Unexpected data structure:', data);
                }
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        };

        getLeaderboard();
    }, []);

    return (
        <div className="flex flex-col items-center min-h-screen">
            <header className="w-full p-4 text-white text-center">
                <h1 className="text-4xl font-bold">-</h1>
            </header>
            <header className="w-full p-4 text-white text-center">
                <h1 className="text-4xl font-bold">Otaku Leaderboard</h1>
            </header>
            <main>
                <section className="mb-8 bg-white p-6 rounded-md shadow-md">
                    <h2 className="text-3xl font-bold text-center mb-4">Top Leaderboard</h2>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200 text-center">Rank</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-center">Name</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-center">Votes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.length > 0 ? (
                                leaderboard.map((user, index) => (
                                    <tr key={index}>
                                        <td className="py-2 px-4 border-b border-gray-200 text-center">{user.rank}</td>
                                        <td className="py-2 px-4 border-b border-gray-200 text-center">{user.username}</td>
                                        <td className="py-2 px-4 border-b border-gray-200 text-center">{user.total_votes}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="py-2 px-4 border-b border-gray-200 text-center" colSpan="3">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default RankPage;
