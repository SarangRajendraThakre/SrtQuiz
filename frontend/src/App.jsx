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

const App = () => {
  const { user } = useContext(AuthContext);

  console.error = (message) => {
    if (message.startsWith("Warning: A component is `contentEditable`")) {
      // Suppress the specific warning
      return;
    }
    // Log other errors or warnings
    console.warn(message);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/createquiz" element={<Createquiz />} />
        <Route path="/quiz" element={<QuizList />} />
        <Route path="/mtp" element={<Machingthepairs />} />

        <Route path="/takequiz" element={<Takequiz />} />
        <Route path="/takequiz/:quizId" element={<Takequiz />} />
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
