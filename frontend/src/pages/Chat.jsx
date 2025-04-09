import React, { useEffect, useState } from "react";
import axios from "axios";

const Chat = () => {
  const [userId, setUserId] = useState(""); // State to store the user ID
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    // Fetch user ID from local storage
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    // Fetch quizzes created by the user
    const fetchUserQuizzes = async () => {
      try {
        if (userId) {
          const response = await axios.get(`/api/getquiz/${userId}`); // Check the URL here
          setQuizzes(response.data.quizzes);
        }
      } catch (error) {
        console.error("Error fetching user quizzes:", error);
      }
    };
    

    fetchUserQuizzes();
  }, [userId]);

  return (
    <div>
      <h2>Quizzes created by the user</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz._id}>{quiz.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
