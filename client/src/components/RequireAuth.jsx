import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.email
            ? <Outlet />
            : <Navigate to="/signin" state={{ from: location }} replace />  // Redirect to the sign in page                                 
    )
}

export default RequireAuth;