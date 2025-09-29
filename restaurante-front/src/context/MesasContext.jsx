import { createContext, useState, useEffect } from "react";
import { notifyInfo, notifyError, notifySucces } from "../utils/Notifier";
import mesasService from "../services/mesasService";

export const MesasContext = createContext();

export const MesasProvider = ({ children }) => {
    const [mesas, setMesas] = useState([]);
    const [editingMesa, setEditingMesa] = useState(null);
    const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null);
    const [lazy, setLazy] = useState({
        first: 0,
        rows: 10,
        page: 0,
        q: '',
    });

    const getMesas = async () => {
        setLoading(true);
        try {
            const page = lazy.page + 1;
            const limit = lazy.rows;
            const q = lazy.q || '';

            const {data: response} = await mesasService.listPaged({page, limit, q});
            // setMesas(Array.isArray(response.data) ? response.data : []);
            setMesas(Array.isArray(response) ? response : response.data || []);
        } catch (error) {
            notifyError(error.response?.data?.message || error.message || "Error al obtener mesa ❌");
            // setError(error.response?.data?.message || error.message);
            console.error("axios GET error:", error);
            setMesas([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMesas();
    }, [lazy.page, lazy.rows, lazy.q]);


    const toggleDisponibilidad = async (id, valor) => {
        setLoading(true);
        try {
            const { data: response } = await mesasService.update(id, { disponible: valor });
            setMesas(prev =>
            prev.map(p => (p.id === id ? { ...p, disponible: valor } : p))
            );
            notifySucces(response.message || "Disponibilidad actualizada ✅");
            return true;
        } catch (error) {
            notifyError(error.response?.data?.message || error.message || "Error al cambiar disponibilidad ❌");
            return false;
        } finally {
            setLoading(false);
        }
    };


    const createMesa = async (newMesa) => {
        setLoading(true);
        try {
            const {data: response} = await mesasService.create({
                ...newMesa,
                disponible: newMesa.disponible ?? true, // fuerza boolean
                });
            const created = Array.isArray(response.data) ? response.data[0] : response.data || response;
            setMesas(prev => Array.isArray(prev) ? [...prev, created] : [created]);
            notifySucces(response.message || "Mesa creada con exito ✅");
            return true;
        } catch (error) {
            // setError(error.response?.data?.message || error.message);
            notifyError(error.response?.data?.message || error.message || "Error al crear mesa ❌");
            console.error("Axios POST error:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteMesa = async (id) => {
        setLoading(true);
        try {
            const {data: response} = await mesasService.delete(id);
            setMesas(prev => prev.filter(p => p.id !== id));
            notifySucces(response.message || "Mesa eliminada con exito ✅");
            return true;
        } catch (error) {
            // setError(error.response?.data?.message || error.message);
            notifyError(error.response?.data?.message || error.message || "Error al eliminar mesa ❌");
            console.error("Axios DELETE error:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const editMesa = async (updated) => {
        setLoading(true);
        try {
            const id = editingMesa.id;
            const {data: response} = await mesasService.update(id, updated);
            setMesas(prev =>
                prev.map(p => (p.id === id ? { ...updated, id } : p))
            )
            notifySucces(response.message || "Mesa actualizado con exito ✅");
            return true;
        } catch (error) {
            // setError(error.response?.data?.message || error.message);
            notifyError(error.response?.data?.message || error.message || "Error al actualizar mesa ❌");
            console.error("Axios PUT error:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return (
        <MesasContext.Provider value={{ mesas, setMesas, editingMesa, setEditingMesa, loading, setLoading, lazy, setLazy, getMesas, createMesa, deleteMesa, editMesa, toggleDisponibilidad }}>
            {children}
        </MesasContext.Provider>
    );
};
            
    
