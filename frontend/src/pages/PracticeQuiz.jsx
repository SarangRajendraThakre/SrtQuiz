import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { baseUrl1 } from "../utils/services";
import "./PracticeQuiz.css";

// --- HELPER FUNCTION TO SHUFFLE THE ARRAY ---
const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const PracticeQuiz = () => {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [animationClass, setAnimationClass] = useState('animate-in-br');
  const [summary, setSummary] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const optionStyles = [
    { color: 'bg-red-600', hover: 'hover:bg-red-700', shape: '▲' },
    { color: 'bg-blue-600', hover: 'hover:bg-blue-700', shape: '♦' },
    { color: 'bg-yellow-500', hover: 'hover:bg-yellow-600', text: 'text-black', shape: '●' },
    { color: 'bg-green-600', hover: 'hover:bg-green-700', shape: '■' },
  ];

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        // FIX 1: The URL now points to the specific /practice endpoint.
        const response = await axios.get(`${baseUrl1}/api/quizzes/${quizId}/practice`);
        
        const fetchedQuiz = response.data.quiz;

        if (!fetchedQuiz) {
          console.error("Quiz not found in response!");
          return;
        }

        const questionsToShuffle = fetchedQuiz.questions || [];
        // FIX 2: The shuffleArray function is now being called correctly.
        const shuffledQuizData = { ...fetchedQuiz, questions: shuffleArray(questionsToShuffle) };

        setQuizData(shuffledQuizData);
        setSummary(Array(shuffledQuizData.questions.length).fill({
          status: 'unseen',
          isImportant: false
        }));

      } catch (error) { 
        console.error("The API call FAILED. Here is the error:", error); 
      }
    };
    
    fetchQuizData();
  }, [quizId]);


  const findCorrectAnswerIndex = useCallback(() => {
    if (!quizData) return -1;
    const question = quizData.questions[currentQuestionIndex];
    return parseInt(question.correctAnswers.find(ans => ans !== "") ?? -1);
  }, [quizData, currentQuestionIndex]);

  const handleNavigation = (direction) => {
    if (animationClass.includes('out')) return;
    const isNext = direction === 'next';
    const newIndex = currentQuestionIndex + (isNext ? 1 : -1);
    if (newIndex < 0 || newIndex >= quizData.questions.length) return;

    setAnimationClass(isNext ? 'animate-out-bl' : 'animate-out-br');
    setTimeout(() => {
      setCurrentQuestionIndex(newIndex);
      setIsFlipped(false);
      setAnimationClass(isNext ? 'animate-in-br' : 'animate-in-bl');
    }, 600);
  };

  const handleOptionSelect = (selectedIndex) => {
    if (summary[currentQuestionIndex].status !== 'unseen') return;
    const correctIndex = findCorrectAnswerIndex();
    const isCorrect = selectedIndex === correctIndex;
    updateSummary(currentQuestionIndex, { status: isCorrect ? 'correct' : 'incorrect' });
    setIsFlipped(true);
  };

  const handleShowAnswer = () => {
    if (summary[currentQuestionIndex].status === 'unseen') {
      updateSummary(currentQuestionIndex, { status: 'viewed' });
    }
    setIsFlipped(!isFlipped);
  };

  const toggleImportant = () => {
    const currentStatus = summary[currentQuestionIndex].isImportant;
    updateSummary(currentQuestionIndex, { isImportant: !currentStatus });
  };
  
  const updateSummary = (index, newProps) => {
    setSummary(prev => prev.map((item, i) => i === index ? { ...item, ...newProps } : item));
  };
  
  const handleKeyDown = useCallback((event) => {
    if (quizCompleted) return;
    if (event.key === 'ArrowRight') handleNavigation('next');
    if (event.key === 'ArrowLeft') handleNavigation('prev');
  }, [handleNavigation, quizCompleted]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!quizData) {
    return <div className="h-screen flex justify-center items-center bg-gray-100"><p className="text-lg">Loading...</p></div>;
  }
  
  if (quizCompleted) {
    const correctCount = summary.filter(q => q.status === 'correct').length;
    const incorrectCount = summary.filter(q => q.status === 'incorrect').length;
    const viewedCount = summary.filter(q => q.status === 'viewed').length;
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center p-2 sm:p-4">
        <div className="w-full max-w-4xl bg-white p-4 sm:p-8 rounded-lg shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">Practice Summary</h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-center mb-8">
            <div className="bg-green-100 p-4 rounded-lg"><p className="text-3xl sm:text-4xl font-bold text-green-600">{correctCount}</p><p className="text-md sm:text-lg text-green-800">Correct</p></div>
            <div className="bg-red-100 p-4 rounded-lg"><p className="text-3xl sm:text-4xl font-bold text-red-600">{incorrectCount}</p><p className="text-md sm:text-lg text-red-800">Incorrect</p></div>
            <div className="bg-blue-100 p-4 rounded-lg"><p className="text-3xl sm:text-4xl font-bold text-blue-600">{viewedCount}</p><p className="text-md sm:text-lg text-blue-800">Viewed</p></div>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Question Review</h2>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {quizData.questions.map((q, index) => (
              <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md text-sm md:text-base">
                <span className="truncate w-3/4">{index + 1}. {q.questionText}</span>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  {summary[index].isImportant && <span title="Marked as Important">⭐</span>}
                  {summary[index].status === 'correct' && <span className="font-bold text-green-600">Correct</span>}
                  {summary[index].status === 'incorrect' && <span className="font-bold text-red-600">Incorrect</span>}
                  {summary[index].status === 'viewed' && <span className="font-bold text-blue-600">Viewed</span>}
                  {summary[index].status === 'unseen' && <span className="text-gray-500">Unseen</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const correctAnswerIndex = findCorrectAnswerIndex();
  const hasImage = currentQuestion.imagePath && currentQuestion.imagePath.trim() !== '';

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-2 sm:p-4 font-sans overflow-hidden">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">{quizData.title} - Practice Mode</h1>
        
        <div className={`mx-auto ${animationClass}`}>
          <div className="card-perspective h-[550px] sm:h-[520px]">
            <div className={`card-container ${isFlipped ? "is-flipped" : ""}`}>
              <div className="card-front bg-white justify-between">
                <button onClick={toggleImportant} className={`important-btn ${summary[currentQuestionIndex]?.isImportant ? 'marked' : ''}`} title="Mark as Important">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" /></svg>
                </button>
                <div>
                  <p className="font-semibold text-blue-600 pr-10">Question {currentQuestionIndex + 1} / {quizData.questions.length}</p>
                  <p className="text-xl lg:text-2xl mt-2 font-bold text-gray-800 pr-10">{currentQuestion.questionText}</p>
                </div>
                {hasImage && (
                  <div className="my-2 sm:my-4 flex justify-center items-center">
                    <img src={`${currentQuestion.imagePath}`} alt="Question visual" className="max-h-32 sm:max-h-40 w-auto object-contain rounded-lg"/>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-auto">
                  {currentQuestion.options.map((option, index) => {
                    const style = optionStyles[index % 4];
                    return (
                      <button key={index} onClick={() => handleOptionSelect(index)} disabled={summary[currentQuestionIndex].status !== 'unseen'}
                        className={`p-3 sm:p-4 rounded-lg flex items-center transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${style.color} ${style.text || 'text-white'}`}>
                        <span className="text-xl sm:text-2xl font-bold mr-2 sm:mr-4">{style.shape}</span>
                        <span className="text-sm md:text-base lg:text-lg font-semibold text-left">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={`card-back ${summary[currentQuestionIndex].status === 'correct' ? 'bg-green-600' : summary[currentQuestionIndex].status === 'incorrect' ? 'bg-red-600' : 'bg-gray-700'}`}>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 border-b pb-3">Answer & Explanation</h2>
                <div className="flex-grow overflow-y-auto text-base md:text-lg">
                  <p><span className="font-bold">Correct Answer: </span>{currentQuestion.options[correctAnswerIndex]}</p>
                  <p className="mt-4"><span className="font-bold">Explanation: </span>{currentQuestion.explanation || "No explanation provided."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <button onClick={() => handleNavigation('prev')} disabled={currentQuestionIndex === 0 || animationClass.includes('out')} className="px-6 py-3 bg-white text-gray-700 font-bold rounded-lg shadow-md disabled:opacity-50 md:order-1">Previous</button>
          <button onClick={handleShowAnswer} className="px-8 py-4 bg-purple-600 text-white font-bold text-lg rounded-lg shadow-xl hover:bg-purple-700 md:order-2">{isFlipped ? 'Hide Answer' : 'Show Answer'}</button>
          <button onClick={() => handleNavigation('next')} disabled={currentQuestionIndex === quizData.questions.length - 1 || animationClass.includes('out')} className="px-6 py-3 bg-white text-gray-700 font-bold rounded-lg shadow-md disabled:opacity-50 md:order-3">Next</button>
        </div>
        <div className="text-center">
            <button onClick={() => setQuizCompleted(true)} className="mt-4 w-full max-w-xs md:max-w-sm px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600">Finish & Summarize</button>
        </div>
      </div>
    </div>
  );
};

export default PracticeQuiz;