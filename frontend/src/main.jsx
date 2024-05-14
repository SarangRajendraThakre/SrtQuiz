import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import { QuizContextProvider } from './context/QuizContext';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <QuizContextProvider>
          <App />
        </QuizContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
