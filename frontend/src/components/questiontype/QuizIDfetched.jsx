import React, { useState, useEffect } from 'react';
import axios from 'axios';
const QuizIdfetched = () => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizId = localStorage.getItem('createdQuizId');
        console.log('Quiz ID:', quizId);

        if (!quizId) {
          throw new Error('Quiz ID not found in local storage');
        }

        // Fetch the quiz data from MongoDB using Axios or any other HTTP client library
        const response = await axios.get(`http://localhost:5000/api/quizzes/quiz/${quizId}`);
        console.log('Response:', response);

        // Set the quiz state with the fetched quiz data
        setQuiz(response.data.quiz);
        setLoading(false); // Set loading to false after successful fetch
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError(error.message); // Set error message in state
        setLoading(false); // Set loading to false after error
      }
    };
  
    fetchQuiz();
  }, []);

  return (
    <div>
      <h1>Quiz Detail</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : quiz ? (
        <div>
          <h2>{quiz.title}</h2>
          {/* Render other quiz details here */}
        </div>
      ) : (
        <p>No quiz data available</p>
      )}
    </div>
  );
};

export default QuizIdfetched;
