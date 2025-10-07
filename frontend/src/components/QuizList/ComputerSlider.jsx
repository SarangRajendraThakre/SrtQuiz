import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { FaPlay, FaCopy, FaEdit } from 'react-icons/fa';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './QuizList.css'; // Your custom CSS file
import { baseUrl1 } from "../../utils/services";

const ComputerSlider = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copyingId, setCopyingId] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('User'));

    useEffect(() => {
        const fetchComputerQuizzes = async () => {
            setLoading(true);
            try {
                // FIX 1: Fetch ONLY public Computer quizzes in one efficient call.
                const response = await axios.get(`${baseUrl1}/api/quizzes/public?category=Computer`);
                setQuizzes(response.data.quizzes || []);
            } catch (error) {
                console.error('Error fetching Computer quizzes:', error);
            } finally {
                setLoading(false);
            }
        };
        // FIX 2: The slow loop to fetch creator names is no longer needed.
        fetchComputerQuizzes();
    }, []);

    // FIX 3: Use the single, efficient backend endpoint for copying.
    const handleCopyClick = async (quizId) => {
        setCopyingId(quizId);
        if (!user || !user._id) {
            navigate('/login');
            return;
        }
        try {
            const response = await axios.post(`${baseUrl1}/api/quizzes/${quizId}/copy`, { userId: user._id });
            navigate(`/createquiz/${response.data.newQuizId}`);
        } catch (err) {
            console.error('Error copying quiz:', err);
            alert('Failed to copy quiz.');
        } finally {
            setCopyingId(null);
        }
    };
    
    const handleEditClick = (quizId) => {
        navigate(`/createquiz/${quizId}`);
    };

    const sliderSettings = {
        dots: false,
        infinite: quizzes.length > 4,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 3 } },
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } },
        ],
    };

    const SkeletonCard = () => (
        <div className="quiz-card-wrapper">
            <div className="skeleton-card"></div>
        </div>
    );

    if (loading) {
        return (
            <div className="category-slider-container">
                <h2 className="category-slider-title">Computer Quizzes</h2>
                <Slider {...sliderSettings}>
                    {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                </Slider>
            </div>
        );
    }
    
    if (quizzes.length === 0) {
        return null;
    }

    return (
        <div className='category-slider-container'>
            <h2 className='category-slider-title'>Computer Quizzes</h2>
            <Slider {...sliderSettings}>
                {quizzes.map((quiz) => (
                    <div key={quiz._id} className='quiz-card-wrapper'>
                        <div className='quiz-card'>
                            <div className='quiz-card-image-container'>
                                <img src={`${quiz.posterImg}`} alt={quiz.title} className='quiz-card-image' />
                                <div className="quiz-card-overlay">
                                    <div className="overlay-buttons">
                                        {user && quiz.createdBy?._id === user._id ? (
                                            <Button variant="light" className="overlay-button" onClick={() => handleEditClick(quiz._id)}>
                                                <FaEdit className="me-2" /> Edit
                                            </Button>
                                        ) : (
                                            <Button variant="light" className="overlay-button" disabled={copyingId === quiz._id} onClick={() => handleCopyClick(quiz._id)}>
                                                {copyingId === quiz._id ? <Spinner as="span" animation="border" size="sm" /> : <FaCopy className="me-2" />}
                                                {copyingId === quiz._id ? ' Copying' : ' Copy'}
                                            </Button>
                                        )}
                                        <Link to={`/takequiz/${quiz._id}`} className="flex-grow-1">
                                            <Button variant="primary" className="overlay-button play-button">
                                                <FaPlay className="me-2" /> Play
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className='quiz-card-body'>
                                <h3 className='quiz-card-title'>{quiz.title}</h3>
                                <p className='quiz-card-info'>By: {quiz.createdBy?.name || 'Unknown'}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ComputerSlider;