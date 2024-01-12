import { useState, useEffect } from "react";
import axios from "axios";
import RecettePreview from "./RecettePreview";
import useAuth from "../hooks/useAuth";
import useFavorites from "../hooks/useFavorites";
import { Typography } from "@mui/material";

const UserFavorite = () => {
  const [favoriteRecettes, setFavoriteRecettes] = useState();
  const { auth } = useAuth();
  const { favorites, dispatch } = useFavorites();

  const removeFavorites = (recette) => {
    const indices = favoriteRecettes.reduce((acc, item, index) => {
      return acc.concat(item.id == recette ? index : []);
    }, []);
    indices.forEach((index) => {
      favoriteRecettes.splice(index, 1);
    });
  };

  useEffect(() => {
    const fetchFavoriteRecettes = async () => {
      const userId = auth.userId;
      const response = await axios.get(
        `http://localhost:5000/favoriteList/${userId}/`
      );
      setFavoriteRecettes(response.data.result);
      dispatch({ type: "ADD_ALL_FAVORITE", payload: response.data.favorites });
    };

    fetchFavoriteRecettes();
  }, []);

  return (
    <div>
      <div className="recettes-preview-wrapper">
        {favoriteRecettes
          ? favoriteRecettes.map((favoriteRecette, index) => (
              <RecettePreview
                className="recette"
                key={index}
                onRemove={removeFavorites}
                recette={favoriteRecette}
              />
            ))
          : null}
      </div>
    </div>
  );
};

export default UserFavorite;
