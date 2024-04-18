import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const userId = JSON.parse(localStorage.getItem('User'))._id;
  
const createdQuizId = localStorage.getItem('createdQuizId');


  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/quizzes/${userId}`);
        setQuizzes(response.data.quizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    if (userId) {
      fetchQuizzes();
    }
  }, [userId]);

  return (
    <div>
      <h1>Quiz List</h1>
      <div>
        {quizzes.map((quiz) => (
          <div key={quiz._id}>
            <h2>{quiz.title}</h2>
            <p>Visibility: {quiz.visibility}</p>
            <p>Created By: {quiz.createdBy}</p>
            <div>
              {quiz.questions.map((question) => (
                <div key={question._id}>
                  <p>{question.questionText}</p>
                  <p>{question.options}</p>
                  {question.imagePath && <img src={`http://localhost:5000${question.imagePath}`} alt="Question Image" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
