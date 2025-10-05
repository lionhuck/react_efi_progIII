import PedidosView from "./PedidosView";
import DetallePedidoView from "./DetallePedidoView";
import PedidosForm from "./PedidosForm";
import { Routes, Route } from "react-router-dom";

const PedidosModule = () => {
    return (
        <Routes>
            <Route 
                path="" 
                element={<PedidosView />} 
            />

            <Route 
                path="detalle/:id" 
                element={<DetallePedidoView />} 
            />

            <Route 
                path="crear" 
                element={<PedidosForm />} 
            />
        </Routes>
    );
};

export default PedidosModule;
