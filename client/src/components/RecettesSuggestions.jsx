import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RecettesSuggestions = (props) => {
    const { suggestions } = props;
    const [randomRecipesFullData, setRandomRecipesFullData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const recettesTitles = JSON.parse(suggestions).recettes;
                const response = await axios.post('http://localhost:5000/fetchRecettesByTitle', { recettesTitles });
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
        <div className='recettes-suggestions-wrapper'>
            <div className="heroSubtitle">
                Nous pensons que vous aimerez aussi...<br />
            </div>
            {randomRecipesFullData.map((recette, index) => (
                <div className="card recette-preview recette ml-4 mr-4 mt-4" key={index}>
                    <div className="card-image">
                        <figure className="image is-6by3">
                            <img src={recette[0].photo} alt="Placeholder image" style={{ height: "10rem" }} />
                        </figure>
                    </div>
                    <div className="card-content">
                        <div className="content">
                            <p className="title is-6">  {recette[0].titre}</p>
                            <br />
                            <div className="temps-preparation" style={{ "display": "flex", 'alignItems': 'center' }}>
                                <img src="../src/assets/lhorloge.png" style={{ width: "25px", 'marginRight': "4px" }} ></img>
                                {recette[0].tempspreparation} mins


                                <Link to={`/recetteDetails/${recette[0].id}`}>
                                    <button className="button is-small mt-2 ml-4">➕ Voir plus</button>
                                </Link>

                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecettesSuggestions;
