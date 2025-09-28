import { Fragment, useContext } from "react";
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
        disponibilidad:  editingPlato?.disponibilidad ?? true,
    
    } 

    const validationSchema = Yup.object().shape({
        nombre: Yup.string().required('El nombre es requerido'),
        precio: Yup.number().required('El precio es requerido').positive('El precio debe mayor a 0'),
        descripcion: Yup.string(),
        disponibilidad: Yup.boolean(),
    });

    const handleSubmit = async (values) => { 
        try { 
            if (editingPlato) { 
                await editPlato(values); 
                setEditingPlato(null); // Resetear el plato en edición 
            } else { 
                await createPlato(values); 
            } 
            navigate('/platos'); // Redirigir a la lista de platos después de crear o editar 
        } catch (error) { 
            console.error("Error al crear o editar el plato:", error); 
        }
    };


    return (
        <Fragment>
            <div className="container mt-4">
                <h1 className="mb-4">{editingPlato ? 'Editar plato' : 'Crear un nuevo plato' }
                </h1>
                <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                /* a onSubmit se le pasa la funcion para crear el plato */
                onSubmit={handleSubmit}
                /* enableReinitialize permite que el formulario se actualice cuando cambian los valores iniciales */
                enableReinitialize 

                >
                    <Form > 
                        <div>
                            <label htmlFor="nombre" >Nombre</label>
                            <Field name="nombre" type="text" id="nombre"/>
                            <ErrorMessage className="error-message"  name="nombre" component="div" />
                        </div>
                        <div>
                            <label htmlFor="precio">Precio</label>
                            <Field name="precio" type="number" id="precio"/>
                            <ErrorMessage className="error-message"  name="precio" component='div' />
                        </div>
                        <div>
                            <label htmlFor="descripcion">Descripción</label>
                            <Field name="descripcion" type="text" id="descripcion"/>
                            <ErrorMessage className="error-message"  name="descripcion" component='div' />
                        </div>
                        <div>
                            <label htmlFor="disponibilidad">Disponibilidad</label>
                            <Field name="disponibilidad">
                                {({ field }) => (
                                    <input
                                    type="checkbox"
                                    id="disponibilidad"
                                    checked={field.value}
                                    {...field}
                                    />
                                )}
                            </Field>
                            <ErrorMessage className="error-message"  name="disponibilidad" component='div' />
                        </div>

                        {/* Boton de envio al ser tipo submit va usar la funcion onSubmit*/}
                        <Button 
                            label={editingPlato ? "Guardar cambios" : "Crear plato"} 
                            type="submit"
                            loading={loading}
                        >
                        </Button>
                        <Button
                            type="button"
                            label="Cancelar"
                            className="p-button-secondary"
                            onClick={() => {
                                setEditingPlato(null);
                                navigate("/platos");
                            }}
                        />
                            

                    </Form>

                </Formik>

            </div>
            
        </Fragment>
    );
};

export default PlatosForm;