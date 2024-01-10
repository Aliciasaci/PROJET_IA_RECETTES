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
    answer,
  } = useQuestion();

  if (questionLoading) {
    return (
      <Stack spacing={3}>
        <CircularProgress sx={{ alignSelf: "center" }} />
        <Typography align="center" variant="h4">
          Chargement
        </Typography>
        <Typography align="center">
          La réponse est en cours de chargement, merci de patienter quelques
          instants...
        </Typography>
      </Stack>
    );
  }

  if (questionError) {
    return (
      <Stack spacing={3}>
        <Typography align="center" variant="h4">
          Erreur
        </Typography>
        <Typography align="center">{questionError}</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3} component="form" onSubmit={sendQuestion}>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Chatbot Modal"
        style={{ display: "flex" }}
      >
        <span onClick={onRequestClose} style={{ cursor: "pointer" }}>
          ❌
        </span>
        {answer && <Typography>{answer}</Typography>}
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
          >
            Demander
          </Button>
        </div>
      </Modal>
    </Stack>
  );
}

export default ChatbotModal;
