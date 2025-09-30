import api from "./api";

const pedidosServices =  {

    listPaged: ({page=1, limit=10, q=''}) => api.get('pedidos', {params: {page, limit, q}}),

    list: () => api.get('pedidos'),
    // get: (id) => api-get(`pedidos/${id}`),
    create: (payload) => api.post('pedidos', payload),
    update: (id, payload) => api.put(`pedidos/${id}`, payload),
    cancel: (id) => api.put(`pedidos/${id}/cancel`),
}

export default pedidosServices