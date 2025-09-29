import { Fragment, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MesasContext } from "../../context/MesasContext";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { confirmDialog } from "primereact/confirmdialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import { InputSwitch } from "primereact/inputswitch";

const MesasView = () => {
    const {
        mesas,
        setEditingMesa,
        loading,
        lazy,
        setLazy,
        deleteMesa,
        toggleDisponibilidad,
    } = useContext(MesasContext);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleEdit = (mesa) => {
        setEditingMesa(mesa);
        navigate(`/mesas/editar/${mesa.id}`);
    };

    const handleDelete = (id) => {
        confirmDialog({
        message: "¿Está seguro que desea eliminar esta mesa?",
        header: "Confirmación",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Sí, eliminar",
        rejectLabel: "Cancelar",
        accept: async () => {
            await deleteMesa(id); // ✅ notify lo maneja el context
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

    // 👇 Filtrado según rol (admins ven todo, otros solo disponibles)
    const mesasVisibles =
        user?.rol === "admin"
        ? mesas
        : mesas.filter((m) => m.disponible === true);

    return (
        <Fragment>
        <ConfirmDialog />

        <h1>Listado de Mesas</h1>
        <span>Buscar:</span>
        <InputText
            value={lazy?.q}
            onChange={(e) =>
            setLazy({ ...lazy, q: e.target.value, first: 0, page: 0 })
            }
            placeholder="Capacidad"
        />

        


        <DataTable
            header="Mesas"
            value={mesasVisibles}
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
            lazy.q ? "La búsqueda no coincide" : "No hay mesas disponibles"
            }
        >
            <Column field="numero" header="Número" sortable />
            <Column field="capacidad" header="Capacidad" sortable />

            {/* 👇 Bloque temporal (sin control de rol, visible ahora en desarrollo) */}
            <Column
            body={bodyActions}
            header="Acciones (TEMP sin control de rol)"
            exportable={false}
            style={{ minWidth: "8rem" }}
            />
            <Column
            header="Disponible (TEMP sin control de rol)"
            body={(rowData) => (
                <InputSwitch
                checked={rowData.disponible}
                onChange={(e) =>
                    toggleDisponibilidad(rowData.id, e.value)
                }
                />
            )}
            />

            {/* 👇 Bloque real: solo admin puede ver acciones y disponibilidad
            {user?.rol === "admin" && (
            <>
                <Column
                body={bodyActions}
                header="Acciones"
                exportable={false}
                style={{ minWidth: "8rem" }}
                />
                <Column
                header="Disponible"
                body={(rowData) => (
                    <InputSwitch
                    checked={rowData.disponible}
                    onChange={(e) =>
                        toggleDisponibilidad(rowData.id, e.value)
                    }
                    />
                )}
                />
            </>
            )} */}
        </DataTable>

        {/* 👇 real: solo admin puede crear
        {user?.rol === "admin" && (
            <Button label="Crear mesa" onClick={() => navigate("/mesas/crear")} />
        )}/*/}

         {/* 👇 temporal (sin control de rol, visible ahora en desarrollo) */}
        <Button label="Crear mesa" onClick={() => navigate("/mesas/crear")} />

        </Fragment>
    );
};

export default MesasView;
