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

export default function RecettePreview({ recette }) {
  const navigate = useNavigate();

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
        <IconButton
          aria-label="add to favorites"
          sx={{ borderRadius: "0" }}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <FavoriteBorderIcon />
          <Typography variant="subtitle1" sx={{ color: "rgba(0, 0, 0, 0.54)" }}>
            34
          </Typography>
        </IconButton>
      </CardActions>
    </Card>
  );
}
