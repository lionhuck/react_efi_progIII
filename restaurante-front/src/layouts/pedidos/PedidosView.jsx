import { Fragment, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { PedidosContext } from "../../context/PedidosContext";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { confirmDialog } from "primereact/confirmdialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import { InputSwitch } from "primereact/inputswitch";

const PedidosView = () => {
    const {
        pedidos,
        setPedidos,
        editingPedido,
        setEditingPedido,
        loading,
        setLoading,
        lazy,
        setLazy,
        getPedidos,
        createPedido,
        cancelPedido,
        editPedido,
        changeEstado,
        getPedidoById,
    } = useContext(PedidosContext);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleEdit = (pedido) => {
        setEditingPedido(pedido);
        navigate(`/pedidos/editar/${pedido.id}`);
    };

    const handleCancel = (id) => {
        confirmDialog({
        message: "¿Está seguro que desea cancelar este pedido?",
        header: "Confirmación",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Sí, cancelar",
        rejectLabel: "Cancelar",
        accept: async () => {
            await cancelPedido(id); // ✅ notify lo maneja el context
        },
        });
    };

    const bodyActions = (rowData) => (
        <div className="p-d-flex p-gap-2">
        <Button label="Editar" onClick={() => handleEdit(rowData)} />
        <Button
            label="Cancelar pedido"
            severity="danger"
            onClick={() => handleCancel(rowData.id)}
        />
        </div>
    );

    const pedidosVisibles = pedidos?.filter(p => p.estado !== "cancelado");

    return (
        <Fragment>
        {/* Dialog de confirmación (necesario para confirmDialog) */}
        <ConfirmDialog />

        <h1>Listado de Pedidos</h1>
        <span>Buscar:</span>
        <InputText
            value={lazy?.q}
            onChange={(e) =>
            setLazy({ ...lazy, q: e.target.value, first: 0, page: 0 })
            }
            placeholder="Nombre del pedido"
        />
        {/*filtrado segun rol*/}


        {/* Tabla de datos */}
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
            className="custom-datatable"
            emptyMessage={
            lazy.q ? "La búsqueda no coincide" : "No hay pedidos disponibles"
            }
        >
            <Column field="mesaId" header="Mesa" sortable />
            <Column field="meseroId" header="Mesero" sortable />
            <Column field="estado" header="Estado" />
            <Column field="total" header="Total" />

            {/* 👇 Bloque temporal en desarrollo (acciones y disponibilidad visibles sin control de rol) */}
            <Column
                header="Acciones (TEMP sin control de rol)"
                body={bodyActions}
                exportable={false}
                style={{ minWidth: "8rem" }}
            />
        </DataTable>
         {/* 👇 temporal (sin control de rol, visible ahora en desarrollo) */}
        <Button label="Crear pedido" onClick={() => navigate("/pedidos/crear")} />
        </Fragment>
    );
};

export default PedidosView;
