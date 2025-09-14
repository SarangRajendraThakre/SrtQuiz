import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Slider from 'react-slick'; // Import react-slick
import 'slick-carousel/slick/slick.css'; // Import slick carousel styles
import 'slick-carousel/slick/slick-theme.css'; // Import slick carousel theme styles
import './QuizList.css'; // Assuming you have this CSS file for styling
import { baseUrl1 } from "../../utils/services"; // Your base URL for API calls

const BiologySlider = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showButtonId, setShowButtonId] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  // Fetch Biology quizzes on component mount
  useEffect(() => {
    const fetchBiologyQuizzes = async () => {
      try {
        // The backend `getAllQuizzes` should be modified to:
        // 1. Filter by category 'Biology' and visibility 'public'.
        // 2. Populate the 'createdBy' field to include the user's 'name'.
        const response = await axios.get(`${baseUrl1}/api/quizzes/all`); // This endpoint should return only public Biology quizzes
        setQuizzes(response.data.quizzes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Biology quizzes:', error);
        setLoading(false); // Ensure loading state is reset even on error
      }
    };

    fetchBiologyQuizzes();
  }, []); // Empty dependency array means this effect runs once on mount

  // React-slick slider settings
  const settings = {
    dots: false, // Do not show dots at the bottom
    infinite: true, // Loop the carousel
    speed: 500, // Transition speed in milliseconds
    slidesToShow: 3, // Number of slides to display at once
    slidesToScroll: 1, // Number of slides to scroll when navigating
    autoplay: true, // Enable automatic sliding
    autoplaySpeed: 3000, // Interval for automatic sliding (in milliseconds)
    responsive: [ // Responsive settings for different screen sizes
      {
        breakpoint: 768, // For screens smaller than 768px
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576, // For screens smaller than 576px
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Handler for card clicks to show/hide action buttons
  const handleCardClick = (quizId) => {
    // Toggle the button visibility: if it's already shown, hide it; otherwise, show it.
    setShowButtonId(prevId => prevId === quizId ? null : quizId);
  };

  // Handler for copying a quiz
  const handleCopyClick = async (quizId) => {
    try {
      // Fetch the original quiz data
      const response = await axios.get(`${baseUrl1}/api/quizzes/quiz/${quizId}`);
      const originalQuiz = response.data.quiz;

      // Get current user details from local storage
      const user = JSON.parse(localStorage.getItem('User'));
      if (!user || !user._id) {
        console.error("User ID not found in local storage or user object is invalid. Cannot copy quiz.");
        // Optionally, show a toast notification or redirect to login
        return;
      }

      // Prepare new quiz data for copying
      const newQuizData = {
        ...originalQuiz, // Copy all fields from the original quiz
        _id: undefined, // Let MongoDB generate a new _id for the copy
        createdBy: user._id, // Assign the current user as the creator of the copy
        title: `${originalQuiz.title} (Copy)`, // Append "(Copy)" to the title
        questions: [] // Initialize questions as empty for the new quiz creation endpoint
      };

      // Create the new quiz entry in the database
      const newQuizResponse = await axios.post(`${baseUrl1}/api/quizzes`, newQuizData);
      const newQuiz = newQuizResponse.data;
      const newquizid = newQuiz._id;

      // Iterate through original quiz questions and add them to the new quiz
      for (const question of originalQuiz.questions) {
        try {
          const { questionText, options, correctAnswers, questionType, imagePath, explanation } = question; // Destructure all relevant question fields

          await axios.post(`${baseUrl1}/api/add-questionss`, { // Use the endpoint for adding multiple questions/single question with detailed payload
            quizId: newquizid,
            question: {
              questionText,
              options,
              correctAnswers,
              questionType,
              imagePath,
              explanation // Include explanation
            }
          });
        } catch (error) {
          console.error('Error adding question during quiz copy:', error);
          // Continue to next question even if one fails
        }
      }

      // Navigate to the create quiz page for the newly copied quiz
      navigate(`/createquiz/${newquizid}`);
    } catch (error) {
      console.error('Error creating copy of quiz:', error);
      // Handle error, e.g., show an error message to the user
    }
  };

  // Handler for editing a quiz
  const handleEditClick = (quizId) => {
    localStorage.setItem('createdQuizId', quizId); // Store quizId in local storage (might be used by CreateQuiz component)
    navigate(`/createquiz/${quizId}`); // Navigate to the quiz creation/edit page
  };

  // Get current user from local storage for conditional rendering of buttons
  const user = JSON.parse(localStorage.getItem('User'));

  return (
    <div className='mt-48 p-4'>
      <h1 className='font-semibold text-3xl mb-4'>Biology Quizzes</h1>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Slider {...settings}>
          {quizzes.length === 0 ? (
            <div className="text-center text-gray-500 py-5">No Biology quizzes available at the moment.</div>
          ) : (
            quizzes.map((quiz) => (
              // Each slide needs a div wrapper for react-slick to apply its styling correctly
              <div key={quiz._id} className="slider-card-container px-2"> {/* Added px-2 for spacing between cards */}
                <Card className='h-100 shadow-sm' onClick={() => handleCardClick(quiz._id)} style={{ cursor: 'pointer' }}>
                  {/* Conditionally render image if available */}
                  {quiz.posterImg && (
                    <Card.Img
                      variant="top"
                      src={`${baseUrl1}${quiz.posterImg}`}
                      alt={quiz.title}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className='text-xl font-bold mb-2'>{quiz.title}</Card.Title>
                    {/* Display creator name from populated 'createdBy' field */}
                    <p className="text-sm text-gray-600 mb-1">
                      Created By: {quiz.createdBy ? quiz.createdBy.name : 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Questions: {quiz.questions ? quiz.questions.length : 0}
                    </p>
                    <div className='bottombuttons mt-auto d-flex justify-content-around'>
                      {/* Show Edit button if current user is the creator, otherwise show Copy button */}
                      {user && quiz.createdBy && quiz.createdBy._id === user._id ? (
                        <Button
                          className={`quiz-button ${showButtonId === quiz._id ? 'show' : ''} mr-2`}
                          variant="outline-primary"
                          onClick={(e) => { e.stopPropagation(); handleEditClick(quiz._id); }} // Stop propagation to prevent cardClick
                        >
                          Edit
                        </Button>
                      ) : (
                        <Button
                          className={`quiz-button ${showButtonId === quiz._id ? 'show' : ''} mr-2`}
                          variant="outline-secondary"
                          onClick={(e) => { e.stopPropagation(); handleCopyClick(quiz._id); }} // Stop propagation
                        >
                          Copy
                        </Button>
                      )}
                      {/* Always show Play button */}
                      <Link to={`/takequiz/${quiz._id}`} className="flex-grow-1"> {/* Use flex-grow-1 to make button fill space */}
                        <Button
                          className={`quiz-button ${showButtonId === quiz._id ? 'show' : ''}`}
                          variant="primary"
                          onClick={(e) => e.stopPropagation()} // Stop propagation
                          style={{width: '100%'}} // Ensure button takes full width within its flex item
                        >
                          Play
                        </Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))
          )}
        </Slider>
      )}
    </div>
  );
};

export default BiologySlider;