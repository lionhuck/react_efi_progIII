import { createContext, useState, useEffect } from "react";
import { notifyError, notifySucces } from "../utils/Notifier";
import pedidosService from "../services/pedidosService";

export const PedidosContext = createContext();

export const PedidosProvider = ({ children }) => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lazy, setLazy] = useState({
        first: 0,
        rows: 10,
        page: 0,
        q: "",
    });

    const getPedidos = async () => {
        setLoading(true);
        try {
        const page = lazy.page + 1;
        const limit = lazy.rows;
        const q = lazy.q || "";

        const { data: response } = await pedidosService.listPaged({ page, limit, q });
        setPedidos(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
        notifyError(
            error.response?.data?.message || error.message || "Error al obtener pedidos ❌"
        );
        console.error("axios GET error:", error);
        setPedidos([]);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        getPedidos();
    }, [lazy.page, lazy.rows, lazy.q]);

    const createPedido = async (newPedido) => {
        setLoading(true);
        try {
        const { data: response } = await pedidosService.create(newPedido);
        const created = Array.isArray(response.data)
            ? response.data[0]
            : response.data || response;
        setPedidos((prev) => (Array.isArray(prev) ? [...prev, created] : [created]));
        notifySucces(response.message || "Pedido creado con éxito ✅");
        return true;
        } catch (error) {
        notifyError(error.response?.data?.message || error.message || "Error al crear pedido ❌");
        console.error("Axios POST error:", error);
        return false;
        } finally {
        setLoading(false);
        }
    };

    const changeEstado = async (id, estado) => {
        setLoading(true);
        try {
        const { data: response } = await pedidosService.updateEstado(id, { estado });
        setPedidos((prev) =>
            prev.map((p) => (p.id === id ? { ...p, estado } : p))
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

    const changeMesa = async (id, mesaId) => {
        setLoading(true);
        try {
        const { data: response } = await pedidosService.updateMesa(id, { mesaId });
        setPedidos((prev) =>
            prev.map((p) => (p.id === id ? { ...p, mesaId } : p))
        );
        notifySucces(response.message || "Mesa cambiada correctamente ✅");
        return true;
        } catch (error) {
        notifyError(error.response?.data?.message || error.message || "Error al cambiar de mesa ❌");
        console.error("Axios PUT error:", error);
        return false;
        } finally {
        setLoading(false);
        }
    };

    const updateDetalles = async (id, detalles) => {
        setLoading(true);
        try {
        const { data: response } = await pedidosService.updateDetalles(id, { detalles });
        setPedidos((prev) =>
            prev.map((p) => (p.id === id ? { ...p, total: response.data.total } : p))
        );
        notifySucces(response.message || "Detalles del pedido actualizados ✅");
        return true;
        } catch (error) {
        notifyError(error.response?.data?.message || error.message || "Error al actualizar detalles ❌");
        console.error("Axios PUT error:", error);
        return false;
        } finally {
        setLoading(false);
        }
    };

    const cancelPedido = async (id) => {
        setLoading(true);
        try {
        const { data: response } = await pedidosService.cancel(id);
        setPedidos((prev) =>
            prev.map((p) => (p.id === id ? { ...p, estado: "cancelado" } : p))
        );
        notifySucces(response.message || "Pedido cancelado con éxito ✅");
        return true;
        } catch (error) {
        notifyError(error.response?.data?.message || error.message || "Error al cancelar pedido ❌");
        console.error("Axios CANCEL error:", error);
        return false;
        } finally {
        setLoading(false);
        }
    };

    const closePedido = async (id) => {
        setLoading(true);
        try {
        const { data: response } = await pedidosService.close(id);
        setPedidos((prev) =>
            prev.map((p) => (p.id === id ? { ...p, estado: "cerrado" } : p))
        );
        notifySucces(response.message || "Pedido cerrado y mesa liberada ✅");
        return true;
        } catch (error) {
        notifyError(error.response?.data?.message || error.message || "Error al cerrar pedido ❌");
        console.error("Axios CLOSE error:", error);
        return false;
        } finally {
        setLoading(false);
        }
    };

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
            loading,
            setLoading,
            lazy,
            setLazy,
            getPedidos,
            createPedido,
            changeEstado,
            changeMesa,
            updateDetalles,
            cancelPedido,
            closePedido,
            getPedidoById,
        }}
        >
        {children}
        </PedidosContext.Provider>
    );
};
