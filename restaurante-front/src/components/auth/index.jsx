import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import EditProfile from "./EditProfile";
import ResetPassword from "./ResetPassword";
import ForgotPassword from "./ForgotPassword";
import PublicRoute from "../../components/PublicRoute";
import PrivateRoute from "../../components/PrivateRoute";
import { Routes, Route } from "react-router-dom";

const AuthModule = () => {
    return (
        <Routes>
            <Route
                path="login"
                element={
                    <PublicRoute>
                        <LoginForm />
                    </PublicRoute>
                }
            />
            <Route
                path="register"
                element={
                    <PublicRoute>
                        <RegisterForm />
                    </PublicRoute>
                }
            />
            <Route
                path="profile"
                element={
                    <PrivateRoute>
                        <EditProfile />
                    </PrivateRoute>
                }
            />
            <Route
                path="forgot-password"
                element={
                    <PublicRoute>
                        <ForgotPassword />
                    </PublicRoute>
                }
            />
            <Route
                path="reset-password/:id/:token"
                element={
                    <PublicRoute>
                        <ResetPassword />
                    </PublicRoute>
                }
            />
        </Routes>
    );
};

export default AuthModule;
