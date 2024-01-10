import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import MainPage from './page/MainPage';
import RecetteDetails from './components/RecetteDetails';
import RecettesSuggestions from './components/RecettesSuggestions';
import ChatbotModal from './components/ChatbotModal'; // Import the ChatbotModal component
import RequireAuth from './components/RequireAuth';
import UserProfile from './components/UserProfile';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route element={<RequireAuth />}>
            <Route path='/' element={<MainPage />} />          
            <Route path="/recetteDetails/:id" element={<RecetteDetails />} />
            <Route path='/me' element={<UserProfile />} />
          </Route>
        </Routes>
        <div className="chatbot-icon" onClick={openModal}>
          <img src="../src/assets/chatbot.svg" alt="chatbot" />
        </div>
        <ChatbotModal isOpen={isModalOpen} onRequestClose={closeModal} />
      </div>
    </Router>
  );
}

export default App;
