import MesasView from './MesasView';
import MesasForm from "./MesasForm";
import  {Routes, Route} from 'react-router-dom';


const MesasModule = () => {
    return (
        
            <Routes>
                <Route 
                    path="/mesas" 
                    element={
                        // <PrivateRoute>
                            <MesasView/>
                        // </PrivateRoute>
                    } 
                />

                <Route 
                    path="/mesas/crear" 
                    element={
                        // <PrivateRoute>
                            <MesasForm/>
                        // </PrivateRoute>
                    } 
                />

                <Route 
                    path="/mesas/editar/:id" 
                    element={
                        // <PrivateRoute>
                            <MesasForm />
                        // </PrivateRoute>
                    } 
                /> 
            </Routes>
    
    )
}

export default MesasModule