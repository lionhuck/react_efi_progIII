import { useEffect, useState, useContext, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PedidosContext } from "../../context/PedidosContext";
import { MesasContext } from "../../context/MesasContext";
import { PlatosContext } from "../../context/PlatosContext";
import { AuthContext } from "../../context/AuthContext";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { notifySucces, notifyError } from "../../utils/Notifier";

const DetallePedidoView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        getPedidoById,
        changeEstado,
        changeMesa,
        updateDetalles,
        closePedido,
    } = useContext(PedidosContext);

    const { mesas } = useContext(MesasContext);
    const { platos } = useContext(PlatosContext);
    const { user } = useContext(AuthContext);

    const [pedido, setPedido] = useState(null);
    const [detalles, setDetalles] = useState([]);
    const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cargar el pedido desde el context
    useEffect(() => {
        const fetchPedido = async () => {
        setLoading(true);
        try {
            const data = await getPedidoById(id);
            if (data) {
            setPedido(data);
            setDetalles(data.DetallePedidos || []);
            setMesaSeleccionada(data.mesaId);
            }
        } catch (error) {
            notifyError("Error al cargar el pedido");
        } finally {
            setLoading(false);
        }
        };
        fetchPedido();
    }, [id]);

    if (loading) return <p>Cargando pedido...</p>;
    if (!pedido) return <p>No se encontró el pedido solicitado.</p>;

    // Cambiar mesa (solo mesero/admin)
    const handleChangeMesa = () => {
        confirmDialog({
        message: `¿Cambiar el pedido a la mesa ${mesaSeleccionada}?`,
        header: "Confirmar cambio de mesa",
        icon: "pi pi-refresh",
        acceptLabel: "Sí, cambiar",
        rejectLabel: "Cancelar",
        accept: async () => {
            const ok = await changeMesa(pedido.id, mesaSeleccionada);
            if (ok) {
            notifySucces("Mesa actualizada ✅");
            setPedido({ ...pedido, mesaId: mesaSeleccionada });
            }
        },
        });
    };

    // Actualizar platos y cantidades (solo mesero/admin)
    const handleUpdateDetalles = () => {
        confirmDialog({
        message: "¿Guardar los cambios en los platos?",
        header: "Confirmar actualización",
        icon: "pi pi-check-circle",
        acceptLabel: "Guardar",
        rejectLabel: "Cancelar",
        accept: async () => {
            const payload = detalles.map((d) => ({
            platoId: d.platoId,
            cantidad: d.cantidad,
            }));
            const ok = await updateDetalles(pedido.id, payload);
            if (ok) notifySucces("Detalles del pedido actualizados ✅");
        },
        });
    };

    // Cambiar estado del pedido (según flujo)
