// components/PublicRoute.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    return !user ? children : <Navigate to="/" />;
};

export default PublicRoute;
