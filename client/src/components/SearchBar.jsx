import * as React from "react";
import axios from "axios";

export default function searchBar({ onSubmit: onSubmit }) {
  const [searchPrompt, setSearchPrompt] = React.useState("");

  const handleInputChange = (e) => {
    setSearchPrompt(e.target.value);
  };

  const handleSearch = React.useCallback(() => {
    axios
      .post("http://localhost:5000/fetchTitles", { searchPrompt })
      .then((response) => {
        const jsonObject = response.data.assistantResponse;
        handlePostSearch(jsonObject);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [searchPrompt]);

  const handlePostSearch = React.useCallback((recettesTitles) => {
    axios
      .post("http://localhost:5000/fetchRecettesByTitle", { recettesTitles })
      .then((response) => {
        const jsonObject = response.data.recettesData;
        onSubmit(jsonObject);
      });
  }, []);

  return (
    <div className="searchbar-wrapper">
      <input
        className="input is-rounded searchbar"
        type="text"
        placeholder="Saisissez votre recherche..."
        value={searchPrompt}
        onChange={handleInputChange}
      ></input>
      <button className="button is-rounded soumettre" onClick={handleSearch}>
        Soumettre
      </button>
    </div>
  );
}
