import { Fragment, useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { useNavigate } from "react-router-dom";

import { PedidosContext } from "../../context/PedidosContext";
import { MesasContext } from "../../context/MesasContext";
import { PlatosContext } from "../../context/PlatosContext";
import { AuthContext } from "../../context/AuthContext";

const PedidosForm = () => {
    const navigate = useNavigate();
    const { createPedido, loading } = useContext(PedidosContext);
    const { mesas, getMesas } = useContext(MesasContext);
    const { platos, getPlatos } = useContext(PlatosContext);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        getMesas?.();
        getPlatos?.();
    }, []);

    const mesasDisponibles = mesas?.filter((m) => m.disponible);
    const platosDisponibles = platos?.filter((p) => p.disponibilidad);

    // Valores iniciales del formulario
    const initialValues = {
        mesaId: "",
        meseroId: user?.id,
        detalles: [{ platoId: "", cantidad: 1 }],
    };

    // Validaciones
    const validationSchema = Yup.object({
        mesaId: Yup.number().required("Debe seleccionar una mesa"),
        detalles: Yup.array()
        .min(1, "Debe agregar al menos un plato")
        .of(
            Yup.object({
            platoId: Yup.number().required("Debe seleccionar un plato"),
            cantidad: Yup.number()
                .min(1, "Cantidad mínima 1")
                .required("Debe ingresar una cantidad"),
            })
        ),
    });

    // Calcular total
    const calcularTotal = (detalles) =>
        detalles.reduce((acc, item) => {
        const plato = platosDisponibles.find((p) => p.id === item.platoId);
        return acc + (plato?.precio || 0) * (item.cantidad || 0);
        }, 0);

    // Enviar formulario
    const handleSubmit = async (values) => {
        console.log("Payload:", values);
        const success = await createPedido(values);
        if (success) navigate("/pedidos");
    };

    return (
        <Fragment>
        <Card title="Crear nuevo pedido" className="p-4">
            <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
            >
            {({ values, setFieldValue }) => (
                <Form>
                {/* Seleccionar mesa */}
                <div className="mb-3">
                    <label>Mesa</label>
                    <Dropdown
                    value={values.mesaId}
                    options={mesasDisponibles.map((m) => ({
                        label: `Mesa ${m.numero} (capacidad ${m.capacidad})`,
                        value: m.id,
                    }))}
                    onChange={(e) => setFieldValue("mesaId", e.value)}
                    placeholder="Seleccionar mesa"
                    className="w-full"
                    />
                    <ErrorMessage
                    name="mesaId"
                    component="div"
                    className="error-message"
                    />
                </div>

                <Divider />
                <h3>Platos</h3>

                {/* Listado dinámico de platos */}
                {values.detalles.map((item, index) => (
                    <div key={index} className="flex align-items-center gap-2 mb-2">
                    <Dropdown
                        value={item.platoId}
                        options={platosDisponibles.map((p) => ({
                        label: `${p.nombre} ($${p.precio})`,
                        value: p.id,
                        }))}
                        onChange={(e) => {
                        const updated = [...values.detalles];
                        updated[index].platoId = e.value;
                        setFieldValue("detalles", updated);
                        }}
                        placeholder="Seleccionar plato"
                        className="w-6"
                    />
                    <InputNumber
                        value={item.cantidad}
                        onValueChange={(e) => {
                        const updated = [...values.detalles];
                        updated[index].cantidad = e.value || 1;
                        setFieldValue("detalles", updated);
                        }}
                        min={1}
                        showButtons
                        buttonLayout="horizontal"
                        className="w-3"
                    />
                    <Button
                        icon="pi pi-trash"
                        severity="danger"
                        type="button"
                        onClick={() =>
                        setFieldValue(
                            "detalles",
                            values.detalles.filter((_, i) => i !== index)
                        )
                        }
                    />
                    </div>
                ))}

                {/* Botón para agregar más platos */}
                <Button
                    type="button"
                    icon="pi pi-plus"
                    label="Agregar plato"
                    onClick={() =>
                    setFieldValue("detalles", [
                        ...values.detalles,
                        { platoId: "", cantidad: 1 },
                    ])
                    }
                    className="mb-3"
                />

                <ErrorMessage
                    name="detalles"
                    component="div"
                    className="error-message"
                />

                <Divider />
                <h4>Total: ${calcularTotal(values.detalles).toFixed(2)}</h4>

                {/* Botones finales */}
                <div className="mt-4 flex gap-2">
                    <Button
                    type="submit"
                    label="Crear pedido"
                    loading={loading}
                    disabled={loading}
                    />
                    <Button
                    type="button"
                    label="Cancelar"
                    severity="secondary"
                    onClick={() => navigate("/pedidos")}
                    />
                </div>
                </Form>
            )}
            </Formik>
        </Card>
        </Fragment>
    );
};

export default PedidosForm;
