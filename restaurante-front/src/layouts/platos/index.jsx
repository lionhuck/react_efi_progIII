import PlatosView from "./PlatosView";
//import PlatosForm from "./PlatosForm";
import  {Routes, Route} from 'react-router-dom';


const PlatosModule = () => {
    return (
        
            <Routes>
                <Route 
                    path="/platos" 
                    element={
                        // <PrivateRoute>
                            <PlatosView/>
                        // </PrivateRoute>
                    } 
                />

                {/* <Route 
                    path="/platos/crear" 
                    element={
                        // <PrivateRoute>
                            <ProductForm/>
                        // </PrivateRoute>
                    } 
                />

                <Route 
                    path="/platos/editar/:id" 
                    element={
                        // <PrivateRoute>
                            <ProductForm />
                        // </PrivateRoute>
                    } 
                /> */}
            </Routes>
    
    )
}

export default PlatosModule