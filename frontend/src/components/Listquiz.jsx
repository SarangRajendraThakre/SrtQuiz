// QuizList.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

const Listquiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const { user } = useContext(AuthContext); // Assuming you have a context for authentication

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/quizzes/${user._id}`);
        setQuizzes(response.data.quizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, [user._id]);

  return (
    <div>
      <h2>Your Quizzes</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz._id}>
            <h3>{quiz.title}</h3>
            <p>Visibility: {quiz.visibility}</p>
            {/* Add more details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Listquiz;
