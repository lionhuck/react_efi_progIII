import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 30000
});

// Interceptor REQUEST → agrega token y valida vencimiento
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const { exp } = jwtDecode(token);
                // Si el token venció, lo borramos
                if (exp * 1000 <= Date.now()) {
                    localStorage.removeItem("token");
                } else {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (err) {
                console.error("Error decodificando token:", err);
                localStorage.removeItem("token");
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor RESPONSE → si el backend devuelve 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status
        if (status === 401) {
            localStorage.removeItem("token");
        }
        
        console.error("Error de la api", error?.response?.data || error.message)
        
        return Promise.reject(error?.response?.data || error.message);
    }
);

export default api;