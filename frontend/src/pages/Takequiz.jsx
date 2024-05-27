import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Lottie from "lottie-react";
import quizAnimation from "../assets/quiz.json";

import correctSound from "../assets/sound/correct1.wav";
import wrongSound from "../assets/sound/fail.mp3";
import { baseUrl1 } from "../utils/services";

const TakeQuiz = () => {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [timer, setTimer] = useState(0);

  const correctAudio = useRef(new Audio(correctSound));
  const wrongAudio = useRef(new Audio(wrongSound));
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`${baseUrl1}/api/quizzes/quiz/${quizId}`);
        const fetchedQuizData = response.data.quiz;
        shuffleQuestions(fetchedQuizData.questions);
        setQuizData(fetchedQuizData);
        setTimer(fetchedQuizData.questions[0].timer || 0); // Initialize timer for the first question
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    if (timer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(timerIntervalRef.current);
    } else if (timer === 0 && quizData) {
      moveToNextQuestion();
    }
  }, [timer, quizData]);

  const shuffleQuestions = (questions) => {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
  };

  const handleOptionClick = (index) => {
    if (!quizCompleted) {
      setSelectedOptionIndex(index);
      setShowCorrectAnswer(true);
      clearInterval(timerIntervalRef.current); // Stop the timer when an answer is selected
      const correctAnswerIndex = findCorrectAnswerIndex();

      if (correctAnswerIndex === -1) {
        console.error("No correct answer specified for this question.");
        return;
      }

      if (index === correctAnswerIndex) {
        setScore(score + 1);
        correctAudio.current.play();
        handleCorrectAnswer();
      } else {
        wrongAudio.current.play();
        setTimeout(() => {
          moveToNextQuestion();
        }, 2000);
      }
    }
  };

  const handleInputSubmit = () => {
    if (!quizCompleted) {
      setShowCorrectAnswer(true);
      clearInterval(timerIntervalRef.current); // Stop the timer when an answer is submitted

      if (userInput.trim().toLowerCase() === quizData.questions[currentQuestionIndex].options[0].toLowerCase()) {
        setScore(score + 1);
        correctAudio.current.play();
        handleCorrectAnswer();
      } else {
        wrongAudio.current.play();
        setTimeout(() => {
          moveToNextQuestion();
        }, 2000);
      }
    }
  };

  const handleCorrectAnswer = () => {
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
      moveToNextQuestion();
    }, 7000); // Adjust the duration as needed
  };

  const getCurrentQuestionOptions = () => {
    return quizData?.questions[currentQuestionIndex]?.options || [];
  };

  const findCorrectAnswerIndex = () => {
    const correctAnswers = quizData.questions[currentQuestionIndex].correctAnswers;
    const correctAnswerIndex = correctAnswers.findIndex(ans => ans !== "");
    return correctAnswerIndex !== -1 ? parseInt(correctAnswers[correctAnswerIndex]) : -1;
  };

  const moveToNextQuestion = () => {
    if (quizData && currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionIndex(null);
      setUserInput('');
      setShowCorrectAnswer(false);
      setTimer(quizData.questions[currentQuestionIndex + 1].timer || 0); // Update timer for the next question
    } else {
      setQuizCompleted(true);
    }
  };

  if (!quizData) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const options = getCurrentQuestionOptions();

  return (
    <div
      className="h-screen flex justify-center items-center"
      style={{
        backgroundImage: `url(http://localhost:5000${currentQuestion.imagePath})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-lg bg-black opacity-70 p-8 rounded-lg shadow-xl absolute">
        <h1 className="text-3xl mb-6 font-bold text-white text-center">
          {quizData.title}
        </h1>
        <div className="question-container bg-transparent p-6 rounded-lg shadow-md mb-6 relative">
          <h2 className="text-xl text-white mb-4">{currentQuestion.questionText}</h2>
          <div className="timer-container mb-4 text-center">
            <p className="font-bold text-lg text-white">Time Left: {timer} seconds</p>
          </div>
          <div className="options-list">
            {currentQuestion.questionType === "NAT" ? (
              <div className="input-container">
                <input
                  type="text"
                  className="w-full px-4 py-2 mb-4 rounded-md transition duration-300 focus:outline-none bg-white text-black"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={quizCompleted}
                />
                <button
                  className="option-button w-full px-4 py-2 mb-4 rounded-md transition duration-300 focus:outline-none bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={handleInputSubmit}
                  disabled={quizCompleted}
                >
                  Submit
                </button>
              </div>
            ) : (
              options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button w-full px-4 py-2 mb-4 rounded-md transition duration-300 focus:outline-none ${
                    selectedOptionIndex === index && showCorrectAnswer
                      ? index === findCorrectAnswerIndex()
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                  onClick={() => handleOptionClick(index)}
                  disabled={quizCompleted}
                >
                  {option}
                </button>
              ))
            )}
          </div>
          {showCorrectAnswer && showAnimation && (
            <div className="lottie-container absolute top-0 left-0 w-full h-full z-10 flex justify-center items-center pointer-events-none">
              <Lottie
                className="w-full h-auto"
                animationData={quizAnimation}
                loop={false}
                autoplay={true}
                style={{ background: "transparent" }}
              />
            </div>
          )}
        </div>
     
        {quizCompleted && (
          <div className="result-container bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl mb-4">Quiz Completed!</h2>
            <p className="text-lg">
              Your Score: {score}/{quizData.questions.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
