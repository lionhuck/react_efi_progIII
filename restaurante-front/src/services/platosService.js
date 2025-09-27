import api from "./api";

const platosService =  {

    listPaged: ({page=1, limit=10, q=''}) => api.get('productos', {params: {page, limit, q}}),

    list: () => api.get('platos'),
    // get: (id) => api-get(`platos/${id}`),
    create: (payload) => api.post('platos', payload),
    update: (id, payload) => api.put(`platos/${id}`, payload),
    delete: (id) => api.delete(`platos/${id}`)
}

export default platosService