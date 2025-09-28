import { data } from "react-router-dom";
import api from "./api";
// import ResetPassword from "../auth/resetPassword";

const authService = {
    login: (credentials) => api.post("auth/login", credentials),
    register: (data) => api.post("auth/register", data),
    forgotPassword: (email) => api.post("auth/forgotPassword", {email}),
    // resetPassword: (data) => api.post("auth/reset-password", {data})
}

export default authService