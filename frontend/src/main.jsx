import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./index.css"
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext'; // Import your AuthContextProvider
import { QuizContextProvider } from './context/QuizContext'; // Import your QuizContextProvider

ReactDOM.render(
  <React.StrictMode>
    {/* Wrap your entire application with the context providers */}
    <BrowserRouter>
      <AuthContextProvider>
        <QuizContextProvider>
          <App />
        </QuizContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
