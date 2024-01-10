import * as React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { CardActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useFavorites from "../hooks/useFavorites";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function RecettePreview({ recette }) {
  const navigate = useNavigate();
  const { favorites, dispatch } = useFavorites();
  const { auth } = useAuth();

  const isItemInFavorites = (recette) => {
    console.log("test favorites", recette, favorites, favorites.some((item) => item.recette_id === recette));
    return favorites.some((item) => item.recette_id === recette);
  }

  const addToFavorites = async (recette) => {
    try {
      const userId = auth.userId;
      const response = await axios.post(`http://localhost:5000/recettes/${recette}/favorites`, { userId });
      if (response.data && response.data.result) {
        dispatch({ type: "ADD_FAVORITE", payload: response.data.result });
      }
    } catch (error) {
      console.error("Error adding to favorites", error);
    }
  }

  const removeFromFavorites = (recette) => {
    try {
      const userId = auth.userId;
      axios.delete(`http://localhost:5000/delete/recettes/${recette}/favorites`, { data: { userId } });
      dispatch({ type: "REMOVE_FAVORITE", payload: recette });
    } catch (error) {
      console.error("Error removing from favorites", error);
    }
  }

  return (
    <Card
      sx={{
        width: "15rem",
        margin: "3rem 1rem",
        overflow: "visible",
        borderRadius: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        "&:hover": {
          boxShadow: "rgba(0, 0, 0, 0.10) 0px 20px 30px 0px",
          cursor: "pointer",
        },
      }}
      onClick={() =>
        navigate(`/recetteDetails/${recette.id}`, { state: recette })
      }
    >
      <CardMedia
        component="img"
        sx={{ height: "12rem", width: "80%" }}
        image={recette.photo}
        alt={recette.titre}
        className="recette-preview-img"
      />
      <CardContent sx={{ padding: "0" }}>
        <Typography
          variant="body1"
          sx={{
            padding: "0 2rem",
            fontWeight: "600",
          }}
        >
          {recette.titre}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "space-around" }}>
        { isItemInFavorites(recette.id) ? (
            <IconButton aria-label="remove-from-favorites" color="error" onClick={(event) => {
                event.stopPropagation();
                removeFromFavorites(recette.id)}} variant="text">
                <FavoriteIcon />
            </IconButton>
        ) : (
            <IconButton aria-label="add-to-favorites" onClick={(event) => {
                event.stopPropagation();
                addToFavorites(recette.id)}} color="error" variant="text">
                <FavoriteBorderIcon />
            </IconButton>
        
        )}
      </CardActions>
    </Card>
  );
}
