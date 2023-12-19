import * as React from "react"
import axios from 'axios';


export default function searchBar({ onSubmit: onSubmit }) {

    const [searchPrompt, setSearchPrompt] = React.useState('');
    const [recettesTitles, setRecettesTitles] = React.useState([]);

    const handleInputChange = (e) => {
        setSearchPrompt(e.target.value);
    }

    const handleSearch = () => {
        axios.post('http://localhost:5000/fetchTitles', { searchPrompt })
            .then(response => {
                const jsonObject = response.data.assistantResponse;
                setRecettesTitles(jsonObject);
                handlePostSearch();
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handlePostSearch = React.useCallback(() => {
        axios.post('http://localhost:5000/fetchRecettesByTitle', { recettesTitles })
            .then(response => {
                const jsonObject = response.data.recettesData;
                onSubmit(jsonObject);
            })
     }, [recettesTitles]);


    return (
        <div className="searchbar-wrapper">
            <input className="input is-rounded searchbar" type="text" placeholder="Saisissez votre recherche..."
            value={searchPrompt} onChange={handleInputChange}></input>
            <button className="button is-rounded" onClick={handleSearch}>Soumettre</button>
        </div>
    )
}