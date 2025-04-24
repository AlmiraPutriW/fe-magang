import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../css/styles.css";

const Login = () => {
  const { handleLogin } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src="/images/gambar_login.png" alt="Login Illustration" className="login-image" />
      </div>
      <div className="login-right">
        <h1 className="login-title">Selamat Datang!</h1>
        <p className="login-subtext">Silakan masuk untuk mengakses akun magang Anda</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <div className="input-container">
              <span className="input-icon">📧</span>
              <input
                type="email"
                className="form-input"
                placeholder="Masukkan Email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Kata Sandi</label>
            <div className="input-container">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                className="form-input"
                placeholder="Masukkan Kata Sandi Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn">
            Masuk
          </button>
        </form>

        <p className="register-text">
          Belum punya akun ? <Link to="/register" className="register-link">Daftar disini</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
