import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import SidebarAdmin from "./SidebarAdmin";
import Sidebar from "./Sidebar";
import SidebarUser from "../User/components/SidebarUser"; // ✅ Tambahkan SidebarUser
import Navbar from "./Navbar";
import NavbarUsers from "../User/components/NavbarUsers"; // ✅ Tambahkan NavbarUser
import { Outlet } from "react-router-dom";

function Layout() {
  const { user } = useContext(AuthContext);

  return (
    <div className="app-container">
      {/* 🔥 Navbar berdasarkan role */}
      {user?.role === "siswa" ? <NavbarUsers /> : <Navbar />}

      <div className="main-content">
        {/* 🔥 Sidebar berdasarkan role */}
        {user?.role === "superadmin" ? (
          <Sidebar />
        ) : user?.role === "admin" ? (
          <SidebarAdmin />
        ) : (
          <SidebarUser /> // ✅ Sidebar khusus siswa
        )}

        <div className="content">
          <Outlet /> {/* Render halaman dinamis di sini */}
        </div>
      </div>
    </div>
  );
}

export default Layout;
