import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { jwtDecode } from "jwt-decode";
import { notifyInfo, notifyError, notifySucces } from "../utils/Notifier";


export const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
    const [user,setUser] = useState(null)
    const navigate = useNavigate()

    const decodeUser = (token)=>{
        try {
            const decoded = jwtDecode(token)
            if(!decoded.exp || decoded.exp * 1000 < Date.now()){
                return null;
            }  
            console.log("decoded", decoded);
            
            return{
                id: decoded.user.id,
                nombre:decoded.user.nombre,
                email: decoded.user.email,
                rol: decoded.user.rol
            }
        } catch {
            return null
        }
    }    


    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(!token)return

        const userLogued = decodeUser(token)
        if(userLogued){
        setUser(userLogued)
        }else{
            localStorage.removeItem('token')
            setUser(null)
        }
    },[])


    
    const login = async (credentials)=>{
        try {
            const {data, status} = await authService.login(credentials)

            if(status === 200){
                const token = data?.token
                localStorage.setItem('token', token)
                const userLogued = decodeUser(token)
                notifySucces(data?.message)
                if(!userLogued){
                    localStorage.removeItem('token')
                    alert("Token invalido o esta expirado")
                    return
                }
                
                setUser(userLogued)
                navigate('/')
            }else{
                // alert('Las credenciales son erroneas')
                notifyError(data?.message)
            }
        } catch (error) {
            console.log(error);
            // alert("Hubo error al iniciar sesion")
            notifyError(error.message)
        }
    }

    const register = async (userData) =>{
        try {
            const {status, message} = await authService.register(userData)

            if(status === 201){
                alert("Usuario creado exitosamente")
                navigate('/inicio-sesion')
            }else{
                alert(message)
            }
        } catch (error) {
            alert("Hubo un error al registrar el usuario")
        }
    }

    const logout = () =>{
        setUser(null)
        localStorage.removeItem('token')
        navigate('/inicio-sesion')
    }

    const forgotPassword = async (email) =>{
        try {
            const {data} = await authService.forgotPassword(email)
            // alert("Revisa tu correo electronico")
            notifySucces(data?.message)
            return true;
        } catch (error) {
            console.error(error.response.data || error)
            return false
        }
    }

    const resetPassword = async (id, token, password) => {
        try {
            const bodyResetPassword = {
                id: Number(id),
                token,
                password
            }
            await authService.resetPassword(bodyResetPassword)
            alert("Contraseña actualizada con éxito")
            return true;
        } catch (error) {
            console.error("Hubo un error al actualizar la contraseña", error.response.data || response.message)
            return false;
        }
    }

    return(
        <AuthContext.Provider value={{user, setUser, register, login, logout, forgotPassword, resetPassword}}>
            {children}
        </AuthContext.Provider>
    )
}