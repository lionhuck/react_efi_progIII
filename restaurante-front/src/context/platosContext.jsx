import { createContext, useState, useEffect } from "react";
import api from "../services/api";
import { notifyInfo, notifyError, notifySucces } from "../utils/Notifier";
import platosService from "../services/platosService";

export const PlatosContext = createContext();

export const PlatosProvider = ({ children }) => {
    const [platos, setPlatos] = useState([]);
    const [editingPlato, setEditingPlato] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lazy, setLazy] = useState({
        first: 0,
        rows: 10,
        page: 0,
        q: '',
    });

    const getPlatos = async () => {
        setLoading(true);
        try {
            const page = lazy.page + 1;
            const limit = lazy.rows;
            const q = lazy.q || '';

            const {data: response} = await platosService.listPaged({page, limit, q});
            setPlatos(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            console.error("axios GET error:", error);
            setPlatos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPlatos();
    }, [lazy.page, lazy.rows, lazy.q]);

    const createPlato = async (newPlato) => {
        setLoading(true);
        try {
            const {data: response} = await platosService.create(newPlato);
            const created = Array.isArray(response.data) ? response.data[0] : response.data || response;
            setPlatos(prev => Array.isArray(prev) ? [...prev, created] : [created]);
            return true;
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            console.error("Axios POST error:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deletePlato = async (id) => {
        setLoading(true);
        try {
            await platosService.delete(id);
            setPlatos(prev => prev.filter(p => p.id !== id));
            return true;
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            console.error("Axios DELETE error:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const editPlato = async (updated) => {
        setLoading(true);
        try {
            const id = editingPlato.id;
            await platosService.update(id, updated);
            setPlatos(prev =>
                prev.map(p => (p.id === id ? { ...updated, id } : p))
            )
            return true;
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            console.error("Axios PUT error:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return (
        <PlatosContext.Provider value={{ platos, setPlatos, editingPlato, setEditingPlato, loading, setLoading, error, setError, lazy, setLazy, getPlatos, createPlato, deletePlato, editPlato }}>
            {children}
        </PlatosContext.Provider>
    );
};
            
    
