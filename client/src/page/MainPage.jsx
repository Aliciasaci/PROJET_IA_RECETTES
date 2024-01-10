import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import RecettePreview from "../components/RecettePreview";
import { Typography } from "@mui/material";
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import useFavorites from "../hooks/useFavorites";
import useAuth from "../hooks/useAuth";

export default function MainPage() {
  const [recettes, setRecettes] = useState(null);
  const [randomRecipes, setRandomRecipes] = useState(null);
  const [randomRecipesFullData, setRandomRecipesFullData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
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

  const handleSearch = (search) => {
    setRecettes(search);
  };

  async function fetchRandomRecipes() {
    try {
      const userId = auth.userId;
      const response = await axios.get(`http://localhost:5000/fetchRandomRecipes/${userId}`);
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
        console.error('Error fetching recipes', error);
      }
    };

    fetchData();
  }, []);


  const parseRandomRecipes = (randomRecipesFullData) => {
    try {
      return randomRecipesFullData.map((item, index) => (
        <div className="card recette-preview recette ml-4 mr-4" key={index}>
          <div className="card-image">
            <figure className="image is-6by3">
              <img src={item[0].photo} alt="Placeholder image" style={{ height: "10rem" }} />
            </figure>
          </div>
          <div className="card-content">
            <div className="content">
              <p className="title is-6" style={{"height": "27px"}}> {item[0].titre}</p>
              <div className="temps-preparation" style={{"display" : "flex", 'alignItems' : 'center'}}>
                <img src="src/assets/lhorloge.png" style={{ width: "25px", 'marginRight' : "4px"  }} ></img>
                {item[0].tempspreparation} mins
              </div>
              {/* { isItemInFavorites(item[0].id) ? (
                  <IconButton onClick={() => removeFromFavorites(item[0].id)} color="primary" variant="text">
                    <FavoriteBorderIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => addToFavorites(item[0].id)} color="tertiary" variant="text">
                    <FavoriteBorderIcon />
                  </IconButton>
                )
              } */}
            </div>
          </div>
        </div>
      ));
    } catch (error) {
      console.error("Erreur lors de l'analyse des suggestions :", error.message);
      return null;
    }
  };

  const handleRecetteSuggestionsDetail = (randomRecipesData) => {
    const recettesTitles = JSON.parse(randomRecipesData).recettes;
    axios.post('http://localhost:5000/fetchRecettesByTitle', { recettesTitles })
      .then(response => {
        const jsonObject = response.data.recettesData;
        setRandomRecipesFullData(jsonObject);
      })
  }

  return (
    <div className="heroBackground">
      <div className="heroTitle">
        Bienvenue sur CuisineConnect
      </div>
      <div className="heroSubtitle">
        Quelle recette simple et délicieuse allez-vous essayer aujourd'hui ?
      </div>
      <SearchBar onSubmit={handleSearch} />
      <div className="recettes-preview-wrapper">
        {recettes ? (
          recettes.length > 0 ? (
            recettes.map((recette) => (
              <RecettePreview
                className="recette"
                key={recette[0].id}
                recette={recette[0]}
                addToFavorites={addToFavorites}
                removeFromFavorites={removeFromFavorites}
                isItemInFavorites={isItemInFavorites}
              />
            ))
          ) : null
        ) : null}
      </div>
      <div className="heroSubtitle">
        Envie de ? <br />
      </div>
      {randomRecipesFullData ? (
        <div className="home-suggestion-cards-wrapper">
          {parseRandomRecipes(randomRecipesFullData)}
        </div>
      ) : null}
    </div>
  );
}
