import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./QuizListPrivate.css";
import { baseUrl1 } from "../../utils/services";
import { useQuiz } from "../../context/QuizContext";

const QuizListPrivate = () => {
    const { updateCreatedQuizId } = useQuiz();
    const [quizzes, setQuizzes] = useState([]);
    const [error, setError] = useState(null);

    const userId = JSON.parse(localStorage.getItem("User"))?._id;
    const userName = JSON.parse(localStorage.getItem("User"))?.name;

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get(`${baseUrl1}/api/quizzes/${userId}`);
                setQuizzes(response.data.quizzes);
                setError(null);
            } catch (error) {
                setQuizzes([]);
                if (error.response && error.response.status === 404) {
                    setError({ message: "You haven't created any quizzes yet." });
                } else {
                    setError({ message: "An error occurred while fetching your quizzes." });
                    console.error("Error fetching quizzes:", error);
                }
            }
        };

        if (userId) fetchQuizzes();
    }, [userId]);

    // We no longer need handleCardClick or showButtonId if buttons show on image hover
    // The previous logic was tied to the entire card click, now it's image hover

    const handleEditClick = (quizId) => {
        localStorage.setItem("createdQuizId", quizId);
        updateCreatedQuizId(quizId);
    };

    return (
        <div className='quiz-list-container'>
            <h1 className="main-title">{userName ? `Quizzes Made by ${userName}`: 'My Quizzes'}</h1>

            {error && (
                <div className="error-message">{error.message}</div>
            )}

            {!error && (
                <Row xs={1} md={2} lg={4} className="g-4">
                    {quizzes.map((quiz) => (
                        <Col key={quiz._id}>
                            <Card className="quiz-card"> {/* No onClick here anymore */}
                                <div className="quiz-card-img-wrapper"> {/* NEW Wrapper for image and overlay */}
                                    <Card.Img
                                        variant="top"
                                        src={`${quiz.posterImg}`}
                                        className="quiz-card-img"
                                    />
                                    <div className="quiz-card-overlay"> {/* NEW Overlay */}
                                        <div className="quiz-card-overlay-buttons"> {/* NEW Buttons container in overlay */}
                                            <Link to={`/host/${quiz._id}`}>
                                                <Button className="quiz-button host-btn">
                                                    Host
                                                </Button>
                                            </Link>
                                            <Link to={`/createquiz/${quiz._id}`}>
                                                <Button className="quiz-button edit-btn" onClick={() => handleEditClick(quiz._id)}>
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Link to={`/takequiz/${quiz._id}`}>
                                                <Button className="quiz-button play-btn">
                                                    Play
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <Card.Body className="quiz-card-body">
                                    <Card.Title className="quiz-card-title">{quiz.title}</Card.Title>
                                    <p className="quiz-card-info">Questions: {quiz.questions.length}</p>
                                    {/* The old bottombuttons div is removed from here */}
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