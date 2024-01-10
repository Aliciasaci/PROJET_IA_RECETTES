import { useCallback, useState } from "react";
import axios from "axios";

export const useQuestion = () => {
  const [question, setQuestion] = useState("");
  const [questionLoading, setQuestionLoading] = useState(false);
  const [questionError, setQuestionError] = useState(null);
  const [messages, setMessages] = useState([]);

  const updateQuestion = useCallback((event) => {
    setQuestion(event.target.value);
  }, []);

  const sendQuestion = useCallback(
    async (event) => {
      event.preventDefault();
      const input = question;
      setQuestionLoading(true);
      setQuestionError(null);

      axios
        .post("http://localhost:5000/chatBot", {
          input,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          return response;
        })
        .then((data) => {
          setMessages((prevMessages) => [...prevMessages, data.data.response]);
        })
        .catch((error) => {
          if (error instanceof Error) {
            setQuestionError(error.message);
          } else {
            setQuestionError(String(error));
          }
        })
        .finally(() => {
          setQuestionLoading(false);
        });
      setQuestion("");
    },
    [question, messages]
  );

  return {
    question,
    questionLoading,
    questionError,
    updateQuestion,
    sendQuestion,
    messages,
    setMessages,
  };
};

export default useQuestion;
