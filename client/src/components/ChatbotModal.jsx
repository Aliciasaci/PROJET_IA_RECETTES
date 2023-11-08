import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); 

function ChatbotModal({ isOpen, onRequestClose }) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Chatbot Modal">
      <span onClick={onRequestClose}>❌</span>
      <input class="input is-rounded is-small" type="text" placeholder="Hii"/>
    </Modal>
  );
}

export default ChatbotModal;
