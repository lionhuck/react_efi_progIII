import { get } from "../../../../node_efi_progIII/src/routes/mesas.routes";
import api from "./api";

const detalle_pedidoService =  {
    get: (id) => api.get(`detalle_pedido/${id}`)
}

export default detalle_pedidoService