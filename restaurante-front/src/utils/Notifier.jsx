import { TOAST_REF } from "./ToastRef";

export const notifyInfo = (message) => {
    if (TOAST_REF.current) {
        TOAST_REF.current.show({
        severity: "info",
        summary: "Información",
        detail: message,
        life: 4000,
        });
    } else {
        console.error("Toast no está inicializado");
    }
};

export const notifySucces = (message) => {
    if (TOAST_REF.current) {
        TOAST_REF.current.show({
        severity: "success",
        summary: "Éxito",
        detail: message,
        life: 4000,
        });
    } else {
        console.error("Toast no está inicializado");
    }
};

export const notifyError = (message) => {
    if (TOAST_REF.current) {
        TOAST_REF.current.show({
        severity: "error",
        summary: "Error",
        detail: message,
        life: 4000,
        });
    } else {
        console.error("Toast no está inicializado");
    }
};
