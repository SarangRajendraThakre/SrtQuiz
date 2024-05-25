import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Row, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './QuizList.css';
import { baseUrl1 } from "../../utils/services";

const QuizListPublic = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showButtonId, setShowButtonId] = useState(null);

  useEffect(() => {
    const fetchPublicQuizzes = async () => {
      try {
        const response = await axios.get(`${baseUrl1}/api/quizzes/all`);
        const publicQuizzes = response.data.quizzes.filter(quiz => quiz.visibility === 'public');
        await Promise.all(publicQuizzes.map(async (quiz) => {
          if (quiz.createdBy) {
            const creator = await axios.get(`${baseUrl1}/api/find/${quiz.createdBy}`);
            quiz.creatorName = creator.data.name;
          }
        }));
        setQuizzes(publicQuizzes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching public quizzes:', error);
      }
    };
    

    fetchPublicQuizzes();
  }, []);

  const handleCardClick = (quizId) => {
    setShowButtonId(quizId);
  };

  return (
    <div className='mt-3 p-4'>
      <h1 className='font-semibold'>Public Quizzes</h1>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <Row xs={1} md={2} className="g-4">
          {quizzes.map((quiz) => (
            <Col key={quiz._id} className='p-3'>
              <Card className='p-2' onClick={() => handleCardClick(quiz._id)}>
                <Card.Img variant="top" src={`${baseUrl1}${quiz.posterImg}`} style={{ height: '300px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title className='text-2xl'>{quiz.title}</Card.Title>
                  <p>Created By: {quiz.creatorName}</p>
                  <p>Number of Questions: {quiz.questions.length}</p>
                  <div className='bottombuttons'>
                    <Link to={`/createquiz/${quiz._id}`}>
                      <Button className={`quiz-button ${showButtonId === quiz._id ? 'show' : ''}`} variant="primary">Edit</Button>
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

export default QuizListPublic;
