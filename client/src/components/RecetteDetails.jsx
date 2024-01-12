import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import RecettesSuggestions from "./RecettesSuggestions";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import useAuth from "../hooks/useAuth";
import useFavorites from "../hooks/useFavorites";
import FavoriteIcon from "@mui/icons-material/Favorite";
import * as Shareon from "shareon";
import "shareon/css";
import Feedback from "./Feedback";
import RecetteRating from "./RecetteRating";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";

export default function Recette() {
  Shareon.init();

  const { id } = useParams();
  const [recette, setRecette] = useState("");
  const [similarRecipes, setSimilarRecipes] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [listeCourses, setListeCourses] = useState("");
  const [accompagnements, setAccompagnements] = useState("");
  const [imageGroceries, setImageGroceries] = useState("");
  const { auth } = useAuth();
  const { favorites, dispatch } = useFavorites();

  const isItemInFavorites = (recette) => {
    return favorites.some((item) => item.recette_id === recette);
  };

  const addToFavorites = async (recette) => {
    try {
      const userId = auth.userId;
      const response = await axios.post(
        `http://localhost:5000/recettes/${recette}/favorites`,
        { userId }
      );
      if (response.data && response.data.result) {
        dispatch({ type: "ADD_FAVORITE", payload: response.data.result });
      }
    } catch (error) {
      console.error("Error adding to favorites", error);
    }
  };

  const removeFromFavorites = (recette) => {
    try {
      const userId = auth.userId;
      axios.delete(
        `http://localhost:5000/delete/recettes/${recette}/favorites`,
        { data: { userId } }
      );
      dispatch({ type: "REMOVE_FAVORITE", payload: recette });
    } catch (error) {
      console.error("Error removing from favorites", error);
    }
  };

  const parseInstructionsToList = (string) => {
    const items = string.split(/\s(?=\d\.)/);
    const listItems = items.map((item, index) => (
      <li key={index}>
        <span className="intructions-numbers">{index + 1}</span>
        <br />
        {item.substr(2, item.length)}
      </li>
    ));
    return <ul>{listItems}</ul>;
  };

  const parseIngredientsToList = (string) => {
    const items = string.split(",");
    const listItems = items.map((item, index) => <li key={index}>{item}</li>);
    return <ul>{listItems}</ul>;
  };

  const parseCoursesToList = (ingredients) => {
    let string = JSON.parse(ingredients).ingredients;
    const listItems = string.map((item, index) => (
      <li key={index}>◯ {item}</li>
    ));
    return <ul>{listItems}</ul>;
  };

  const parseAccompagnementToList = (accompagnements) => {
    const accompagnementsObject = JSON.parse(accompagnements).accompagnements;

    const listItems = Object.values(accompagnementsObject).map(
      (value, index) => (
        <div key={index}>
          {Object.values(value).map((nestedValue, nestedIndex) => (
            <li key={nestedIndex}>{nestedValue}</li>
          ))}
        </div>
      )
    );

    return <ul>{listItems}</ul>;
  };

  async function fetchRecipeDetails(recipeId) {
    let response;
    try {
      if (!auth.userId) {
        response = await axios.get(
          `http://localhost:5000/fetchRecetteByIdBasic/${recipeId}`
        );
      } else {
        const userId = auth.userId;
        response = await axios.get(
          `http://localhost:5000/fetchRecetteById/${recipeId}/${userId}`
        );
      }
      const data = response.data;
      if (response.status === 200) {
        let similarRecipesTemp;
        if (!auth.userId) {
            similarRecipesTemp = await axios.get(
            `http://localhost:5000/fetchSimilarRecipesBasic?titre=${data.recetteData.titre}`
          );
          } else {
            const userId = auth.userId;
            similarRecipesTemp = await axios.get(
              `http://localhost:5000/fetchSimilarRecipes/${userId}?titre=${data.recetteData.titre}`
            );
        }
        setSimilarRecipes(similarRecipesTemp.data.similarRecipes);
        dispatch({ type: "ADD_ALL_FAVORITE", payload: similarRecipesTemp.favorites });

        return data;
      } else {
        throw new Error(
          data.message ||
            "Erreur lors de la récupération des détails de la recette"
        );
      }
    } catch (error) {
      console.error("Error fetching recipe details", error);
      throw error;
    }
  }

  async function handleSubmitGroceries() {
    axios
      .post("http://localhost:5000/groceries", { ingredients: ingredients })
      .then((response) => {
        setListeCourses(response.data.groceries);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function handleSubmitAccompagnement() {
    axios
      .post(`http://localhost:5000/recettes/${recette.id}/accompagnements/`)
      .then((response) => {
        setAccompagnements(response.data.accompagnements);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function getListeString() {
    return (
      "Liste des courses:\n" +
      JSON.parse(listeCourses).ingredients.toString().replaceAll(",", "\n")
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const recipeData = await fetchRecipeDetails(id);
          setRecette(recipeData.recetteData);
          setIngredients(recipeData.recetteData.ingredients);
          dispatch({ type: "ADD_ALL_FAVORITE", payload: recipeData.favorites });
        }
      } catch (error) {
        console.error("Error fetching recipe details", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div>
      <div>
        {recette ? (
          <div className="card recette-detail">
            <div className="card-image">
              <figure className="image is-5by3">
                <img
                  src={recette.photo}
                  style={{
                    objectFit: "contain",
                  }}
                  alt={recette.titre}
                />
              </figure>
            </div>
            <div className="card-content pl-6 pr-6">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="media-content">
                  <h1 className="title recette-title">{recette.titre}</h1>
                </div>
                {auth.userId ? (
                  isItemInFavorites(recette.id) ? (
                    <IconButton
                      aria-label="remove-from-favorites"
                      onClick={() => removeFromFavorites(recette.id)}
                      color="error"
                      variant="text"
                    >
                      <FavoriteIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      aria-label="add-to-favorites"
                      onClick={() => addToFavorites(recette.id)}
                      color="error"
                      variant="text"
                    >
                      <FavoriteBorderIcon />
                    </IconButton>
                  )
                ) : null}
              </div>
            </div>

            <div className="content pl-6 ingredients">
              <h2>
                <u>Ingrédients :</u>
              </h2>
              {parseIngredientsToList(recette.ingredients)}
            </div>

            <div className="content pl-6 instructions">
              <h2>
                <u>Instructions :</u>
              </h2>
              {parseInstructionsToList(recette.instructions)}
            </div>

            {accompagnements && (
              <div className="content pl-6 mt-4 accompagnements">
                <h2>
                  <u>Accompagnement :</u>
                </h2>

                {parseAccompagnementToList(accompagnements)}
              </div>
            )}

            <button
              className="ml-6 button is-rounded is-link is-outlined"
              onClick={handleSubmitGroceries}
            >
              Liste de course
            </button>
            <button
              className="ml-2 button is-rounded is-link is-outlined"
              onClick={handleSubmitAccompagnement}
            >
              Accompagnement
            </button>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Typography component="legend">Donnez votre avis : </Typography>
              <RecetteRating recette={recette.id} />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Feedback recette={recette.id} />
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "5rem",
            }}
          >
            <CircularProgress color="inherit" />
          </div>
        )}
      </div>
      {listeCourses && (
        <div
          className="card recette-detail liste-courses"
          id="liste-courses-div"
        >
          <img id="orange-image" src="../src/assets/orange.png"></img>
          <img id="eggplant-image" src="../src/assets/eggplant.png"></img>
          <h2 className="title is-1 liste-courses-title">Liste de courses</h2>
          <div className="liste-courses">
            {parseCoursesToList(listeCourses)}
          </div>

          <div className="shareon">
            <a className="copy-url" data-url={getListeString()}></a>
            <a className="whatsapp" data-url={getListeString()}></a>
            <a className="reddit" data-url={getListeString()}></a>
            <a className="pinterest" data-url={getListeString()}></a>
            <a className="viber" data-url={getListeString()}></a>
          </div>
        </div>
      )}
      <div>
        {similarRecipes && similarRecipes.length > 0 && (
          <RecettesSuggestions suggestions={similarRecipes} />
        )}
      </div>
    </div>
  );
}
