// pages/Home.jsx
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Home = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div>
            <div style={{ padding: "2rem" }}>
                <h1>Bienvenido {user?.nombre || "Usuario"}</h1>
                <p>Usá la barra de navegación para acceder a las secciones.</p>
            </div>
        </div>
    );
};

export default Home;
