import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import RecettePreview from "../components/RecettePreview";
import axios from "axios";
import useFavorites from "../hooks/useFavorites";
import useAuth from "../hooks/useAuth";
import { CircularProgress } from "@mui/material";

export default function MainPage() {
  const [recettes, setRecettes] = useState(null);
  const [randomRecipes, setRandomRecipes] = useState(null);
  const [randomRecipesFullData, setRandomRecipesFullData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { favorites, dispatch } = useFavorites();
  const { auth } = useAuth();
  const [calMin, setCalMin] = useState("");
  const [calMax, setCalMax] = useState("");

  const handleSearch = (search) => {
    setRecettes(search);
  };

  async function fetchRecettesParSaison() {
    try {
      const response = await axios.get(
        `http://localhost:5000/fetchRecettesPerSeason/`
      );
      const jsonObject = response.data.assistantResponse;
      handlePostSearch(jsonObject);

      //changer couleur btn
      document.querySelector(".btn-saison").style.backgroundColor = "orange";
      document.querySelector(".btn-saison").style.color = "white";
    } catch (error) {
      console.error("Error fetching seasonal recipes", error);
      throw error;
    }
  }

  async function fetchRecettesParCalories() {
    try {
      console.log("Valeur Cal Min:", calMin);
      console.log("Valeur Cal Max:", calMax);
      const response = await axios.get(
        `http://localhost:5000/fetchRecettesPerCalories/`,
        {
          params: {
            calMin: calMin,
            calMax: calMax,
          },
        }
      );
      const jsonObject = response.data.assistantResponse;
      handlePostSearchCalories(jsonObject);

      //changer couleur btn
      document.querySelector(".btn-calories").style.backgroundColor = "orange";
      document.querySelector(".btn-calories").style.color = "white";
    } catch (error) {
      console.error("Error fetching seasonal recipes", error);
      throw error;
    }
  }

  const handlePostSearchCalories = React.useCallback((recettesTitles) => {
    axios
      .post("http://localhost:5000/fetchRecettesByCalories", { recettesTitles })
      .then((response) => {
        const jsonObject = response.data.recettesData;
        setRecettes(jsonObject);
      });
  }, []);

  const handlePostSearch = React.useCallback((recettesTitles) => {
    axios
      .post("http://localhost:5000/fetchRecettesByTitle", { recettesTitles })
      .then((response) => {
        const jsonObject = response.data.recettesData;
        setRecettes(jsonObject);
      });
  }, []);

  async function fetchRandomRecipes() {
    let response;
    try {
      if (!auth.userId) {
        response = await axios.get(
          `http://localhost:5000/fetchRandomRecipesBasic`
        );
      } else {
        const userId = auth.userId;
        response = await axios.get(
          `http://localhost:5000/fetchRandomRecipes/${userId}`
        );
      }
      const data = response.data;
      if (response.status === 200) {
        return data;
      } else {
        throw new Error(data.message || "Erreur lors de la récupération");
      }
    } catch (error) {
      console.error("Error fetching recipes", error);
      throw error;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRandomRecipes();
        setRandomRecipes(data.randomRecipes);
        dispatch({ type: "ADD_ALL_FAVORITE", payload: data.favorites });
        setDataLoaded(true);
        handleRecetteSuggestionsDetail(data.randomRecipes);
      } catch (error) {
        console.error("Error fetching recipes", error);
      }
    };

    fetchData();
  }, []);

  const parseRandomRecipes = (randomRecipesFullData) => {
    try {
      return randomRecipesFullData.map((item, index) => (
        <RecettePreview className="recette" key={index} recette={item[0]} />
      ));
    } catch (error) {
      console.error(
        "Erreur lors de l'analyse des suggestions :",
        error.message
      );
      return null;
    }
  };

  const handleRecetteSuggestionsDetail = (randomRecipesData) => {
    const recettesTitles = JSON.parse(randomRecipesData).recettes;
    axios
      .post("http://localhost:5000/fetchRecettesByTitle", { recettesTitles })
      .then((response) => {
        const jsonObject = response.data.recettesData;
        setRandomRecipesFullData(jsonObject);
      });
  };

  return (
    <div className="heroBackground">
      <div className="heroTitle">Bienvenue sur CuisineConnect</div>
      <div className="heroSubtitle">
        Quelle recette simple et délicieuse allez-vous essayer aujourd'hui ?
      </div>
      <SearchBar onSubmit={handleSearch} />
      <div className="bonus">
        <div className="heroSubtitle">Je veux plutôt des recettes</div>
        <div className="bonus-buttons">
          <button
            className="button mr-2 btn-saison"
            onClick={fetchRecettesParSaison}
          >
            de saison
          </button>
          <div className="calories">
            <input
              className="input"
              type="text"
              placeholder="Cal min"
              value={calMin}
              onChange={(e) => setCalMin(e.target.value)}
            />
            <input
              className="input"
              type="text"
              placeholder="Cal max"
              value={calMax}
              onChange={(e) => setCalMax(e.target.value)}
            />
            <button
              className="button btn-calories"
              onClick={fetchRecettesParCalories}
            >
              Calories
            </button>
          </div>
        </div>
      </div>
      <div className="recettes-preview-wrapper">
        {recettes
          ? recettes.length > 0
            ? recettes.map((recette, index) => (
                <RecettePreview
                  className="recette"
                  key={index}
                  recette={recette[0]}
                />
              ))
            : null
          : null}
      </div>
      <div className="heroSubtitle">
        Envie de ? Venez nous le dire.
        <br />
      </div>
      {randomRecipesFullData ? (
        <div className="home-suggestion-cards-wrapper">
          {parseRandomRecipes(randomRecipesFullData)}
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
  );
}
