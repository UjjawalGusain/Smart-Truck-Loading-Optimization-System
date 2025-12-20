import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/useUser.js";

const ProtectedRoute = ({ redirectTo = "/login" }) => {
    const { user, loading } = useUser();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to={redirectTo} replace />;
    }

    return user ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;
