import 'primereact/resources/themes/lara-dark-indigo/theme.css'; // Tema de PrimeReact
import 'primereact/resources/primereact.min.css';               // Estilos base
import 'primeicons/primeicons.css';
import './App.css';


import { Fragment } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toast } from 'primereact/toast';
import { TOAST_REF } from './utils/ToastRef';

import { AuthProvider } from './context/AuthContext';
// import AuthModule from './layouts/auth';

import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import EditProfile from "./components/auth/EditProfile";
import PrivateRoute from "./components/PrivateRoute";


import { PlatosProvider } from './context/PlatosContext';
import PlatosModule from './layouts/platos';

import { MesasProvider } from './context/MesasContext';
import MesasModule from './layouts/mesas';

import { PedidosProvider } from './context/PedidosContext';
import PedidosModule from './layouts/pedidos';

function App() {
    return (
        <BrowserRouter>
            <Toast ref={TOAST_REF} position="top-right" />
            <AuthProvider>  
                <Fragment>

                    {/* <MenuBar />
                    <IndexModule /> */}

                    {/* <AuthModule /> */}

                    {/* --- RUTAS PÚBLICAS / PRIVADAS --- */}
                    <Routes>
                        {/* RUTAS PÚBLICAS */}
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset/:id/:token" element={<ResetPassword />} />

                        {/* RUTA PRIVADA */}
                        <Route
                            path="/mi-perfil/editar"
                            element={
                                <PrivateRoute>
                                    <EditProfile />
                                </PrivateRoute>
                            }
                        />

                        {/* RUTAS DE MÓDULOS YA EXISTENTES */}
                        <Route
                            path="/platos/*"
                            element={
                                <PlatosProvider>
                                    <PlatosModule />
                                </PlatosProvider>
                            }
                        />
                        <Route
                            path="/mesas/*"
                            element={
                                <MesasProvider>
                                    <MesasModule />
                                </MesasProvider>
                            }
                        />
                        <Route
                            path="/pedidos/*"
                            element={
                                <PedidosProvider>
                                    <PedidosModule />
                                </PedidosProvider>
                            }
                        />

                        {/* Redirección por defecto */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>

                </Fragment>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;