// src/components/Room.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { baseUrl1 } from "../utils/services";

const socket = io(
  
  



  baseUrl1

);

const Room = ({ setRoomId, setQuiz }) => {
  const [rooms, setRooms] = useState([]);
  
  useEffect(() => {
    socket.on('room created', (roomId) => {
      setRooms((prevRooms) => [...prevRooms, roomId]);
    });

    socket.on('quiz ready', (title) => {
      alert(`Quiz "${title}" is ready!`);
    });
  }, []);

  const createRoom = () => {
    socket.emit('create room');
  };

  const joinRoom = (roomId) => {
    setRoomId(roomId);
    socket.emit('join room', roomId);
  };

  const hostQuiz = () => {
    const quiz = {
      title: "Sample Quiz",
      questions: [
        { question: "What is the capital of France?", options: ["Paris", "Berlin", "Madrid"], answer: "Paris" },
        { question: "What is 2 + 2?", options: ["3", "4", "5"], answer: "4" }
      ]
    };
    setQuiz(quiz);
    socket.emit('host quiz', rooms[0], quiz); // Assuming the first room is the one you created
  };

  return (
    <div>
      <h1>Available Rooms</h1>
      <button onClick={createRoom}>Create Room</button>
      <button onClick={hostQuiz}>Host Quiz</button>
      <ul>
        {rooms.map((roomId, index) => (
          <li key={index}>
            {roomId}
            <button onClick={() => joinRoom(roomId)}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Room;
