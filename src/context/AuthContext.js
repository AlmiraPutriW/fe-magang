import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { login, logout, registerSuperadmin } from "../api/auth";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2"; // Import SweetAlert2
import logger from "../utils/logger";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const token = Cookies.get("accessToken");

      if (token) {
        try {
          const decoded = jwtDecode(token);
          logger.log("Decoded token:", decoded);

          setUser({
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            status: decoded.status, // Tambahkan status akun
          });
        } catch (error) {
          logger.error("Error decoding token:", error);
          Cookies.remove("accessToken");
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await login(email, password);

      if (!res.data || !res.data.accessToken) {
        throw new Error("Login response invalid");
      }

      const accessToken = res.data.accessToken;
      const decoded = jwtDecode(accessToken);

      // Cek status akun sebelum menyimpan ke cookies dan mengizinkan akses
      if (decoded.status === "pending") {
        Swal.fire({
          icon: "warning",
          title: "Akun Belum Diverifikasi",
          text: "Maaf, akun Anda belum diverifikasi oleh admin.",
          confirmButtonColor: "#3085d6",
        });
        setIsLoading(false);
        return;
      }
      if (decoded.status === "rejected") {
        Swal.fire({
          icon: "error",
          title: "Akun Ditolak",
          text: "Maaf, akun Anda telah ditolak oleh admin.",
          confirmButtonColor: "#d33",
        });
        setIsLoading(false);
        return;
      }

      Cookies.set("accessToken", accessToken, { expires: 1, sameSite: "strict" });

      const userData = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        status: decoded.status,
      };

      setUser(userData);

      switch (userData.role) {
        case "superadmin":
          navigate("/create-admin");
          break;
        case "admin":
          navigate("/verified-users");
          break;
        case "siswa":
          navigate("/form-laporan");
          break;
        default:
          navigate("/"); // Redirect default jika tidak sesuai role
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error.response?.data?.message || "Terjadi kesalahan saat login.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    setIsLoading(true);
    try {
      const res = await registerSuperadmin(formData);
      logger.log("Register response:", res.data);

      Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil",
        text: "Silakan login untuk melanjutkan.",
        confirmButtonColor: "#3085d6",
      });

      navigate("/login");
      return res.data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: error.response?.data?.message || "Terjadi kesalahan saat registrasi.",
      });
      throw new Error(error.response?.data?.message || "Registrasi gagal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      Cookies.remove("accessToken");
      setUser(null);
      navigate("/login");

      Swal.fire({
        icon: "success",
        title: "Logout Berhasil",
        text: "Anda telah keluar.",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      logger.error("Logout gagal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, handleLogin, handleLogout, handleRegister }}>
      {children}
    </AuthContext.Provider>
  );
};
