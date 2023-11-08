import RecettePreview from "./RecettePreview";

export default function RecettesSuggestions() {
    // Nombre d'instances de RecettePreview à générer
    const numberOfPreviews = 5; // Par exemple, 7 prévisualisations

    const recettePreviews = [];

    for (let i = 0; i < numberOfPreviews; i++) {
        recettePreviews.push(<RecettePreview key={i} />);
    }

    return (
        <div className="recettes-suggestions">
            <div className="recettes-suggestions-wrapper">
                {recettePreviews}
            </div>
        </div>
    );
}
