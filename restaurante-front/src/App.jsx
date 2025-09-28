import 'primereact/resources/themes/lara-dark-indigo/theme.css'; // Tema de PrimeReact
import 'primereact/resources/primereact.min.css';               // Estilos base
import 'primeicons/primeicons.css';
import './App.css';


import { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { TOAST_REF } from './utils/ToastRef';

import { AuthProvider } from './context/AuthContext';
// import AuthModule from './layouts/auth';

import { PlatosProvider } from './context/PlatosContext';
import PlatosModule from './layouts/platos';

function App() {
    return (
        <BrowserRouter>
            <Toast ref={TOAST_REF} position='top-right' />
            <AuthProvider>  
                <Fragment>

                {/* <MenuBar />
                <IndexModule /> */}

                {/* <AuthModule /> */}
            
                <PlatosProvider>
                    <PlatosModule />
                </PlatosProvider>

    
                </Fragment>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;