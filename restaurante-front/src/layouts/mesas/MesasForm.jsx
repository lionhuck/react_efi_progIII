import { Fragment, useContext } from "react";
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { MesasContext } from "../../context/MesasContext";

const MesasForm = () => {
    const { mesas, setMesas, editingMesa, setEditingMesa, loading, setLoading, lazy, setLazy, getMesas, createMesa, deleteMesa, editMesa } = useContext(MesasContext);
    const navigate = useNavigate();

    const initialValues = {
        numero: editingMesa?.numero || '',
        capacidad:  editingMesa?.capacidad || '',
        disponible:  editingMesa?.disponible ?? true,
    }

    const validationSchema = Yup.object({
        numero: Yup.number().required('El campo es requerido').positive('El campo debe ser mayor a 0'),
        capacidad: Yup.number().required('El campo es requerido').positive('El campo debe ser mayor a 0'),
        disponible: Yup.boolean(),
    });

    const handleSubmit = async (values) => { 
        try { 
            if (editingMesa) { 
                await editMesa(values); 
                setEditingMesa(null); // Resetear el plato en edición 
            } else { 
                await createMesa(values); 
            } 
            navigate('/mesas'); // Redirigir a la lista de platos luego de crear o editar 
        } catch (error) { 
            console.error("Error al crear o editar el plato:", error); 
        } 
    };

    return (
        <Fragment> 
            <div className="container mt-4" >
                <h1 className="mb-4"> {editingMesa ? 'Editar Mesa' : 'Crear Mesa'}</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <div className="mb-3">
                            <label htmlFor="numero" className="form-label">Número:</label>
                            <Field type="number" id="numero" name="numero" className="form-control" />
                            <ErrorMessage name="numero" component="div" className="error-message" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="capacidad" className="form-label">Capacidad:</label>
                            <Field type="number" id="capacidad" name="capacidad" className="form-control" />
                            <ErrorMessage name="capacidad" component="div" className="error-message" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="disponible" className="form-label">Disponible:</label>
                            <Field type="checkbox" id="disponible" name="disponible" />
                            <ErrorMessage name="disponible" component="div" className="error-message" />
                        </div>
                        <Button type="submit" label="Guardar" />
                        <Button type="button" label="Cancelar" onClick={() => navigate('/mesas')} />
                    </Form>
                </Formik>
            </div>
        </Fragment>
    )
}

export default MesasForm;