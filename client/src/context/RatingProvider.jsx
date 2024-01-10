import { createContext, useReducer } from "react";

const RatingContext = createContext();

const ratingReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_RATING': {
            console.log("state 1", state, action.payload);
            let existed = false;
            for (let i = 0; i < state.length; i++) {
                if (state[i].recette_id === action.payload.recette_id) {
                    if (!state[i].notes) state[i].notes = [];
                    state[i].notes.push(action.payload.note);
                    existed = true;
                    break;
                }
            }
            if (!existed) {
                state.push({recette_id: action.payload.recette_id, notes: [action.payload.note]});
            }
            console.log("state 2", state);
            return state;
        }
        default:
            return state;
    }
}

export const RatingProvider = ({ children }) => {
    const [rating, dispatchRating] = useReducer(ratingReducer, []);

    return (
        <RatingContext.Provider value={{ rating, dispatchRating }}>
            {children}
        </RatingContext.Provider>
    )
}

export default RatingContext;