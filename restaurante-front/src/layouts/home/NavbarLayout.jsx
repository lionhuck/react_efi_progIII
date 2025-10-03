// components/NavbarLayout.jsx
import { Link, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const NavbarLayout = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div>
            {/* Navbar */}
            <nav style={{ 
                display: "flex", 
                gap: "1rem", 
                padding: "1rem", 
                background: "#222", 
                color: "#fff" 
            }}>
                <Link to="/" style={{ color: "white" }}>Inicio</Link>
                <Link to="/platos" style={{ color: "white" }}>Platos</Link>
                <Link to="/mesas" style={{ color: "white" }}>Mesas</Link>
                <Link to="/pedidos" style={{ color: "white" }}>Pedidos</Link>
                <Link to="/profile" style={{ color: "white" }}>Perfil</Link>
                {user && (
                    <button 
                        onClick={logout} 
                        style={{ marginLeft: "1rem", background: "crimson", color: "white" }}
                    >
                        Cerrar sesión
                    </button>
                )}
            </nav>

            {/* Aquí se renderizan las páginas hijas */}
            <div style={{ padding: "2rem" }}>
                <Outlet />
            </div>
        </div>
    );
};

export default NavbarLayout;
