import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Removed 'Router'
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";

import { AuthContext } from "./context/AuthContext";
import Createquiz from "./pages/Createquiz";
import QuizList from "./components/QuizList/QuizListPrivate";

import Home from "./pages/Home";

import PracticeQuiz from './pages/PracticeQuiz.jsx'

// Assuming these are your core quiz components for live functionality
import JoinQuiz from './Socketfolder/JoinQuiz.jsx';
import QuizHost from './Socketfolder/QuizHost.jsx';
import TakeQuiz from './Socketfolder/TakeQuiz.jsx';



import Machingthepairs from "./questiontype/Matching.jsx"; // Is this a quiz type or a separate game?
import ForFun from "./pages/ForFun.jsx";
import ForEducation from "./pages/ForEduation.jsx";
import Formotivation from "./pages/Formotivation.jsx";

// You'll likely need a Leaderboard component too, let's add a placeholder route for it
import Leaderboard from './Socketfolder/Leaderboard.jsx'; // Assuming you put it in a 'components' folder


const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Routes>
        {/* Main Home Route - Protected */}
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
   
        <Route path="/" element={user ? <Home/> : <Navigate to="/login" />} />
      

        {/* Authentication Routes */}
        <Route path="/register" element={user ? <Home /> : <Register />} />
        <Route path="/login" element={user ? <Home /> : <Login />} />

        {/* Chat Route */}
        <Route path="/chat" element={<Chat />} />



        {/* Quiz Management Routes - Protected */}
        {/* Corrected: Redirect to login if not authenticated */}
        <Route path="/createquiz" element={user ? <Createquiz /> : <Navigate to="/login" />} />
        <Route path="/createquiz/:quizId" element={user ? <Createquiz /> : <Navigate to="/login" />} /> {/* Protected for editing */}
        <Route path="/quiz" element={<QuizList />} /> {/* Assuming QuizList can be public or handles its own auth */}

        {/* Socket-based Live Quiz Routes - Protected where appropriate */}
        <Route path="/host/:quizId" element={user ? <QuizHost /> : <Navigate to="/login" />} /> {/* Host must be logged in */}
        <Route path="/join" element={<JoinQuiz />} /> {/* Joining a quiz might be public, or you can add protection */}
        <Route path="/quiz/:quizId" element={user ? <TakeQuiz /> : <Navigate to="/login" />} /> {/* Player taking live quiz - Protected */}

        {/* Leaderboard Route */}
        <Route path="/leaderboard" element={<Leaderboard />} /> {/* Leaderboard might be public or protected */}

        <Route path="/takequiz/:quizId" element={user ? <PracticeQuiz />:<Navigate to="/login" />} />
        {/* Other Pages/Games - Apply protection as needed */}
        <Route path="/mtp" element={<Machingthepairs />} />
        <Route path="/fun" element={<ForFun />} />
        <Route path="/edu" element={<ForEducation />} />
        <Route path="/motivation" element={<Formotivation />} />

        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;