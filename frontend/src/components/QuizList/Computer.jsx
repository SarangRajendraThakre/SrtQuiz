import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Slider from 'react-slick'; // Import react-slick
import 'slick-carousel/slick/slick.css'; // Import slick carousel styles
import 'slick-carousel/slick/slick-theme.css'; // Import slick carousel theme styles
import './QuizList.css';
import { baseUrl1 } from "../../utils/services";

const Computer = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showButtonId, setShowButtonId] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchGuessQuizzes = async () => {
      try {
        const response = await axios.get(`${baseUrl1}/api/quizzes/all`);
        const guessQuizzes = response.data.quizzes.filter(quiz => quiz.category === 'Gk'&& quiz.visibility === 'public');
        await Promise.all(guessQuizzes.map(async (quiz) => {
          if (quiz.createdBy) {
            const creator = await axios.get(`${baseUrl1}/api/quizzes/${quiz.createdBy}`);
            quiz.creatorName = creator.data.name;
          }
        }));
        setQuizzes(guessQuizzes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching guess quizzes:', error);
      }
    };

    fetchGuessQuizzes();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll at once
    autoplay: true, // Enable automatic sliding
    autoplaySpeed: 3000, // Interval for automatic sliding (in milliseconds)
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
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
        console.error("User ID not found in local storage or user object is invalid");
        return;
      }

      const newQuizData = {
        ...originalQuiz,
        _id: undefined,
        createdBy: user._id,
        title: `${originalQuiz.title} (Copy)`,
      };

      const newQuizResponse = await axios.post(`${baseUrl1}/api/quizzes`, newQuizData);
      const newQuiz = newQuizResponse.data;
      const newquizid = newQuiz._id;

      for (const question of originalQuiz.questions) {
        try {
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
        } catch (error) {
          console.error('Error adding question:', error);
        }
      }

      navigate(`/createquiz/${newquizid}`);
    } catch (error) {
      console.error('Error creating copy of quiz:', error);
    }
  };

  const handleEditClick = (quizId) => {
    localStorage.setItem('createdQuizId', quizId);
    navigate(`/createquiz/${quizId}`);
  };

  const user = JSON.parse(localStorage.getItem('User'));

  return (
    <div className='mt-3 p-4'>
      <h1 className='font-semibold'>Computer Quizzes</h1>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <Slider {...settings}> {/* Use Slider component from react-slick */}
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="slider-card-container">
              <Card className='p-2' onClick={() => handleCardClick(quiz._id)}>
                <Card.Img variant="top" src={`${baseUrl1}${quiz.posterImg}`} style={{ height: '200px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title className='text-2xl'>{quiz.title}</Card.Title>
                  <p>Created By: {quiz.creatorName}</p>
                  <p>Number of Questions: {quiz.questions.length}</p>
                  <div className='bottombuttons'>
                    {quiz.createdBy === user._id ? (
                      <Button className={`quiz-button ${showButtonId === quiz._id ? 'show' : ''}`} variant="primary" onClick={() => handleEditClick(quiz._id)}>Edit</Button>
                    ) : (
                      <Button className={`quiz-button ${showButtonId === quiz._id ? 'show' : ''}`} variant="primary" onClick={() => handleCopyClick(quiz._id)}>Copy</Button>
                    )}
                    <Link to={`/takequiz/${quiz._id}`}>
                      <Button className={`quiz-button ${showButtonId === quiz._id ? 'show' : ''}`} variant="primary">Play</Button>
                    </Link>
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

export default Computer;
