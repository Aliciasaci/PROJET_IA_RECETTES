import { useState } from "react"
import axios from 'axios';

export default function searchBar() {

    const [searchPrompt, setSearchPrompt] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const handleInputChange = (e) => {
        setSearchPrompt(e.target.value);
    }

    const handleSearch = () => {
        axios.post('http://localhost:5000/generate', { searchPrompt })
            .then(response => {
                const jsonObject = JSON.parse(response.data.assistantResponse);
                setSearchResult(jsonObject);
            })
            .catch(error => {
                console.error(error);
            });
    };


    return (
        <div className="searchbar-wrapper">
            <input className="input is-rounded searchbar" type="text" placeholder="Saisissez votre recherche..."
            value={searchPrompt} onChange={handleInputChange}></input>
            <button class="button is-rounded" onClick={handleSearch}>Soumettre</button>
        </div>
    )
}