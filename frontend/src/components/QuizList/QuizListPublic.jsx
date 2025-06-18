import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './QuizList.css';
import { baseUrl1 } from "../../utils/services";

const QuizListPublic = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showButtonId, setShowButtonId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicQuizzes = async () => {
      try {
        const response = await axios.get(`${baseUrl1}/api/quizzes/all`);
        const publicQuizzes = response.data.quizzes.filter(quiz => quiz.visibility === 'public');

        const quizzesWithCreators = await Promise.all(
          publicQuizzes.map(async (quiz) => {
            try {
              if (quiz.createdBy) {
                const creatorRes = await axios.get(`${baseUrl1}/api/users/find/${quiz.createdBy}`);
                const creatorName = creatorRes?.data?.name || 'Unknown';
                return { ...quiz, creatorName };
              }
              return { ...quiz, creatorName: 'Unknown' };
            } catch (err) {
              console.error(`Error fetching creator for quiz ${quiz._id}:`, err);
              return { ...quiz, creatorName: 'Unknown' };
            }
          })
        );

        setQuizzes(quizzesWithCreators);
      } catch (error) {
        console.error('Error fetching public quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicQuizzes();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  const handleCardClick = (quizId) => {
    setShowButtonId(quizId);
  };

  const handleCopyClick = async (quizId) => {
    try {
      const response = await axios.get(`${baseUrl1}/api/quizzes/quiz/${quizId}`);
      const originalQuiz = response.data.quiz;

      const user = JSON.parse(localStorage.getItem('User'));
      if (!user || !user._id) {
        console.error("User ID not found in local storage");
        return;
      }

      const newQuizData = {
        ...originalQuiz,
        _id: undefined,
        createdBy: user._id,
        title: `${originalQuiz.title} (Copy)`,
      };

      const newQuizResponse = await axios.post(`${baseUrl1}/api/quizzes`, newQuizData);
      const newquizid = newQuizResponse.data._id;

      for (const question of originalQuiz.questions) {
        const { questionText, options, correctAnswers, questionType, imagePath } = question;

        await axios.post(`${baseUrl1}/api/add-questionss`, {
          quizId: newquizid,
          question: {
            questionText,
            options,
            correctAnswers,
            questionType,
            imagePath,
          }
        });
      }

      navigate(`/createquiz/${newquizid}`);
    } catch (error) {
      console.error('Error copying quiz:', error);
    }
  };

  return (
    <div className='mt-3 p-4'>
      <h1 className='font-semibold'>Public Quizzes</h1>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Slider {...settings}>
          {quizzes.map((quiz) => (
            <div key={quiz._id} className='slider-card-container'>
              <Card onClick={() => handleCardClick(quiz._id)}>
                <Card.Img variant="top" src={`${baseUrl1}${quiz.posterImg}`} style={{ height: '200px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title className='text-2xl'>{quiz.title}</Card.Title>
                  <p>Created By: {quiz.creatorName}</p>
                  <p>Number of Questions: {quiz.questions.length}</p>
                  <div className='bottombuttons'>
                    <Link to={`/takequiz/${quiz._id}`}>
                      <Button className={`quiz-button ${showButtonId === quiz._id ? 'show' : ''}`} variant="primary">Play</Button>
                    </Link>
                    <Button className={`quiz-button ${showButtonId === quiz._id ? 'show' : ''}`} variant="primary" onClick={() => handleCopyClick(quiz._id)}>Copy</Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default QuizListPublic;
