import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import useAuth from "./useAuth";

export const usePreference = () => {
  const [currentPreference, setCurrentPreference] = useState([]);
  const [preferenceLoading, setPreferenceLoading] = useState(false);
  const [preferenceError, setPreferenceError] = useState([]);
  const [allPreferences, setAllPreferences] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setPreferenceLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/preferencesAlimentaires"
        );
        const data = response.data.result;
        if (response.status === 200) {
          setAllPreferences(data);
          fetchUserPreference();
        } else {
          setPreferenceError([...preferenceError, error]);
        }
      } catch (error) {
        setPreferenceError([...preferenceError, error]);
      } finally {
        setPreferenceLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchUserPreference = useCallback(async () => {
    try {
      const userId = auth.userId;
      const response = await axios.get(
        `http://localhost:5000/preferencesAlimentaires/${userId}`
      );
      const data = response.data.result;
      if (response.status === 200) {
        setCurrentPreference(data);
      } else {
        setPreferenceError([...preferenceError, error]);
      }
    } catch (error) {
      setPreferenceError([...preferenceError, error]);
    }
  }, [auth.userId]);

  return {
    currentPreference,
    setCurrentPreference,
    preferenceLoading,
    preferenceError,
    allPreferences,
  };
};
