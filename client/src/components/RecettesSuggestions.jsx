import React, { useEffect, useState } from "react";
import axios from "axios";
import RecettePreview from "./RecettePreview";

const RecettesSuggestions = (props) => {
  const { suggestions } = props;
  const [randomRecipesFullData, setRandomRecipesFullData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recettesTitles = JSON.parse(suggestions).recettes;
        const response = await axios.post(
          "http://localhost:5000/fetchRecettesByTitle",
          { recettesTitles }
        );
        const jsonObject = response.data.recettesData;
        if (Array.isArray(jsonObject)) {
          setRandomRecipesFullData(jsonObject);
        } else {
          throw new Error("Invalid format: 'recettes' should be an array.");
        }
      } catch (error) {
        console.error("Error fetching recettes:", error.message);
      }
    };

    fetchData();
  }, [suggestions]);

  return (
    <div className="recettes-suggestions-wrapper">
      <div className="heroSubtitle">
        Nous pensons que vous aimerez aussi...
        <br />
      </div>
      {randomRecipesFullData.map((recette, index) => (
        <RecettePreview className="recette" key={index} recette={recette[0]} />
      ))}
    </div>
  );
};

export default RecettesSuggestions;
