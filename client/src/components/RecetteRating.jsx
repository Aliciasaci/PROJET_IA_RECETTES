import Rating from '@mui/material/Rating';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import useRating from '../hooks/useRating';
import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RecetteRating = ({ recette }) => {
    const { auth } = useAuth();
    const { rating, dispatchRating } = useRating();
    const [ value, setValue ] = useState(0);
    let initialRating = useRef(0);
    const location = useLocation();
    const navigate = useNavigate();

    const addRating = async (recette, newRating) => {
        try {
            if (!auth.userId) {
                navigate("/signin", { state: { from: location } });
            } else {
                const userId = auth.userId;
                const response = await axios.post(`http://localhost:5000/recettes/${recette}/rating`, { userId, newRating });
                if (response.data && response.data.result) {
                    dispatchRating({ type: "ADD_RATING", payload: response.data.result });
                    setValue(value+newRating);
                }
            }
            
        } catch (error) {
            console.error("Error adding to rating", error);
        }
    }

    const computeRating = (recette) => {
        let sum = 0;
        let count = 0;
        for (let i = 0; i < rating.length; i++) {
            if (rating[i].recette_id === recette) {
                for (let j = 0; j < rating[i].notes.length; j++) {
                    sum += rating[i].notes[j];
                    count++;
                }
            }
        }
        const avgRating = count ? sum / count : initialRating.current;
        return avgRating;
    }

   useEffect(() => {
        const fetchRating = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/recettes/${recette}/rating`);
                if (response.data && response.data.result && response.data.result.length > 0) {
                    initialRating.current = response.data.result[0].avg_note;
                    setValue(value+initialRating.current);
                } else {
                    setValue(value+initialRating.current);
                }
            } catch (error) {
                console.error("Error fetching rating", error);
                throw error;
            }
        }

        fetchRating();
   }, []);

    return (
        <div>
            <Rating
                name="simple-controlled"
                value={computeRating(recette)}
                precision={0.5}
                onChange={(event, newRating) => {addRating(recette, newRating)}}
                
            />
        </div>
    )
}

export default RecetteRating;