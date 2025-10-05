import api from "./api";

const pedidosService =  {

    listPaged: ({page=1, limit=10, q=''}) => api.get('pedidos', {params: {page, limit, q}}),

    list: () => api.get('pedidos'),
    get: (id) => api.get(`pedidos/${id}`),
    create: (payload) => api.post('pedidos', payload),
    updateEstado: (id, payload) => api.put(`pedidos/${id}/estado`, payload),
    updateMesa: (id, payload) => api.put(`pedidos/${id}/mesa`, payload),
    updateDetalles: (id, payload) => api.put(`pedidos/${id}/detalles`, payload),
    cancel: (id) => api.put(`pedidos/${id}/cancelar`),
    close: (id) => api.put(`pedidos/${id}/cerrar`),
}

export default pedidosService