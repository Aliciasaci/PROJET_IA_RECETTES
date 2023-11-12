import { useLocation } from "react-router-dom";

export default function Recette() {
    const {state} = useLocation();
    const parseInstructionsToList = (string) => {
        const items = string.split(/\s(?=\d\.)/);
        const listItems = items.map((item) => <li>{item}</li>);
        return `<ol>${listItems}</ol>`;
    }

    const parseIngredientsToList = (string) => {
        const items = string.split(",");
        const listItems = items.map((item) => <li>{item}</li>);
        return `<ul>${listItems}</ul>`;
    }

    return (
        <div>
            <div class="card recette-detail">
                <div class="card-image">
                    <figure class="image is-5by3">
                        <img src={recette.photo} alt={recette.titre} />
                    </figure>
                </div>
                <div class="card-content pl-6 pr-6">
                    <div class="media-content">
                        <h1 class="title is-4">{recette.titre}</h1>
                    </div>
                </div>

                <div class="content pl-6">

                    <h2>Ingrédients :</h2>
                    {parseIngredientsToList(recette.ingredients)}

                    <h2>Instructions :</h2>
                    {parseInstructionsToList(recette.instructions)}
                </div>
            </div>
        </div>
    )
}