import { Fragment, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { PlatosContext } from "../../context/PlatosContext";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { confirmDialog } from "primereact/confirmdialog";
import { ConfirmDialog } from "primereact/confirmdialog";

const PlatosView = () => {
    const { platos, setEditingPlato, loading, lazy, setLazy, deletePlato } =
        useContext(PlatosContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleEdit = (plato) => {
        setEditingPlato(plato);
        navigate(`/platos/editar/${plato.id}`);
    };

    const handleDelete = (id) => {
        confirmDialog({
        message: "¿Está seguro que desea eliminar este plato?",
        header: "Confirmación",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Sí, eliminar",
        rejectLabel: "Cancelar",
        accept: async () => {
            await deletePlato(id); // ✅ notify lo maneja el context
        },
        });
    };

    const bodyActions = (rowData) => (
        <div className="p-d-flex p-gap-2">
        <Button label="Editar" onClick={() => handleEdit(rowData)} />
        <Button
            label="Eliminar"
            severity="danger"
            onClick={() => handleDelete(rowData.id)}
        />
        </div>
    );

    return (
        <Fragment>
            {/* Dialog de confirmación (necesario para confirmDialog) */}
            <ConfirmDialog />

            <h1>Listado de Platos</h1>
            <span>Buscar:</span>
            <InputText
                value={lazy?.q}
                onChange={(e) =>
                setLazy({ ...lazy, q: e.target.value, first: 0, page: 0 })
                }
                placeholder="Nombre del plato"
            />

            {/* Tabla de datos */}
            <DataTable
                header="Platos"
                value={platos}
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
                lazy.q ? "La búsqueda no coincide" : "No hay platos disponibles"
                }
            >
                <Column field="nombre" header="Nombre" sortable />
                <Column field="precio" header="Precio" sortable />
                <Column field="descripcion" header="Descripción" />
                
                <Column
                    body={bodyActions}
                    header="Acciones"
                    exportable={false}
                    style={{ minWidth: "8rem" }}
                />

                {/* 👇 Solo mostrar acciones si user es admin
                {user?.rol === "admin" && (
                <Column
                    body={bodyActions}
                    header="Acciones"
                    exportable={false}
                    style={{ minWidth: "8rem" }}
                />
                )} */}
            </DataTable>
        </Fragment>
    );
};

export default PlatosView;
