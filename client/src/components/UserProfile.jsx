import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import UserPreferences from "./UserPreferences";

const UserProfile = () => {
  return (
    <div>
      <h1>User Profile</h1>
      <Button variant="outlined" size="medium">
        <Link to="/me/favorites">Mes recettes favorites</Link>
      </Button>
      <UserPreferences />
    </div>
  );
};

export default UserProfile;
