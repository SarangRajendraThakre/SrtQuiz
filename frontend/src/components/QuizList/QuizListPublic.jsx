import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './QuizListPublic.css';
import { baseUrl1 } from "../../utils/services";
import { Spinner } from 'react-bootstrap';

// --- SVG Icons ---
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7.5 5.625v12.75a.75.75 0 001.21.625l10.5-6.375a.75.75 0 000-1.25l-10.5-6.375a.75.75 0 00-1.21.625z" /></svg>;
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3 3 0 013 3v1.5H18a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5h-12A1.5 1.5 0 014.5 18v-3.75a3 3 0 013-3h1.5V6.375a3 3 0 01-3-3h-.375A1.875 1.875 0 007.5 3.375zM12.75 6h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5z" /><path d="M10.5 10.5a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0v-8.25zM13.5 10.5a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0v-8.25z" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;


const QuizListPublic = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copyingId, setCopyingId] = useState(null);
    const navigate = useNavigate();

    // New state for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Updated fetch logic to handle pagination
    const fetchQuizzesByPage = async (page) => {
        const stateToUpdate = page === 1 ? setLoading : setIsLoadingMore;
        stateToUpdate(true);
        try {
            setError(null);
            const response = await axios.get(`${baseUrl1}/api/quizzes/public?page=${page}&limit=8`);
            const data = response.data;
            
            setQuizzes(prev => page === 1 ? data.quizzes : [...prev, ...data.quizzes]);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
        } catch (err) {
            console.error('Error fetching public quizzes:', err);
            setError('Could not load quizzes. Please try again later.');
        } finally {
            stateToUpdate(false);
        }
    };
    
    useEffect(() => {
        fetchQuizzesByPage(1); // Fetch initial page on component mount
    }, []);

    const handleLoadMore = () => {
        if (!isLoadingMore && currentPage < totalPages) {
            fetchQuizzesByPage(currentPage + 1);
        }
    };
    
    // **CRITICAL FIX:** Corrected copy function
    const handleCopyClick = async (quizId) => {
        setCopyingId(quizId);
        const user = JSON.parse(localStorage.getItem('User'));
        if (!user || !user._id) {
            navigate('/login');
            return;
        }
        try {
            const response = await axios.post(`${baseUrl1}/api/quizzes/${quizId}/copy`, { userId: user._id });
            navigate(`/createquiz/${response.data.newQuizId}`);
        } catch (err) {
            console.error('Error copying quiz:', err);
            alert('Failed to copy quiz. Please try again.');
        } finally {
            setCopyingId(null);
        }
    };

    const sliderSettings = {
        dots: true,
        infinite: false, // Must be false to handle "Load More" correctly
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 2,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 3 } },
            { breakpoint: 992, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1 } },
        ],
    };

    const SkeletonCard = () => (
        <div className="p-3">
            <div className="skeleton-card"></div>
        </div>
    );
    
    if (loading) {
        return (
             <div className='public-quiz-list-container'>
                <h2 className='public-quiz-list-title'>Featured Public Quizzes</h2>
                <Slider {...sliderSettings}>
                    {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                </Slider>
            </div>
        );
    }

    if (error) {
        return <div className="text-center p-10 text-red-500 font-semibold">{error}</div>;
    }

    if (quizzes.length === 0) {
        return <div className="text-center p-10 text-gray-500">No public quizzes found.</div>;
    }

    return (
        <div className='public-quiz-list-container'>
            <h2 className='public-quiz-list-title'>Featured Public Quizzes</h2>
            <Slider {...sliderSettings}>
                {quizzes.map((quiz) => (
                    <div key={quiz._id} className='p-3'>
                        <div className='quiz-card group'>
                            <div className='quiz-card-image-container'>
                                <img src={`${quiz.posterImg}`} alt={quiz.title} className='quiz-card-image' />
                                 <div className="quiz-card-overlay">
                                    <div className="overlay-buttons">
                                        <Link to={`/takequiz/${quiz._id}`} className="overlay-button play-button">
                                            <PlayIcon />
                                            <span>Play</span>
                                        </Link>
                                        <button onClick={() => handleCopyClick(quiz._id)} disabled={copyingId === quiz._id} className="overlay-button copy-button">
                                            {copyingId === quiz._id ? <SpinnerIcon /> : <CopyIcon />}
                                            <span>{copyingId === quiz._id ? 'Copying...' : 'Copy'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='quiz-card-body'>
                                <h3 className='quiz-card-title'>{quiz.title}</h3>
                                <p className='quiz-card-info'>By: {quiz.createdBy?.name || 'Unknown'}</p>
                                <p className='quiz-card-info'>Questions: {quiz.questions?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                ))}
                {/* "Load More" slide */}
                {currentPage < totalPages && (
                    <div className="p-3">
                        <div className="load-more-card" onClick={handleLoadMore}>
                            {isLoadingMore ? (
                                <Spinner animation="border" variant="light" />
                            ) : (
                                <span>Load More</span>
                            )}
                        </div>
                    </div>
                )}
            </Slider>
        </div>
    );
};

export default QuizListPublic;