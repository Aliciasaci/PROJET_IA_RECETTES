import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import RecettesSuggestions from './RecettesSuggestions';

export default function Recette() {
  const { id } = useParams();
  const [recette, setRecette] = useState('');
  const [similarRecipes, setSimilarRecipes] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [listeCourses, setListeCourses] = useState('');
  const [accompagnements, setAccompagnements] = useState('');

  const parseInstructionsToList = (string) => {
    const items = string.split(/\s(?=\d\.)/);
    const listItems = items.map((item, index) => <li key={index}>{item}</li>);
    return <ul>{listItems}</ul>;
  }

  const parseIngredientsToList = (string) => {
    const items = string.split(",");
    const listItems = items.map((item, index) => <li key={index}>{item}</li>);
    return <ul>{listItems}</ul>;
  }

  const parseCoursesToList = (ingredients) => {
    let string = JSON.parse(ingredients).ingredients;
    const listItems = string.map((item, index) => <li key={index}>◯ {item}</li>);
    return <ul>{listItems}</ul>;
  };

  const parseAccompagnementToList = (accompagnements) => {
    let string = JSON.parse(accompagnements).accompagnements;
    const listItems = string.map((item, index) => <li key={index}>◯ {item}</li>);
    return <ul>{listItems}</ul>;
  };


  async function fetchRecipeDetails(recipeId) {
    try {
      const response = await axios.get(`http://localhost:5000/fetchRecetteById/${recipeId}`);
      const data = response.data;
      if (response.status === 200) {

        const similarRecipesTemp = await axios.get(`http://localhost:5000/fetchSimilarRecipes?titre=${data.recetteData.titre}`);
        setSimilarRecipes(similarRecipesTemp.data.similarRecipes);

        return data.recetteData;
      } else {
        throw new Error(data.message || "Erreur lors de la récupération des détails de la recette");
      }
    } catch (error) {
      console.error("Error fetching recipe details", error);
      throw error;
    }
  }

  async function handleSubmitGroceries() {
    axios.post('http://localhost:5000/groceries', { ingredients })
      .then(response => {
        setListeCourses(response.data.groceries);
      })
      .catch(error => {
        console.error(error);
      });
  }

  async function handleSubmitAccompagnement() {
    axios.post('http://localhost:5000/recettes/18/accompagnements/')
      .then(response => {
        console.log(response);
        setAccompagnements(response.data.accompagnements);
      })
      .catch(error => {
        console.error(error);
      });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const recipeData = await fetchRecipeDetails(id);
          setRecette(recipeData);
          setIngredients(recipeData.ingredients)
        }
      } catch (error) {
        console.error('Error fetching recipe details', error);
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
                <img src={recette.photo} alt={recette.titre} />
              </figure>
            </div>
            <div className="card-content pl-6 pr-6">
              <div className="media-content">
                <h1 className="title is-4">{recette.titre}</h1>
              </div>
            </div>

            <div className="content pl-6">
              <h2>Ingrédients :</h2>
              {parseIngredientsToList(recette.ingredients)}

              <h2>Instructions :</h2>
              {parseInstructionsToList(recette.instructions)}
            </div>
            <button className="ml-6 button is-rounded is-link is-outlined" onClick={handleSubmitGroceries} >liste de course</button>
            <button className="ml-2 button is-rounded is-link is-outlined" onClick={handleSubmitAccompagnement} >Accompagnement</button>

            {accompagnements && (
              <div className="content pl-6">
                {parseAccompagnementToList(accompagnements)}
              </div>
            )}
          </div>

        ) : (
          <p>Chargement en cours...</p>
        )}
      </div>
      {listeCourses && (
        <div className="card recette-detail liste-courses">
          <img id="orange-image" src='../src/assets/orange.png'></img>
          <img id="eggplant-image" src='../src/assets/eggplant.png'></img>
          <h2 className="title is-1 liste-courses-title">Liste de courses</h2>
          <div className='liste-courses'>
            {parseCoursesToList(listeCourses)}
          </div>

          <div className="shareon">
            <a className="facebook"></a>
            <a className="messenger" data-fb-app-id="APP ID"></a>
            <a className="twitter"></a>
            <a className="whatsapp" data-url="url"></a>
            <a className="email"></a>
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
