// QuizIdfetched.jsx

import React from 'react';
import { useQuiz } from '../context/QuizContext';

const QuizIdfetched = () => {
  const { quizData, loading, error } = useQuiz();

  return (
    <div>
      <h1>Quiz Detail</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : quizData ? (
        <div>
          <h2>{quizData.title}</h2>
          <div>
            <h3>Questions:</h3>
            <ul>
              {quizData.questions.map((question, index) => (
                <li key={index}>
                  <p>{question.questionText}</p>
                  <ul>
                    {question.options.map((option, optionIndex) => (
                      <li key={optionIndex}>{option}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>No quiz data available</p>
      )}
    </div>
  );
};

export default QuizIdfetched;
