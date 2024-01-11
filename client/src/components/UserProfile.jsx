import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const UserProfile = () => {
    return (
        <div>
            <h1>User Profile</h1>
            <Button variant="outlined" size="medium">
                <Link to="/me/favorites">Mes recettes favorites</Link>
            </Button>
        </div>
    )
}

export default UserProfile;