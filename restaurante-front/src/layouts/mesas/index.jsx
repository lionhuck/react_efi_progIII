import MesasView from "./MesasView";
import MesasForm from "./MesasForm";
import { Routes, Route } from "react-router-dom";

const MesasModule = () => {
    return (
        <Routes>
            <Route 
                path="" 
                element={<MesasView />} 
            />
            <Route 
                path="crear" 
                element={<MesasForm />} 
            />
            <Route 
                path="editar/:id" 
                element={<MesasForm />} 
            />
        </Routes>
    );
};

export default MesasModule;
