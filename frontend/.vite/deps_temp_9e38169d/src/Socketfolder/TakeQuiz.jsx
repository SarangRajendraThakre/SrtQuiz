import React, { useState, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import { baseUrl1 } from "../utils/services";

const TakeQuiz = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const { quizId } = useParams();
  const navigate = useNavigate();

  const socket = useMemo(() => io(baseUrl1), [quizId]);

  useEffect(() => {
    socket.emit('join room', quizId, (response) => {
      console.log('Join room response:', response);
    });

    socket.on('quiz started', (quizData) => {
      console.log('Quiz started received:', quizData);
      setQuizStarted(true);
      setQuestions(quizData.questions);
    });

    return () => {
      socket.disconnect();
    };
  }, [quizId, socket]);

  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswer,
    }));
  };

  const submitAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = answers[currentQuestion.id];

    if (selectedAnswer === currentQuestion.options[currentQuestion.answer]) {
      setScore((prevScore) => prevScore + 1);
    }

    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (isLastQuestion) {
      socket.emit('submit score', { score: score + 1, roomCode: quizId });
      navigate('/leaderboard', { state: { userScore: score + 1 } });
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const getButtonClass = (questionId, option) => {
    const isSelected = answers[questionId] === option;
    return `py-2 px-4 rounded border transition-all ${
      isSelected
        ? 'bg-green-500 text-white border-green-600'
        : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-100'
    }`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {quizStarted ? (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Question {currentQuestionIndex + 1}
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            {questions[currentQuestionIndex]?.question}
          </p>
          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestionIndex]?.options.map((option, index) => (
              <button
                key={index}
                className={getButtonClass(questions[currentQuestionIndex].id, option)}
                onClick={() =>
                  handleAnswerSelect(questions[currentQuestionIndex].id, option)
                }
              >
                {option}
              </button>
            ))}
          </div>
          <button
            className="mt-6 bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600"
            onClick={submitAnswer}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      ) : (
        <p className="text-xl text-gray-700">Waiting for the host to start the quiz...</p>
      )}
    </div>
  );
};

export default TakeQuiz;
