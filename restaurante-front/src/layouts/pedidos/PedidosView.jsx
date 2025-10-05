import { Fragment, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { useNavigate } from "react-router-dom";

import { PedidosContext } from "../../context/PedidosContext";
import { AuthContext } from "../../context/AuthContext";

const PedidosView = () => {
    const {
        pedidos,
        loading,
        lazy,
        setLazy,
        cancelPedido,
        changeEstado,
        closePedido,
    } = useContext(PedidosContext);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Ver detalle del pedido
    const handleVer = (id) => navigate(`/pedidos/detalle/${id}`);

    // Cancelar pedido
    const handleCancel = (id) => {
        confirmDialog({
        message: "¿Está seguro que desea cancelar este pedido?",
        header: "Confirmación",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Sí, cancelar",
        rejectLabel: "Cancelar",
        accept: async () => await cancelPedido(id),
        });
    };

    // Cerrar pedido (solo admin/cajero)
    const handleClose = (id) => {
        confirmDialog({
        message: "¿Cerrar pedido y liberar mesa?",
        header: "Confirmación",
        icon: "pi pi-check-circle",
        acceptLabel: "Sí, cerrar",
        rejectLabel: "Cancelar",
        accept: async () => await closePedido(id),
        });
    };

    // Confirmar cambio de estado
    const handleChangeEstado = (pedido) => {
        const nextEstado = {
        pendiente: "en preparación",
        "en preparación": "listo",
        listo: "servido",
        servido: "cuenta solicitada",
        "cuenta solicitada": "pagado",
        }[pedido.estado];

        if (!nextEstado) return;

        confirmDialog({
        message: `¿Desea avanzar el pedido de "${pedido.estado}" a "${nextEstado}"?`,
        header: "Confirmar cambio de estado",
        icon: "pi pi-refresh",
        acceptLabel: "Sí, cambiar",
        rejectLabel: "Cancelar",
        accept: async () => await changeEstado(pedido.id, nextEstado),
        });
    };

    // Renderizar acciones
    const accionesTemplate = (rowData) => (
        <div className="p-d-flex p-gap-2">
        {/* Ver detalle */}
        <Button label="Ver" onClick={() => handleVer(rowData.id)} />

        {/* Avanzar estado */}
        {[
            "pendiente",
            "en preparación",
            "listo",
            "servido",
            "cuenta solicitada",
        ].includes(rowData.estado) && (
            <Button
            label="Avanzar estado"
            icon="pi pi-arrow-right"
            onClick={() => handleChangeEstado(rowData)}
            />
        )}

        {/* Cancelar pedido */}
        <Button
            label="Cancelar"
            severity="danger"
            onClick={() => handleCancel(rowData.id)}
        />

        {/* Cerrar pedido (solo admin/cajero) */}
        {["pagado", "cancelado"].includes(rowData.estado) && (
            <Button
            label="Cerrar"
            severity="success"
            onClick={() => handleClose(rowData.id)}
            />
        )}
        </div>
    );

    const formatFecha = (fecha) => {
    if (!fecha) return "-";
    const d = new Date(fecha);
    return isNaN(d.getTime())
        ? "-"
        : d.toLocaleString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Filtrar pedidos visibles
    const pedidosVisibles = pedidos?.filter((p) => p.estado !== "cerrado");

    // Render
    return (
        <Fragment>
        <ConfirmDialog />

        <h1>Listado de Pedidos</h1>

        {/*  Búsqueda */}
        <div className="p-inputgroup mb-3">
            <span className="p-inputgroup-addon">
            <i className="pi pi-search" />
            </span>
            <InputText
            value={lazy?.q}
            onChange={(e) =>
                setLazy({ ...lazy, q: e.target.value, first: 0, page: 0 })
            }
            placeholder="Buscar por estado..."
            />
        </div>

        {/* Tabla */}
        <DataTable
            header="Pedidos"
            value={pedidosVisibles}
            paginator
            lazy
            first={lazy?.first}
            rows={lazy?.rows}
            onPage={(e) =>
            setLazy({
                ...lazy,
                first: e.first,
                rows: e.rows,
                page: e.page,
            })
            }
            loading={loading}
            emptyMessage={
            lazy.q ? "La búsqueda no coincide" : "No hay pedidos disponibles"
            }
        >
            {/* Fecha de creación */}
            <Column
                field="created_at"
                header="Fecha creación"
                sortable
                body={(rowData) => formatFecha(rowData.created_at)}
            />
            <Column field="mesaId" header="Mesa" sortable />
            <Column field="meseroId" header="Mesero" sortable />
            <Column field="estado" header="Estado" sortable />
            <Column field="total" header="Total" />
            {/* Fecha de última modificación */}
            <Column
                field="updated_at"
                header="Última actualización"
                body={(rowData) => formatFecha(rowData.updated_at)}
            />
            <Column
            header="Acciones"
            body={accionesTemplate}
            exportable={false}
            style={{ minWidth: "16rem" }}
            />
        </DataTable>

        {/* temporal (visible en desarrollo sin control de rol) */}
        <Button
            label="Crear pedido"
            icon="pi pi-plus"
            className="mt-3"
            onClick={() => navigate("/pedidos/crear")}
        />
        </Fragment>
    );
};

export default PedidosView;
