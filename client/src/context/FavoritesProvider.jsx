import { createContext, useReducer } from "react";

const FavoritesContext = createContext();

const favoriteReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ALL_FAVORITE':
            state = action.payload;
            return state;
        case 'ADD_FAVORITE':
            return [...state, action.payload];
        case 'REMOVE_FAVORITE':
            state = state.filter((item) => item.recette_id !== action.payload);
            return state;
        default:
            return state;
    }
}

export const FavoritesProvider = ({ children }) => {
    const [favorites, dispatch] = useReducer(favoriteReducer, []);

    return (
        <FavoritesContext.Provider value={{ favorites, dispatch }}>
            {children}
        </FavoritesContext.Provider>
    )
}

export default FavoritesContext;