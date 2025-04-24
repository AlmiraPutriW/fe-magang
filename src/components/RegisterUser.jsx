import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nim: "",
    password: "",
    jurusan: "",
    universitas: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="register-container">
      {/* Ilustrasi */}
      <div className="register-left">
        <img src="/images/gambar_login.png" alt="Register Illustration" />
      </div>

      {/* Form */}
      <div className="register-right">
        <h1 className="register-title">Buat Akun Baru</h1>
        <p className="register-subtext">Silakan daftar untuk membuat akun magang</p>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Nama Lengkap</label>
            <div className="input-container">
              <span className="input-icon">👤</span>
              <input type="text" name="name" className="form-input" placeholder="Masukkan Nama Anda" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-container">
              <span className="input-icon">📧</span>
              <input type="email" name="email" className="form-input" placeholder="Masukkan Email Anda" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>NIM</label>
            <div className="input-container">
              <span className="input-icon">🎓</span>
              <input type="text" name="nim" className="form-input" placeholder="Masukkan NIM Anda" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Kata Sandi</label>
            <div className="input-container">
              <span className="input-icon">🔒</span>
              <input type="password" name="password" className="form-input" placeholder="Masukkan Kata Sandi Anda" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Jurusan</label>
            <div className="input-container">
              <span className="input-icon">🏫</span>
              <input type="text" name="jurusan" className="form-input" placeholder="Masukkan Jurusan Anda" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Universitas</label>
            <div className="input-container">
              <span className="input-icon">🏢</span>
              <input type="text" name="universitas" className="form-input" placeholder="Masukkan Universitas Anda" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Tanggal Mulai Magang</label>
            <div className="input-container">
              <span className="input-icon">📅</span>
              <input type="date" name="startDate" className="form-input" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Tanggal Selesai Magang</label>
            <div className="input-container">
              <span className="input-icon">📅</span>
              <input type="date" name="endDate" className="form-input" onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="register-btn">Daftar</button>
        </form>

        <p className="login-text">
          Sudah punya akun? <Link to="/login" className="login-link">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
