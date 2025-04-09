import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JoinQuiz = () => {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const joinQuiz = () => {
    navigate(`/quiz/${roomCode}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans bg-gray-100 p-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-5">Join a Quiz</h1>
      <div className="flex flex-col items-center w-full max-w-md">
        <input
          type="text"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="Enter room code"
          className="w-full px-4 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
        />
        <button
          onClick={joinQuiz}
          className="w-full px-4 py-2 text-base font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300 uppercase"
        >
          Join Quiz
        </button>
      </div>
    </div>
  );
};

export default JoinQuiz;
