import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import SignInForm from './components/SignInForm';
import RecettePreview from './components/RecettePreview';
import Recette from './components/Recette';
import RecettesSuggestions from './components/RecettesSuggestions';
import ChatbotModal from './components/ChatbotModal'; // Import the ChatbotModal component

function App() {
  const [activeComponent, setActiveComponent] = useState("search");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSetComponent = (component) => {
    setActiveComponent(component);
  };

  const recettePreviews = [];
  for (let i = 0; i < 7; i++) {
    recettePreviews.push(<RecettePreview key={i} />);
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <Header setActiveComponent={handleSetComponent} />
      {activeComponent === "search" && <SearchBar />}
      {activeComponent === "login" && <LoginForm />}
      {activeComponent === "signin" && <SignInForm />}
      {activeComponent === "recette" && <Recette />}
      <div className="recettes-preview-wrapper">
        {recettePreviews}
      </div>
      <RecettesSuggestions></RecettesSuggestions>
      <div className='chatbot-icon' onClick={openModal}>
        <img src="../src/assets/chatbot.svg" alt='chatbot'/>
      </div>
      <ChatbotModal isOpen={isModalOpen} onRequestClose={closeModal} />
    </div>
  );
}

export default App;
