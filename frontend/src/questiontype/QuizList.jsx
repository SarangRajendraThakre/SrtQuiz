import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Row } from 'react-bootstrap';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const userId = JSON.parse(localStorage.getItem('User'))._id;
  const userName = JSON.parse(localStorage.getItem('User')).name;

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
    <div className='mt-3 p-4'>
      <h1 className='font-semibold'>{`Quiz Made by ${userName}`}</h1>
      <Row xs={1} md={2} className="g-4">
        {quizzes.map((quiz) => (
          <Col key={quiz._id} className='p-3'>
            <Card className='p-2'>
              <Card.Img variant="top" src={`http://localhost:5000${quiz.posterImg}`} style={{ height: '300px', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title className='text-2xl'>{quiz.title}</Card.Title>
                <p>Created By: {quiz.createdBy}</p>
                <p>Number of Questions: {quiz.questions.length}</p> {/* Display the number of questions */}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default QuizList;
