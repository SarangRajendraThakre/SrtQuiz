import React, { useState, useEffect, useMemo, useContext } from 'react';
import { io } from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import { baseUrl1 } from "../utils/services"; // Adjust path as needed
import { AuthContext } from '../context/AuthContext'; // Adjust path to your AuthContext

const TakeQuiz = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0); // This will reflect backend's calculated score
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerLocal, setSelectedAnswerLocal] = useState(null); // Local state for selected option
  const [error, setError] = useState(null); // For displaying errors
  const [infoMessage, setInfoMessage] = useState(null); // For info messages (e.g., already answered)
  const [finalLeaderboardResults, setFinalLeaderboardResults] = useState(null);

  const { quizId } = useParams(); // roomCode for the player
  const navigate = useNavigate();

  // Get user from AuthContext
  const { user } = useContext(AuthContext);
  const userId = user?._id;
  const userName = user?.name;

  const socket = useMemo(() => io(baseUrl1), []); // Socket instance

  useEffect(() => {
    // --- Socket Event Listeners ---
    socket.on('quiz started', (quizData) => {
      console.log('Quiz started received:', quizData);
      setQuizStarted(true);
      setQuestions(quizData.questions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswerLocal(null);
      setError(null);
      setInfoMessage(null);
    });

    socket.on('answer submitted', (data) => {
      console.log('Answer submission feedback:', data);
      setScore(data.totalScore); // Update score based on backend calculation
      setInfoMessage(null); // Clear previous info messages
    });

    socket.on('leaderboard update', (data) => {
      console.log('Leaderboard updated:', data.leaderboard);
      // You can update a leaderboard state here if you want to display it live
    });

    socket.on('quiz ended', (data) => {
      console.log('Quiz ended received:', data);
      // Navigate to leaderboard with final results
      navigate('/leaderboard', { state: { finalResults: data.results, currentUserScore: score } });
    });

    socket.on('error', (message) => {
      console.error('Socket Error:', message);
      setError(message);
      setInfoMessage(null);
      // Consider more aggressive error handling like disconnecting or navigating
    });

    socket.on('info', (message) => {
      console.log('Socket Info:', message);
      setInfoMessage(message);
      setError(null); // Clear any errors if an info message comes through
    });

    // --- Initial Join Logic ---
    // This effect runs on component mount and when userId/quizId change
    // It's essential to only attempt to join/send player info if userId is available
    if (userId && quizId) {
      // 1. Emit 'join room'
      socket.emit('join room', quizId, (response) => {
        console.log('Join room response:', response);
        if (response.status === 'error') {
          setError(response.message);
          console.error('Failed to join room:', response.message);
          navigate('/'); // Redirect if room doesn't exist
        } else {
          // 2. If successfully joined, send player info
          socket.emit('player info', { roomCode: quizId, userId, userName });
        }
      });
    } else {
        // This might happen if user context is still loading or quizId is missing
        console.log("Waiting for user ID or quiz ID to join room or invalid URL.");
        // You might want to navigate to login or home if the user is not logged in
        // or the URL is malformed (missing quizId)
        if (!userId) {
            // setTimeout to avoid immediate redirect on first render if AuthContext is async
            setTimeout(() => {
                if (!user) navigate('/login'); // Redirect to login if user is truly not logged in
            }, 1000);
        }
    }

    socket.on('quiz ended', (data) => { //
    console.log('Quiz ended received:', data); //
    setFinalLeaderboardResults(data.results); //

    // Navigate if not already navigated by frontend logic for final question
    // This check helps prevent redundant navigation if the user already clicked "Submit Final Answer"
    if (!window.location.pathname.includes('/leaderboard')) { //
         navigate('/leaderboard', { state: { finalResults: data.results, currentUserScore: data.results.find(res => res.userId === userId)?.totalScore || score, roomCode: quizId } }); //
    }
});


    // --- Cleanup on unmount ---
    return () => {
      console.log("Disconnecting socket for TakeQuiz component cleanup.");
      socket.disconnect(); // Disconnect socket when component unmounts
      // Remove all specific listeners to prevent memory leaks/double-listening if component remounts
      socket.off('quiz started');
      socket.off('answer submitted');
      socket.off('leaderboard update');
      socket.off('quiz ended');
      socket.off('error');
      socket.off('info');
    };
  }, [quizId, socket, navigate, user, userId, userName]); // Dependencies for useEffect

  // Handler for selecting an answer option
  const handleAnswerSelect = (option) => {
    setSelectedAnswerLocal(option);
    setInfoMessage(null); // Clear info message when a new answer is selected
  };

  // Handler for submitting the answer (Next/Submit button)
  const submitAnswer = () => {
    setError(null); // Clear errors on new submission attempt
    setInfoMessage(null); // Clear info messages on new submission attempt

    if (selectedAnswerLocal === null) {
      setInfoMessage("Please select an answer before proceeding.");
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
        setError("No question loaded. Please wait for the quiz to start or refresh.");
        return;
    }

    // Ensure userId is available before emitting
    if (!userId) {
      setError("User not logged in or user ID not available. Cannot submit answer.");
      console.error("User not logged in or user ID not available. Cannot submit answer.");
      navigate('/login'); // Redirect to login if user ID is missing
      return;
    }

    // Emit 'submit answer' to the backend
 socket.emit('submit answer', {
  roomCode: quizId,
  userId: userId,
  userName: userName, // <--- ADD THIS LINE BACK IN TakeQuiz.jsx submitAnswer
  questionId: currentQuestion.questionId,
  answer: selectedAnswerLocal,
});

    setSelectedAnswerLocal(null); // Clear local selection for the next question

    // Frontend logic to move to the next question or signal completion
    const isLastQuestion = currentQuestionIndex === questions.length - 1;


if (isLastQuestion) { //
    console.log("Submitting final answer, navigating to leaderboard immediately."); //
    navigate('/leaderboard', { //
        state: {
            roomCode: quizId, //
            currentUserScore: score, //
            finalResults: finalLeaderboardResults || [] //
        }
    });
} else {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1); //
}
    // If it's the last question, navigation to leaderboard will be triggered by
    // the 'quiz ended' event from the server.
  };

  // Helper function for button styling based on selection
  const getButtonClass = (option) => {
    const isSelected = selectedAnswerLocal === option;
    return `py-2 px-4 rounded border transition-all ${
      isSelected
        ? 'bg-green-500 text-white border-green-600'
        : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-100'
    }`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Render a loading state if user data isn't loaded or quiz hasn't started
  if (!user || !quizStarted && !error) { // Show loading unless there's an error
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <p className="text-xl text-gray-700">
                {error ? `Error: ${error}` : "Waiting for user data or host to start the quiz..."}
            </p>
        </div>
    );
  }

  // Render quiz content once it has started and user is loaded
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Question {currentQuestionIndex + 1}
        </h1>
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        )}
        {infoMessage && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Info:</strong>
                <span className="block sm:inline"> {infoMessage}</span>
            </div>
        )}
        <p className="text-lg text-gray-700 mb-6">
          {currentQuestion?.question}
        </p>
        <div className="grid grid-cols-1 gap-4">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              className={getButtonClass(option)}
              onClick={() => handleAnswerSelect(option)}
              disabled={!quizStarted} // Disable buttons if quiz isn't active
            >
              {option}
            </button>
          ))}
        </div>
        <button
          className="mt-6 bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600"
          onClick={submitAnswer}
          disabled={selectedAnswerLocal === null || !quizStarted} // Disable if no answer selected or quiz not started
        >
          {currentQuestionIndex === questions.length - 1 ? 'Submit Final Answer' : 'Submit Answer & Next'}
        </button>
      </div>
    </div>
  );
};

export default TakeQuiz;