import { Fragment, useContext } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { AuthContext } from "../context/AuthContext";   // 👈 importar AuthContext
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
// import { exportToPdf } from "../utils/ExportToPdf";
import { InputText } from "primereact/inputtext";

const PlatosView = () => {
    const {platos, setPlatos, editingPlato, setEditingPlato, loading, setLoading, error, setError, lazy, setLazy, getPlatos, createPlato, deletePlato, editPlato} = useContext(AuthContext);