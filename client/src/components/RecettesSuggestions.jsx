import React from 'react';

const RecettesSuggestions = (props) => {

    const { suggestions } = props;
    
    const parseRecettes = (suggestions) => {
        try {
            const recettes = JSON.parse(suggestions).recettes;
            if (Array.isArray(recettes)) {
                return recettes.map((recette, index) => (

                    <div className="card recette-preview recette ml-4 mr-4" key={index}>
                        <div className="card-image">
                            <figure className="image is-6by3">
                                <img src="https://assets.afcdn.com/recipe/20211214/125831_w1024h768c1cx866cy866.jpg" alt="Placeholder image" />
                            </figure>
                        </div>
                        <div className="card-content">
                            <div className="content">
                                <p className="title is-6">  {recette.titre}</p>
                                <br />
                                <button className="button is-small mt-2">➕ Voir plus</button>
                            </div>
                        </div>
                    </div>
                ));
            } else {
                throw new Error("Invalid format: 'recettes' should be an array.");
            }
        } catch (error) {
            console.error("Error parsing suggestions:", error.message);
            return null;
        }
    }

    return (

        <div className='recettes-suggestions-wrapper'>
            <div className="heroSubtitle">
                Nous pensons que vous aimerez aussi...<br />
            </div>
            {parseRecettes(suggestions)}
        </div>
    );
};

export default RecettesSuggestions;
