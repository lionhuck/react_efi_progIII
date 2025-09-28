import { Fragment } from "react";
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { PlatosContext } from "../../context/PlatosContext";


const PlatosForm = () => {
    const { platos, setPlatos, editingPlato, setEditingPlato, loading, setLoading, lazy, setLazy, getPlatos, createPlato, deletePlato, editPlato } = useContext(PlatosContext);
    const navigate = useNavigate();

    const initialValues = {
        nombre: editingPlato?.nombre || '',
        precio:  editingPlato?.precio || '',
        descripcion:  editingPlato?.descripcion || '',
    
    } 

    const validationSchema = Yup.object().shape({
        nombre: Yup.string().required('El nombre es requerido'),
        precio: Yup.number().required('El precio es requerido'),
        descripcion: Yup.string().required('La descripcion es requerida'),
    });

    const handleSubmit = async (values) => { 
        try { 
            if (editingPlato) { 
                await editPlato(values); 
                setEditingPleditingPlato(null); // Resetear el plato en edición 
            } else { 
                await createPlato(values); 
            } navigate('/platos'); // Redirigir a la lista de platos después de crear o editar 
        } catch (error) { 
            console.error("Error al crear o editar el plato:", error); 
        }
    };
}    