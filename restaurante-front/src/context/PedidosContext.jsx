import { createContext, useState, useEffect } from "react";
import { notifyError, notifyInfo, notifySucces } from "../utils/Notifier";
import pedidosService from "../services/pedidosServices";

export const PedidosContext = createContext();

export const PedidosProvider = ({ children }) => {
    const [pedidos, setPedidos] = useState([]);
    const [editingPedido, setEditingPedido] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lazy, setLazy] = useState({
        first: 0,
        rows: 10,
        page: 0,
        q: '',
    });

    const getPedidos = async () => {
        setLoading(true);
        try {
            const page = lazy.page + 1;
            const limit = lazy.rows;
            const q = lazy.q || '';

            const {data: response} = await pedidosService.listPaged({page, limit, q});
            setPedidos(Array.isArray(response.data) ? response.data : []);
            // setPedidos(Array.isArray(response) ? response : response.data || []);
        } catch (error) {
            notifyError(error.response?.data?.message || error.message || "Error al obtener pedido ❌");
            console.error("axios GET error:", error);
            setPedidos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPedidos();
    }, [lazy.page, lazy.rows, lazy.q]);

    const changeEstado = async (id, estado) => {
        setLoading(true);
        try {
            const { data: response } = await pedidosService.update(id, { estado });
            setPedidos(prev =>
            prev.map(p => (p.id === id ? { ...p, estado } : p))
            );
            notifySucces(response.message || "Estado del pedido actualizado ✅");
            return true;
        } catch (error) {
            notifyError(error.response?.data?.message || error.message || "Error al actualizar estado ❌");
            return false;
        } finally {
            setLoading(false);
        }
    }; 

    const createPedido = async (newPedido) => {
        setLoading(true);
        try {
            const {data: response} = await pedidosService.create(newPedido);
            const created = Array.isArray(response.data) ? response.data[0] : response.data || response;
            setPedidos(prev => Array.isArray(prev) ? [...prev, created] : [created]);
            notifySucces(response.message || "Pedido creado con exito ✅");
            return true;
        } catch (error) {
            notifyError(error.response?.data?.message || error.message || "Error al crear pedido ❌");
            console.error("Axios POST error:", error);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const cancelPedido = async (id) => {
        setLoading(true);
        try {
            const { data: response } = await pedidosService.cancel(id); 
            setPedidos((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, estado: "cancelado" } : p
            )
            );
            notifySucces(response.message || "Pedido cancelado con éxito ✅");
            return true;
        } catch (error) {
            notifyError(
            error.response?.data?.message ||
                error.message ||
                "Error al cancelar pedido ❌"
            );
            console.error("Axios CANCEL error:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };


    const editPedido = async (updated) => {
        setLoading(true);
        try {
            const id = editingPedido.id;
            const {data: response} = await pedidosService.update(id, updated);
            setPedidos(prev =>
                prev.map(p => (p.id === id ? { ...updated, id } : p))
            )
            notifySucces(response.message || "Pedido actualizado con exito ✅");
            return true;
        } catch (error) {
            notifyError(error.response?.data?.message || error.message || "Error al actualizar pedido ❌");
            console.error("Axios PUT error:", error);
            return false;
        } finally {
            setLoading(false);
        }
    }
    
    const getPedidoById = async (id) => {
        setLoading(true);
        try {
            const { data: response } = await pedidosService.get(id);
            return response.data;
        } catch (error) {
            notifyError(error.response?.data?.message || error.message || "Error al obtener pedido ❌");
            return null;
        } finally {
            setLoading(false);
        }
    };


    return (
        <PedidosContext.Provider
            value={{
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
            }}
        >
            {children}
        </PedidosContext.Provider>
    );

}