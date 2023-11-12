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
            <SearchBar onSubmit={handleSearch} />
            <div className="recettes-preview-wrapper">
          {recettes && recettes.map((recette) => <RecettePreview className="recette" key={recette[0].id} recette={recette[0]} />)}
            </div>
        </div>
    )
}