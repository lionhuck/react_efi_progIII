import { createContext, useState, useEffect } from "react";
//!USAR YUP CON NOTIFY DE UTLIS

//Ya no uso axios y uso el usersService
import usersService from "../services/usersService";


//creacion del context:
export const UserContext = createContext() // al context lo voy a importar en usersContainer.jsx


// el provider es el que va a envolver a los componentes que van a usar el context(toda la funcionalidad)
// al provider lo voy a importar en App.jsx
//children es lo que se va a renderizar dentro del provider, es una palabra reservada
export const UserProvider = ({ children }) => {
    const[users, setUsers]= useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const getUsers = async () => {
        setLoading(true);   
        try {
            const {data: response} = await usersService.list();
            setUsers(Array.isArray(response.data) ? response.data : []);
        }catch (error) {
            setError(error.message);
            console.error("axios GET error:", error);
        } finally {
            setLoading(false);
        }   
    }
    
    useEffect(() => {
        getUsers()
    }
    , [])
    
    //crear un usuario
    const createUser = async (newUser) => {
        setLoading(true);
        try {
            const {data: response} = await usersService.create(newUser);
            const created = Array.isArray(response.data) ? response.data[0] : response.data || response;
            setUsers(prev => Array.isArray(prev) ? [...prev, created] : [created]);
            return true;
        } catch (error) {
            setError(error.message);
            console.error("Axios POST error:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // editar un usuario
    const editUser = async (updated) => {
        setLoading(true);
        //if(!editingUser) return; // Si no hay un usuario en edición, no hacemos nada
        try {
            const id = editingUser.id;
            await usersService.update(id, updated);
            setUsers(prev =>
                prev.map(u => (u.id === id ? { ...updated, id } : u))
            )
            return true;
        } catch (error) { 
            setError(error.message);
            console.error("Axios PUT error:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };
    
    // eliminar un usuario
    const deleteUser = async (id) => {
        setLoading(true);
        try {
            await usersService.delete(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            return true;
        } catch (error) {
            setError(error.message);
            console.error("Axios DELETE error:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    //cambiar el rol



    return (
        <UserContext.Provider 
            value={{
                users, 
                getUsers, 
                createUser, 
                loading, 
                setLoading, 
                editUser, 
                error, 
                setError, 
                editingUser, 
                setEditingUser, 
                deleteUser
            }}
        >
            {children}
        </UserContext.Provider>
    );
}