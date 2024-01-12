import * as React from "react";
import useAuth from "../hooks/useAuth";
import { usePreference } from "../hooks/usePreference";
import {
  Checkbox,
  Button,
  Snackbar,
  CircularProgress,
  Typography,
} from "@mui/material";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UserPreferences = () => {
  const { auth } = useAuth();
  const {
    currentPreference,
    setCurrentPreference,
    preferenceLoading,
    preferenceError,
    allPreferences,
  } = usePreference();
  const [deletedPreference, setDeletedPreference] = React.useState([]);
  const [open, setOpen] = React.useState(preferenceError[0] ? true : false);
  const [errMsg, setErrMsg] = React.useState(preferenceError[0]);

  const handleClose = () => {
    setOpen(false);
  };

  // sort the allpreferences array by categories
  const sortPreferences = (allPreferences) => {
    const categories = [];
    allPreferences.forEach((item) => {
      if (!categories.includes(item.categorie)) {
        categories.push(item.categorie);
      }
    });
    const sortedPreferences = categories.map((categorie) => {
      return allPreferences.filter((item) => item.categorie === categorie);
    });
    return sortedPreferences;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = auth.userId;
      const responseAdd = await axios.post(
        `http://localhost:5000/preferencesAlimentaires/`,
        { userId, preferencesId: currentPreference, autre: null }
      );

      const responseDelete = await axios.delete(
        `http://localhost:5000/preferencesAlimentaires/`,
        { data: { userId, preferencesId: deletedPreference } }
      );
      if (responseAdd.status === 200 && responseDelete.status === 200) {
        setOpen(true);
      } else {
        setErrMsg("Erreur lors de l'enregistrement de vos préférences else");
        setOpen(true);
      }
    } catch (error) {
      setErrMsg(
        "Erreur lors de l'enregistrement de vos préférences catch" + error
      );
      setOpen(true);
    }
  };

  const sortedPreferences = sortPreferences(allPreferences);

  const handleChange = React.useCallback((e) => {
    const preferenceId = parseInt(e.target.value);
    const isChecked = e.target.checked;
    if (isChecked) {
      setCurrentPreference((prevPreferences) => [
        ...prevPreferences,
        { preference_id: preferenceId },
      ]);
      if (deletedPreference.includes(preferenceId)) {
        setDeletedPreference((prevDeletedPreferences) =>
          prevDeletedPreferences.filter(
            (preference) => preference !== preferenceId
          )
        );
      }
    } else {
      setCurrentPreference((prevPreferences) =>
        prevPreferences.filter(
          (preference) => preference.preference_id !== preferenceId
        )
      );
      setDeletedPreference((prevDeletedPreferences) => [
        ...prevDeletedPreferences,
        preferenceId,
      ]);
    }
  }, []);

  if (preferenceLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      {auth && auth.userId && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity={errMsg ? "error" : "success"}
              sx={{ width: "100%" }}
            >
              {errMsg ? errMsg : "Vos changements ont bien été enregistrés !"}
            </Alert>
          </Snackbar>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            {
              // display all preferences by categories
              sortedPreferences.map((categorie, index) => {
                return (
                  <div key={index}>
                    <Typography variant="h6">
                      {categorie[0].categorie}
                    </Typography>
                    <ul>
                      {categorie.map((item, index) => {
                        return (
                          <li key={index}>
                            <Checkbox
                              id={item.id.toString()}
                              name={item.titre}
                              value={item.id}
                              checked={currentPreference.some(
                                (preference) =>
                                  preference.preference_id === item.id
                              )}
                              onChange={handleChange}
                              label={item.titre}
                              sx={{
                                color: "orangered",
                                "&.Mui-checked": {
                                  color: "orangered",
                                },
                              }}
                            />
                            <label htmlFor={item.id}>{item.titre}</label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })
            }
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ margin: "2rem", alignSelf: "flex-end" }}
          >
            {" "}
            Enregistrer{" "}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserPreferences;