// Cambiar estado del pedido (según flujo)
const handleChangeEstado = () => {
    const nextEstado = {
        pendiente: "en preparación",
        "en preparación": "listo",
        listo: "servido",
        servido: "cuenta solicitada",
        "cuenta solicitada": "pagado",
    }[pedido.estado];

    if (!nextEstado) {
        notifyError("No hay un siguiente estado disponible");
        return;
    }

    // Mensajes personalizados según el estado
    const mensajes = {
        "en preparación": "¿Comenzar a preparar el pedido?",
        listo: "¿Marcar el pedido como listo para servir?",
        servido: "¿Confirmar que el pedido fue servido?",
        "cuenta solicitada": "¿El cliente solicitó la cuenta?",
        pagado: "¿Confirmar que el pedido fue pagado?",
    };

    confirmDialog({
        message: mensajes[nextEstado] || `¿Avanzar el pedido de "${pedido.estado}" a "${nextEstado}"?`,
        header: "Confirmar cambio de estado",
        icon: "pi pi-refresh",
        acceptLabel: "Sí, cambiar",
        rejectLabel: "Cancelar",
        accept: async () => {
        const ok = await changeEstado(pedido.id, nextEstado);
        if (ok) {
            notifySucces(`Estado cambiado a "${nextEstado}" ✅`);
            setPedido({ ...pedido, estado: nextEstado });
        }
        },
    });
    };
    // Cerrar pedido (solo cajero/admin)
    const handleClose = () => {
        confirmDialog({
        message: "¿Confirmar cobro y liberar mesa?",
        header: "Cerrar pedido",
        icon: "pi pi-dollar",
        acceptLabel: "Sí, cerrar",
        rejectLabel: "Cancelar",
        accept: async () => {
            const ok = await closePedido(pedido.id);
            if (ok) {
            notifySucces("Pedido cerrado y mesa liberada ✅");
            navigate("/pedidos");
            }
        },
        });
    };

    // Render del detalle
    return (
        <Fragment>
        <ConfirmDialog />

        <h2>Detalle del Pedido #{pedido.id}</h2>
        <p><strong>Estado actual:</strong> {pedido.estado}</p>
        <p><strong>Mesa actual:</strong> {pedido.mesaId}</p>
        <p><strong>Total:</strong> ${pedido.total}</p>

        {/* Cambiar mesa */}
        {(user?.rol === "mesero" || user?.rol === "admin") && (
            <div className="mt-3">
            <h4>Cambiar mesa</h4>
            <Dropdown
                value={mesaSeleccionada}
                options={mesas.map((m) => ({
                label: `Mesa ${m.numero} (${m.capacidad} pers.)`,
                value: m.id,
                disabled: !m.disponible && m.id !== pedido.mesaId,
                }))}
                onChange={(e) => setMesaSeleccionada(e.value)}
            />
            <Button
                label="Actualizar mesa"
                icon="pi pi-refresh"
                className="ml-2"
                onClick={handleChangeMesa}
                disabled={mesaSeleccionada === pedido.mesaId}
            />
            </div>
        )}

        {/* 🔹 Modificar platos */}
        {(user?.rol === "mesero" || user?.rol === "admin") &&
            pedido.estado === "pendiente" && (
            <div className="mt-4">
                <h4>Modificar platos</h4>
                {detalles.map((d, index) => (
                <div key={index} className="p-field p-grid align-items-center mb-2">
                    <Dropdown
                    value={d.platoId}
                    options={platos.map((p) => ({
                        label: p.nombre,
                        value: p.id,
                    }))}
                    onChange={(e) =>
                        setDetalles((prev) =>
                        prev.map((item, i) =>
                            i === index ? { ...item, platoId: e.value } : item
                        )
                        )
                    }
                    placeholder="Seleccionar plato"
                    />
                    <InputNumber
                    value={d.cantidad}
                    onValueChange={(e) =>
                        setDetalles((prev) =>
                        prev.map((item, i) =>
                            i === index ? { ...item, cantidad: e.value } : item
                        )
                        )
                    }
                    min={1}
                    max={20}
                    showButtons
                    buttonLayout="horizontal"
                    incrementButtonIcon="pi pi-plus"
                    decrementButtonIcon="pi pi-minus"
                    inputClassName="w-6rem"
                    />
                </div>
                ))}
                <Button
                label="Guardar cambios"
                icon="pi pi-save"
                className="mt-2"
                onClick={handleUpdateDetalles}
                />
            </div>
            )}

        {/* 🔹 Avanzar estado */}
        <div className="mt-4">
            <Button
            label="Avanzar estado"
            icon="pi pi-arrow-right"
            onClick={handleChangeEstado}
            disabled={["cerrado", "cancelado"].includes(pedido.estado)}
            />
        </div>

        {/* 🔹 Cerrar pedido (cajero o admin) */}
        {(user?.rol === "cajero" || user?.rol === "admin") &&
            ["pagado", "cancelado"].includes(pedido.estado) && (
            <div className="mt-3">
                <Button
                label="Cerrar pedido"
                icon="pi pi-lock"
                className="p-button-success"
                onClick={handleClose}
                />
            </div>
            )}

        <Button
            label="Volver al listado"
            icon="pi pi-arrow-left"
            className="p-button-secondary mt-4"
            onClick={() => navigate("/pedidos")}
        />
        </Fragment>
    );
};

export default DetallePedidoView;
