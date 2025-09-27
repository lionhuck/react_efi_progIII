import api from "./api";

const mesasService =  {

    listPaged: ({page=1, limit=10, q=''}) => api.get('mesas', {params: {page, limit, q}}),

    list: () => api.get('mesas'),
    // get: (id) => api-get(`mesas/${id}`),
    create: (payload) => api.post('mesas', payload),
    update: (id, payload) => api.put(`mesas/${id}`, payload),
    delete: (id) => api.delete(`mesas/${id}`)
}

export default mesasService