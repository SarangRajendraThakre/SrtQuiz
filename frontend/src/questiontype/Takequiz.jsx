import React, { useState, useEffect } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import quizAnimation from "../assets/quiz.json";
import lotty2Animation from "../assets/lotty2.json";
import lottyanimationAnimation from "../assets/lottyanimation.json";

import correctSound from "../assets/sound/correct1.wav";
import wrongSound from "../assets/sound/fail.mp3";

const Takequiz = () => {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [randomAnimation, setRandomAnimation] = useState(null);
  const [timer, setTimer] = useState(0);
  const [correctAudio] = useState(new Audio(correctSound));
  const [wrongAudio] = useState(new Audio(wrongSound));

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/quizzes/quiz/6627ec58eeb832bfabf626a3"
        );
        setQuizData(response.data.quiz);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, []);

  useEffect(() => {
    const animations = [
      quizAnimation,
      lotty2Animation,
      lottyanimationAnimation,
    ];
    const randomIndex = Math.floor(Math.random() * animations.length);
    setRandomAnimation(animations[randomIndex]);
  }, []);

  useEffect(() => {
    if (quizData) {
      setTimer(quizData.questions[currentQuestionIndex].timer || 0);
    }
  }, [quizData, currentQuestionIndex]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);
      } else {
        clearInterval(timerInterval);
      }
    }, 5000);

    return () => clearInterval(timerInterval);
  }, [timer]);

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
      const currentQuestionType = getCurrentQuestionType();
      const correctAnswerIndex = findCorrectAnswerIndex();
      
      if (correctAnswerIndex === -1) {
        // No correct answer specified
        console.error("No correct answer specified for this question.");
        return;
      }

      if (index === correctAnswerIndex) {
        setScore(score + 1);
        correctAudio.play(); // Play correct answer sound
        handleCorrectAnswer(); // Handle correct answer
      } else {
        wrongAudio.play(); // Play wrong answer sound
        setTimeout(() => {
          moveToNextQuestion(); // Move to next question for wrong answer
        }, 2000); // Wait for 2 seconds before moving to the next question for wrong answer
      }
    }
  };
  
  const handleCorrectAnswer = () => {
    setRandomAnimation(quizAnimation); // Use quizAnimation for correct answer
    setTimeout(() => {
      moveToNextQuestion();
    }, 7000); // Move to next question after 2 seconds
  };

  const getCurrentQuestionOptions = () => {
    return quizData?.questions[currentQuestionIndex]?.options || [];
  };

  const findCorrectAnswerIndex = () => {
    const correctAnswers = quizData.questions[currentQuestionIndex].correctAnswers;
    const correctAnswerIndex = correctAnswers.findIndex(ans => ans !== "");
    return correctAnswerIndex !== -1 ? parseInt(correctAnswers[correctAnswerIndex]) : -1;
  };

  const getCurrentQuestionType = () => {
    return quizData?.questions[currentQuestionIndex]?.questionType || "";
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionIndex(null);
      setShowCorrectAnswer(false);
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
  const questionType = getCurrentQuestionType();

  return (
    <div
      className="h-screen flex justify-center items-center"
      style={{
        backgroundImage: `url(http://localhost:5000${currentQuestion.imagePath})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-lg bg-white p-8 rounded-lg shadow-xl relative">
        <h1 className="text-3xl mb-6 font-bold text-center">
          {quizData.title}
        </h1>
        <div className="question-container bg-gray-100 p-6 rounded-lg shadow-md mb-6 relative">
          <h2 className="text-xl mb-4">{currentQuestion.questionText}</h2>
          <div className="timer-container mb-4 text-center">
            <p className="font-bold text-lg">Time Left: {timer} seconds</p>
          </div>
          <div className="options-list">
            {options.map((option, index) => (
              <button
                key={index}
                className={`option-button w-full px-4 py-2 mb-4 rounded-md transition duration-300 focus:outline-none ${
                  selectedOptionIndex === index && showCorrectAnswer
                    ? index === findCorrectAnswerIndex()
                      ? "bg-green-500 hover:bg-green-600 text-white" // Correct answer
                      : "bg-red-500 hover:bg-red-600 text-white" // Wrong answer
                    : "bg-blue-500 hover:bg-blue-600 text-white" // Default
                }`}
                onClick={() => handleOptionClick(index)}
                disabled={quizCompleted}
              >
                {option}
              </button>
            ))}
          </div>
          {showCorrectAnswer && (
            <div className="lottie-container absolute top-0 left-0 w-full h-full z-10 flex justify-center items-center pointer-events-none">
              <Lottie
                className="w-full h-auto"
                animationData={randomAnimation}
                loop={false}
                autoplay={true}
                style={{ background: "transparent" }}
              />
            </div>
          )}
        </div>
        <button
          onClick={moveToNextQuestion}
          className={`next-button w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-300 focus:outline-none ${
            selectedOptionIndex === null || quizCompleted
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={selectedOptionIndex === null || quizCompleted}
        >
          Next
        </button>
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

export default Takequiz;
