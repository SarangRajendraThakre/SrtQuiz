import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JoinQuiz = () => {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleJoinQuiz = () => {
    // Basic validation
    if (!roomCode.trim()) {
      alert("Please enter a room code.");
      return;
    }
    // Navigate to the TakeQuiz component, passing roomCode as a URL parameter (quizId in TakeQuiz)
    navigate(`/quiz/${roomCode.trim()}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans bg-gray-100 p-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-5">Join a Quiz</h1>
      <div className="flex flex-col items-center w-full max-w-md">
        <input
          type="text"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())} // Convert to uppercase for consistency
          placeholder="Enter room code (e.g., ABCD)"
          className="w-full px-4 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
          maxLength="4" // Assuming 4-character room codes
        />
        <button
          onClick={handleJoinQuiz}
          className="w-full px-4 py-2 text-base font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300 uppercase"
          disabled={!roomCode.trim()} // Disable button if input is empty
        >
          Join Quiz
        </button>
      </div>
    </div>
  );
};

export default JoinQuiz;