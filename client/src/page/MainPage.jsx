import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import RecettePreview from "../components/RecettePreview";
import { Typography } from "@mui/material";
import axios from 'axios';

export default function MainPage() {
  const [recettes, setRecettes] = useState(null);
  const [randomRecipes, setRandomRecipes] = useState(null);
  const [randomRecipesFullData, setRandomRecipesFullData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleSearch = (search) => {
    setRecettes(search);
  };

  async function fetchRandomRecipes() {
    try {
      const response = await axios.get(`http://localhost:5000/fetchRandomRecipes`);
      const data = response.data;
      if (response.status === 200) {
        return data.randomRecipes;
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
        const randomRecipesData = await fetchRandomRecipes();
        setRandomRecipes(randomRecipesData);
        setDataLoaded(true);
        handleRecetteSuggestionsDetail(randomRecipesData);
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
    <div>
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
