import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import "../css/CreateAdmin.css";

const CreateAdmin = () => {
    const [formData, setFormData] = useState({
        name: "",
        nip: "",
        bidang: "",
        jabatan: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.email.includes("@")) {
            Swal.fire({
                icon: "error",
                title: "Format Email Tidak Valid",
                text: "Silakan masukkan email yang benar.",
            });
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            Swal.fire({
                icon: "error",
                title: "Password Terlalu Pendek",
                text: "Password harus minimal 6 karakter.",
            });
            setLoading(false);
            return;
        }

        try {
            const token = Cookies.get("accessToken");
            const response = await fetch("http://127.0.0.1:8000/api/auth/create-admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Gagal menambahkan admin.");
            }

            Swal.fire({
                icon: "success",
                title: "Admin Berhasil Ditambahkan!",
                text: "Admin baru telah berhasil dibuat.",
                confirmButtonColor: "#3085d6",
            });

            setFormData({
                name: "",
                nip: "",
                bidang: "",
                jabatan: "",
                email: "",
                password: "",
            });

            
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Gagal Menambahkan Admin",
                text: err.message || "Terjadi kesalahan.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-form-container">
            <h2 className="admin-form-title">Tambah Admin</h2>

            <form onSubmit={handleSubmit} className="admin-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Nama Lengkap"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="admin-input"
                />

                <input
                    type="text"
                    name="nip"
                    placeholder="NIP"
                    value={formData.nip}
                    onChange={handleChange}
                    required
                    className="admin-input"
                />

                <input
                    type="text"
                    name="bidang"
                    placeholder="Bidang"
                    value={formData.bidang}
                    onChange={handleChange}
                    required
                    className="admin-input"
                />

                <input
                    type="text"
                    name="jabatan"
                    placeholder="Jabatan"
                    value={formData.jabatan}
                    onChange={handleChange}
                    required
                    className="admin-input"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="admin-input"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="admin-input"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="admin-submit-btn"
                >
                    {loading ? "Menambahkan..." : "Tambah Admin"}
                </button>
            </form>
        </div>
    );
};

export default CreateAdmin;
