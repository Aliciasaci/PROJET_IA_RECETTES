import React from "react";
import Modal from "react-modal";
import useQuestion from "../hooks/useQuestion";
import { CircularProgress, Stack, Typography, Button } from "@mui/material";

Modal.setAppElement("#root");

function ChatbotModal({ isOpen, onRequestClose }) {
  const {
    question,
    questionLoading,
    questionError,
    updateQuestion,
    sendQuestion,
    messages,
    setMessages,
  } = useQuestion();
  const messageEndRef = React.useRef(null);

  React.useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const questionLoadingFunc = () => {
    return (
      <Stack>
        <CircularProgress
          size="20px"
          style={{
            margin: "0.5rem 0 1rem",
            padding: "0.5rem 1rem",
            borderRadius: "1rem",
            border: "1px solid orangered",
          }}
        />
      </Stack>
    );
  };

  const questionErrorFunc = () => {
    return (
      <Stack>
        <Typography color={"orangered"}>Erreur:</Typography>
        <Typography color={"orangered"}>{questionError}</Typography>
      </Stack>
    );
  };

  const handleQuestion = (event) => {
    setMessages((prevMessages) => [...prevMessages, question]);
    sendQuestion(event);
  };

  const styleMessages = React.useCallback(() => {
    return messages.map((message, index) => {
      return index % 2 === 0 ? (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "0.5rem 0",
          }}
        >
          <Typography
            style={{
              backgroundColor: "orangered",
              color: "white",
              width: "fit-content",
              borderRadius: "1rem",
              padding: "0.5rem 1rem",
            }}
          >
            {message}
          </Typography>
        </div>
      ) : (
        <div
          key={index}
          style={{
            margin: "0.5rem 0",
            maxWidth: "75%",
          }}
        >
          <Typography
            style={{
              padding: "0.5rem 1rem",
              width: "fit-content",
              borderRadius: "1rem",
              border: "1px solid orangered",
            }}
          >
            {message}
          </Typography>
        </div>
      );
    });
  }, [messages]);

  return (
    <Stack spacing={3} component="form" onSubmit={handleQuestion}>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Chatbot Modal"
        style={{ display: "flex" }}
      >
        <span
          onClick={onRequestClose}
          style={{
            cursor: "pointer",
            alignSelf: "flex-end",
          }}
        >
          ❌
        </span>
        <div
          style={{
            margin: "2rem 0 1rem",
            height: "100%",
            overflowY: "auto",
          }}
        >
          {messages && styleMessages()}
          {questionLoading && questionLoadingFunc()}
          {questionError && questionErrorFunc()}
          <div ref={messageEndRef} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <input
            className="input is-rounded is-small"
            type="text"
            placeholder="Posez votre question ici..."
            onChange={updateQuestion}
            value={question}
          />
          <Button
            type="submit"
            style={{
              color: "orangered",
              padding: "0 1rem",
              marginBottom: "0.3rem",
            }}
            onClick={handleQuestion}
          >
            Demander
          </Button>
        </div>
      </Modal>
    </Stack>
  );
}

export default ChatbotModal;
