// QuizHost.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react"; // Added useCallback
import { io } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import { baseUrl1 } from "../utils/services"; // Ensure baseUrl1 is correctly defined

const QuizHost = () => {
  const [roomCode, setRoomCode] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [duration, setDuration] = useState(5);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(''); // New state for copy feedback
  const navigate = useNavigate();

  const { quizId } = useParams();
  const socket = useMemo(() => io(baseUrl1), [baseUrl1]);

  useEffect(() => {
    const generateRoomCode = () => {
      const newRoomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
      setRoomCode(newRoomCode);
      socket.emit("create room", newRoomCode);
      console.log(`[Host] Emitted 'create room' with code: ${newRoomCode}`);
    };

    if (!roomCode) {
      generateRoomCode();
    }

    socket.on('error', (message) => {
      console.error("Host Socket Error:", message);
      setError(message);
    });

    socket.on('quiz ended', (data) => {
        console.log('>>> Host: Quiz ended event received! Navigating to leaderboard.', data);
        navigate('/leaderboard', { state: { finalResults: data.results, hostView: true, roomCode: roomCode } });
    });

    return () => {
      console.log("QuizHost component unmounting, cleaning up socket listeners.");
      socket.off('error');
      socket.off('quiz ended');
      if (socket.connected) {
          socket.disconnect();
      }
    };
  }, [socket, navigate, roomCode]);

  // New useCallback hook for the copy functionality
  const copyRoomCodeToClipboard = useCallback(() => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode)
        .then(() => {
          setCopySuccess('Copied!');
          setTimeout(() => setCopySuccess(''), 1500); // Clear message after 1.5 seconds
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          setCopySuccess('Failed to copy!');
          setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
        });
    }
  }, [roomCode]); // Dependency on roomCode

  const startQuiz = () => {
    setError(null);

    if (!roomCode) {
      setError("Room code not generated yet. Please wait.");
      return;
    }
    if (!quizId) {
      setError("Quiz ID is missing. Cannot start quiz.");
      return;
    }
    if (duration < 1 || isNaN(duration)) {
      setError("Duration must be a valid number of minutes (at least 1).");
      return;
    }

    socket.emit("start quiz", {
      roomCode,
      quizId,
      duration: duration * 60,
    });
    console.log(`[Host] Emitted 'start quiz' for room ${roomCode}, quiz ${quizId}, duration ${duration} minutes.`);

    setQuizStarted(true);
    navigate('/leaderboard', { state: { roomCode, hostView: true } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center border-b-8 border-purple-500">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 flex items-center justify-center space-x-3">
          <span role="img" aria-label="host-emoji">🎙️</span>
          <span>Host Your Quiz!</span>
          <span role="img" aria-label="quiz-emoji">🧠</span>
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-3 rounded-lg mb-6 text-base font-medium animate-pulse" role="alert">
            {error}
          </div>
        )}

        {roomCode ? (
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-lg shadow-lg mb-8 transition transform hover:scale-105 duration-300">
            <p className="text-xl font-semibold mb-3">Share this Room Code:</p>
            <span
              className="block text-5xl font-extrabold tracking-wider bg-white text-purple-700 py-3 px-6 rounded-xl select-all cursor-pointer transform hover:scale-100 transition duration-150" // Changed cursor-copy to cursor-pointer
              onClick={copyRoomCodeToClipboard} // Added onClick handler
            >
              {roomCode}
            </span>
            <p className="mt-3 text-sm opacity-90">
              {copySuccess || "Click to select and copy!"} {/* Display copy feedback */}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-lg text-gray-600 font-medium">Generating a unique room code...</p>
          </div>
        )}

        {!quizStarted ? (
          <div className="space-y-6">
            <div>
              <label htmlFor="duration" className="block text-gray-700 text-lg font-semibold mb-3">
                Set Quiz Duration (minutes):
              </label>
              <input
                id="duration"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-transparent text-xl text-center font-medium"
                aria-label="Quiz duration in minutes"
              />
            </div>

            <button
              onClick={startQuiz}
              disabled={!roomCode || quizStarted}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-extrabold py-4 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed text-2xl tracking-wide"
            >
              {quizStarted ? "Quiz Started!" : "Start Quiz"}
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <p className="text-2xl font-bold text-green-600 mb-4 animate-bounce">
              The quiz has officially begun! 🎉
            </p>
            <p className="text-lg text-gray-700">
              You've been whisked away to the live leaderboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHost;