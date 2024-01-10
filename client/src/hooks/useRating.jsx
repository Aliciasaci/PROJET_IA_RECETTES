import { useContext } from "react";
import RatingContext from "../context/RatingProvider";

const useRating = () => {
    return useContext(RatingContext);
}

export default useRating;