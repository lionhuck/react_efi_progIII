import PedidosView from "./PedidosView";
import  {Routes, Route} from 'react-router-dom';


const PedidosModule = () => {
    return (
        
            <Routes>
                <Route 
                    path="/pedidos" 
                    element={
                        // <PrivateRoute>
                            <PedidosView/>
                        // </PrivateRoute>
                    } 
                />
            </Routes>
    
    )
}

export default PedidosModule