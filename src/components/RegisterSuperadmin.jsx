import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/styles.css"; // Import CSS

const API_URL = "http://127.0.0.1:8000/api/auth/register-superadmin";

const RegisterSuperadmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    nip: "",
    bidang: "",
    jabatan: "", // Pastikan ini tidak kosong
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error sebelum submit
    setSuccess("");

    console.log("Data yang dikirim:", JSON.stringify(formData, null, 2));

    try {
      const res = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccess("Registrasi berhasil! Silakan login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Error Register:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registrasi gagal");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-right">
        <h2 className="auth-title">Create Account</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nama</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>NIP</label>
            <input type="text" name="nip" value={formData.nip} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Bidang</label>
            <input type="text" name="bidang" value={formData.bidang} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Jabatan</label>
            <input type="text" name="jabatan" value={formData.jabatan} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="auth-btn auth-btn-primary">Sign Up</button>
        </form>

        <p className="mt-3">
          Sudah punya akun? <Link to="/login" className="auth-link">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterSuperadmin;
