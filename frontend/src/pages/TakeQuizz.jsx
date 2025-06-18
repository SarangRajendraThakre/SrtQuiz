import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Lottie from "lottie-react";
import quizAnimation from "../assets/quiz.json";
import correctSound from "../assets/sound/correct1.wav";
import wrongSound from "../assets/sound/fail.mp3";
import { baseUrl1 } from "../utils/services";
import "./home.css";


const TakeQuizz = () => {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndexes, setSelectedOptionIndexes] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [timer, setTimer] = useState(0);
  const [quizCardVisible, setQuizCardVisible] = useState(true); // State to manage the visibility of the quiz card

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

  const findCorrectAnswerIndex = () => {
    const correctAnswers = quizData.questions[currentQuestionIndex].correctAnswers;
    const correctAnswerIndex = correctAnswers.findIndex(ans => ans !== "");
    return correctAnswerIndex !== -1 ? parseInt(correctAnswers[correctAnswerIndex]) : -1;
  };
  
  const handleOptionClick = (index) => {
    if (!quizCompleted) {
      if (currentQuestion.questionType === "MCQ" || currentQuestion.questionType === "True/False") {
        // For MCQ and True/False questions, update selected option index directly
        setSelectedOptionIndexes([index]);
        setShowCorrectAnswer(true);
        clearInterval(timerIntervalRef.current); // Stop the timer when an answer is selected
        
        // Check if the selected option index is the correct answer index
        const correctAnswerIndex = findCorrectAnswerIndex();
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
      } else {
        // For other question types, toggle selected option indexes (MSQ or NAT)
        const newSelectedIndexes = [...selectedOptionIndexes];
        const selectedIndexIndex = newSelectedIndexes.indexOf(index);
        if (selectedIndexIndex !== -1) {
          newSelectedIndexes.splice(selectedIndexIndex, 1);
        } else {
          newSelectedIndexes.push(index);
        }
        setSelectedOptionIndexes(newSelectedIndexes);
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

  const findCorrectAnswerIndexes = () => {
    return quizData.questions[currentQuestionIndex].correctAnswers.map((ans) => parseInt(ans));
  };

  const moveToNextQuestion = () => {
    if (quizData && currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionIndexes([]);
      setUserInput('');
      setShowCorrectAnswer(false);
      setTimer(quizData.questions[currentQuestionIndex + 1].timer || 0); // Update timer for the next question
    } else {
      setQuizCompleted(true);
    }
  };

  const checkMSQAnswer = () => {
    if (!quizCompleted) {
      setShowCorrectAnswer(true);
      clearInterval(timerIntervalRef.current); // Stop the timer when an answer is submitted
  
      const correctAnswerIndexes = findCorrectAnswerIndexes();
      const isCorrect =
        correctAnswerIndexes.every((index) =>
          selectedOptionIndexes.includes(index)
        ) &&
        correctAnswerIndexes.length === selectedOptionIndexes.length;
      if (isCorrect) {
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
  

  const toggleQuizCardVisibility = () => {
    setQuizCardVisible(!quizCardVisible);
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

  const handleQuizCardClick = (e) => {
    // Prevent toggling the quiz card visibility when clicked on the quiz-taking card
    e.stopPropagation();
  };
  
  return (
    <div
      className="mainimagecontainer h-screen flex justify-center items-center bg-black"
      style={{
        backgroundImage: `url(${baseUrl1}${currentQuestion.imagePath})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={toggleQuizCardVisibility} // Toggle quiz card visibility on click
    >
      {quizCardVisible && (
        <div
          className="quiz-takingcard max-w-lg bg-black opacity-70 p-8 rounded-lg shadow-xl absolute"
          onClick={handleQuizCardClick} // Prevent event propagation when clicked on the quiz-taking card
        >
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
            ) : currentQuestion.questionType === "MSQ" ? (
              <>
                {options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-button w-full px-4 py-2 mb-4 rounded-md transition duration-300 focus:outline-none ${
                      selectedOptionIndexes.includes(index)
                        ? "bg-yellow-500 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                    onClick={() => handleOptionClick(index)}
                    disabled={quizCompleted}
                  >
                    {option}
                  </button>
                ))}
                {selectedOptionIndexes.length > 0 && (
                  <button
                    className="option-button w-full px-4 py-2 mb-4 rounded-md transition duration-300 focus:outline-none bg-green-500 hover:bg-green-600 text-white"
                    onClick={checkMSQAnswer}
                    disabled={quizCompleted}
                  >
                    Submit
                  </button>
                )}
              </>
            ) : (
              options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button w-full px-4 py-2 mb-4 rounded-md transition duration-300 focus:outline-none ${
                    selectedOptionIndexes.includes(index) && showCorrectAnswer
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
          {quizCompleted && (
            <div className="result-container">
              <h2 className="text-2xl font-bold text-white text-center mb-4">
                Quiz Completed
              </h2>
              <p className="text-white text-center mb-4">
                Your final score is: {score}/{quizData.questions.length}
              </p>
            </div>
          )}
        </div>
        {showAnimation && (
          <div className="animation-container fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <Lottie
              animationData={quizAnimation}
              loop={false}
              autoplay
              className="w-screen h-screen"
            />
          </div>
        )}
      </div>
    )}
      <footer className="footermain">Developed by : SARANG .R. THAKRE</footer>
  </div>

);
};

export default TakeQuizz;

