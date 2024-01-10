import { useCallback, useState } from "react";
import axios from "axios";

export const useQuestion = () => {
  const [question, setQuestion] = useState("");
  const [questionLoading, setQuestionLoading] = useState(false);
  const [questionError, setQuestionError] = useState(null);
  const [answer, setAnswer] = useState("");

  const updateQuestion = useCallback((event) => {
    setQuestion(event.target.value);
  }, []);

  const sendQuestion = useCallback(
    (event) => {
      event.preventDefault();
      setQuestionLoading(true);
      setQuestionError(null);

      axios
        .post("http://localhost:5000/chatBot", {
          question,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);

          return response.json();
        })
        .then((json) => {
          const validation = JSON.parse(json);

          return validation.data;
        })
        .then((data) => {
          setAnswer(data.response);
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
    },
    [question]
  );

  return {
    question,
    answer,
    questionLoading,
    questionError,
    updateQuestion,
    sendQuestion,
  };
};

export default useQuestion;
