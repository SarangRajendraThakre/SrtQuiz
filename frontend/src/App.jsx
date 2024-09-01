import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";

import { AuthContext } from "./context/AuthContext";
import Createquiz from "./pages/Createquiz";
import QuizList from "./components/QuizList/QuizListPrivate";

import Home from "./pages/Home";

import Takequiz from "./pages/Takequiz";
import Machingthepairs from "./questiontype/Matching.jsx";

import ForFun from "./pages/ForFun.jsx";
import ForEducation from "./pages/ForEduation.jsx";
import Formotivation from "./pages/Formotivation.jsx";

const App = () => {
  const { user } = useContext(AuthContext);


  return (
    <>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/createquiz" element={user ? <Createquiz />:<Navigate to="/createquiz" />} />
        <Route path="/quiz" element={<QuizList />} />
        <Route path="/mtp" element={<Machingthepairs />} />
        <Route path="/fun" element={<ForFun />} />
        <Route path="/edu" element={<ForEducation />} />
        <Route path="/motivation" element={<Formotivation />} />
   

        <Route path="/takequiz" element={<Takequiz />} />
        <Route path="/takequiz/:quizId" element={user ? <Takequiz />:<Navigate to="/login" />} />
        <Route path="/createquiz/:quizId" element={<Createquiz />} />

        <Route path="/home" element={<Home />} />
     
        <Route path="/register" element={user ? <Home /> : <Register />} />
        <Route path="/login" element={user ? <Home /> : <Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
