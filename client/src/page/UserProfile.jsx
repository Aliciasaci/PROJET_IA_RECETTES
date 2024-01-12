import UserPreferences from "../components/UserPreferences";
import useAuth from "../hooks/useAuth";
import UserFavorite from "../components/UserFavorite";
import { Typography } from "@mui/material";
import * as React from "react";

const UserProfile = () => {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = React.useState("favorites");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div>
      <Typography
        className="agbalumo"
        variant="h4"
        sx={{
          textAlign: "center",
          marginTop: "2rem",
          marginBottom: "2rem",
          fontFamily: "Agbalumo",
        }}
      >
        Bonjour {auth.prenom} !
      </Typography>
      <div className="tabs is-centered is-boxed">
        <ul>
          <li className={activeTab === "favorites" ? "is-active" : ""}>
            <a onClick={() => handleTabClick("favorites")}>
              <Typography
                variant="subtitle1"
                sx={{
                  textAlign: "center",
                  fontFamily: "Agbalumo",
                }}
              >
                Mes recettes favorites
              </Typography>
            </a>
          </li>
          <li className={activeTab === "preferences" ? "is-active" : ""}>
            <a onClick={() => handleTabClick("preferences")}>
              <Typography
                variant="subtitle1"
                sx={{
                  textAlign: "center",
                  fontFamily: "Agbalumo",
                }}
              >
                Mes préférences alimentaires
              </Typography>
            </a>
          </li>
        </ul>
      </div>
      {activeTab === "favorites" && <UserFavorite />}
      {activeTab === "preferences" && <UserPreferences />}
    </div>
  );
};

export default UserProfile;
