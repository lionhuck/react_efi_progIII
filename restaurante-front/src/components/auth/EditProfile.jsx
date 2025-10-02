// components/EditProfile.jsx
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext"

const EditProfile = () => {
    const { user, updateProfile } = useContext(AuthContext);
    const [form, setForm] = useState({
        nombre: user?.nombre || "",
        email: user?.email || "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await updateProfile(form, { redirect: false });
        setLoading(false);
    };

    return (
        <form onSubmit={onSubmit}>
        <div>
            <label>Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} />
        </div>

        <div>
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} />
        </div>

        <button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
        </button>
        </form>
    );
};

export default EditProfile;
