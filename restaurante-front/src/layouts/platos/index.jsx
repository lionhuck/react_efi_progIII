import PlatosView from "./PlatosView";
import PlatosForm from "./PlatosForm";
import PrivateRoute from "../../components/PrivateRoute";
import { Routes, Route } from "react-router-dom";

const PlatosModule = () => {
    return (
        <Routes>
            <Route 
                path="" 
                element={
                    <PrivateRoute>
                        <PlatosView />
                    </PrivateRoute>
                } 
            />
            <Route 
                path="crear" 
                element={
                    <PrivateRoute>
                        <PlatosForm />
                    </PrivateRoute>
                } 
            />
            <Route 
                path="editar/:id" 
                element={
                    <PrivateRoute>
                        <PlatosForm />
                    </PrivateRoute>
                } 
            />
        </Routes>
    );
};

export default PlatosModule;
