import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import NavBar from "./components/NavBar";
import { AuthContext } from "./context/AuthContext";
import MainCompile from "./pages/MainCompile";
import QuizList from "./questiontype/QuizList";
import QuizIdfetched from "./questiontype/QuizIDfetched";
import Home from "./pages/Home";
import Button from "./pages/Button";

const App = () => {
  const { user } = useContext(AuthContext);

  console.error = (message) => {
    if (message.startsWith('Warning: A component is `contentEditable`')) {
      // Suppress the specific warning
      return;
    }
    // Log other errors or warnings
    console.warn(message);
  };
  
  return (

    <>
    
     
        <Routes> <Route
                path="/"
                element={user ? <MainCompile /> : <Navigate to="/login" />}
              />
              
          <Route path="/chat" element={<Chat/>} />
          
          <Route path="/quiz" element={<QuizList/>} />
          <Route path="/btn" element={<Button/>} />


          <Route path="/quizid" element={<QuizIdfetched/>} />
          <Route path="/home" element={<Home/>} />
          
        
          <Route path="/register" element={user ? <MainCompile /> : <Register />} />
          <Route path="/login" element={user ? <MainCompile /> : <Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    
    </>
  );
};

export default App;
