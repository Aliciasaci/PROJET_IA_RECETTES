import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import RecettePreview from "../components/RecettePreview";
import { Typography } from "@mui/material";

export default function MainPage() {
  const [recettes, setRecettes] = useState(null);
  const handleSearch = (search) => {
    setRecettes(search);
  };

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
        Envie de ?<br />
      </div>
      <div className="home-suggestion-cards-wrapper">
        <div class="box">Nuggets</div>
        <div class="box">Burger</div>
        <div class="box">pizza</div>
        <div class="box">Woke</div>
      </div>
    </div>
  );
}
