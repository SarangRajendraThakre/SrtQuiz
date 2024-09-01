import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './QuizList.css';
import { baseUrl1 } from "../../utils/services";

const QuizListPrivate = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [creatorNames, setCreatorNames] = useState([]);
  const [clickedCardId, setClickedCardId] = useState(null);
  const [showButtonId, setShowButtonId] = useState(null);
  const [error, setError] = useState(null);
  const userId = JSON.parse(localStorage.getItem('User'))._id;
  const userName = JSON.parse(localStorage.getItem('User')).name;

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`${baseUrl1}/api/quizzes/${userId}`);
        setQuizzes(response.data.quizzes);
      } catch (error) {
        setError(error);
        console.error('Error fetching quizzes:', error);
      }
    };

    if (userId) {
      fetchQuizzes();
    }
  }, [userId]);

  useEffect(() => {
    const fetchQuizCreatorNames = async () => {
      const promises = quizzes.map(async (quiz) => {
        try {
          const response = await axios.get(`${baseUrl1}/api/find/${quiz.createdBy}`);
          return response.data.name;
        } catch (error) {
          console.error('Error fetching quiz creator name:', error);
          return 'Unknown';
        }
      });
      const names = await Promise.all(promises);
      setCreatorNames(names);
    };

    if (quizzes.length > 0) {
      fetchQuizCreatorNames();
    }
  }, [quizzes]);

  const handleCardClick = (quizId) => {
    if (clickedCardId === quizId) {
      setClickedCardId(null);
      setShowButtonId(null);
    } else {
      setClickedCardId(quizId);
      setShowButtonId(quizId);
    }
  };

  const handleEditClick = (quizId) => {
    localStorage.setItem('createdQuizId', quizId);
  };

  return (
    <div className='mt-3 p-4'>
      <h1 className='font-semibold'>{`Quizzes Made by ${userName}`}</h1>
      {error && error.response && error.response.status === 500 && (
        <div>No quizzes have been created yet.</div>
      )}
      {!error && (
        <Row xs={1} md={2} lg={3} className="g-4">
          {quizzes.map((quiz, index) => (
            <Col key={quiz._id} className='p-3'>
              <Card className='p-2' onClick={() => handleCardClick(quiz._id)}>
                <Card.Img variant="top" src={`${baseUrl1}${quiz.posterImg}`} style={{ height: '200px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title className='text-2xl'>{quiz.title}</Card.Title>
                  <p>Created By: {creatorNames[index]}</p>
                  <p>Number of Questions: {quiz.questions.length}</p>
                  <div className='bottombuttons'>
                    <Link to={`/host/${quiz._id}`}>
                      <Button className={`quiz-button ${showButtonId === quiz._id ? 'show' : ''}`} variant="primary">Host</Button>
                    </Link>
                    <Link to={`/createquiz/${quiz._id}`}>
                      <Button className={`quiz-button ${showButtonId === quiz._id ? 'show' : ''}`} variant="primary" onClick={() => handleEditClick(quiz._id)}>Edit</Button>
                    </Link>
                    <Link to={`/takequiz/${quiz._id}`}>
                      <Button className={`quiz-button ${showButtonId === quiz._id ? 'show' : ''}`} variant="primary">Play</Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default QuizListPrivate;
