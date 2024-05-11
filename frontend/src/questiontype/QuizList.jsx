import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Row, Button } from 'react-bootstrap'; // Import Button component
import './QuizList.css'; // Import CSS file for animation

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [clickedCardId, setClickedCardId] = useState(null); // State to keep track of clicked card ID
  const [showButtonId, setShowButtonId] = useState(null); // State to keep track of showing button ID
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

  // Function to handle card click
  const handleCardClick = (quizId) => {
    if (clickedCardId === quizId) {
      setClickedCardId(null);
      setShowButtonId(null);
    } else {
      setClickedCardId(quizId);
      setShowButtonId(quizId);
    }
  };

  return (
    <div className='mt-3 p-4'>
      <h1 className='font-semibold'>{`Quiz Made by ${userName}`}</h1>
      <Row xs={1} md={2} className="g-4">
        {quizzes.map((quiz) => (
          <Col key={quiz._id} className='p-3'>
            <Card className='p-2' onClick={() => handleCardClick(quiz._id)}> {/* Add onClick event handler */}
              <Card.Img variant="top" src={`http://localhost:5000${quiz.posterImg}`} style={{ height: '300px', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title className='text-2xl'>{quiz.title}</Card.Title>
                <p>Created By: {quiz.createdBy}</p>
                <p>Number of Questions: {quiz.questions.length}</p> {/* Display the number of questions */}

<div className='bottombuttons'>
              <a href=""> <Button className={`quiz-button ${showButtonId === quiz._id ? 'show' : ''}`} variant="primary">Host</Button></a> 
                <a href=""> <Button className={`quiz-button ${showButtonId === quiz._id ? 'show' : ''}`} variant="primary">Edit</Button></a>  
                 <a href=""> <Button className={`quiz-button ${showButtonId === quiz._id ? 'show' : ''}`} variant="primary">play</Button></a> 
               {/* Conditionally render button based on showButtonId state */}</div>

              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default QuizList;
