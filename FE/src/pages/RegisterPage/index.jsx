import React, {useState, useEffect} from 'react';
import { register } from '../../request/user.request';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const {setUser} = useUser();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const registerHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await register(username, password, email);
            if (response.message!= "User created successfully") {
                setError(response.message);
            }
            else{
                setUser(response.payload);
                navigate("/home");
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-4 w-max">Register</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={registerHandler}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            placeholder="Enter your name"
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            placeholder="Enter your email"
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            placeholder="Enter your password"
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;