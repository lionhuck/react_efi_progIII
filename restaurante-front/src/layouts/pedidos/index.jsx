import PedidosView from "./PedidosView";
import { Routes, Route } from "react-router-dom";

const PedidosModule = () => {
    return (
        <Routes>
            <Route 
                path="" 
                element={<PedidosView />} 
            />
        </Routes>
    );
};

export default PedidosModule;
