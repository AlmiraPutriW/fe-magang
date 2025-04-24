import React from "react";
import { Link } from "react-router-dom";
import "../css/SidebarUser.css";

const SidebarUser = () => {
  // Jika logo Anda ditempatkan di public/images/logo.png,
  // cukup gunakan path absolut:
  const logoUrl = "/images/solo.png";

  return (
    <div className="sidebar-user">
      <div className="sidebar-user-header">
        <div className="user-logo">
          <img src={logoUrl} alt="Magang DISKOMINFO Logo" />
        </div>
        <h2>Magang DISKOMINFO</h2>
        <h2>Surakarta</h2>
      </div>

      <div className="user-menu">
        <h2>Menu</h2>
        <ul>
          <li><Link to="/absensi-user">📌 Absensi</Link></li>
          <li><Link to="/jadwal-user">📅 Jadwal</Link></li>
          <li><Link to="/laporan-user">📄 Laporan</Link></li>
          <li><Link to="/administrasi-user">🎓 Sertifikat</Link></li>
        </ul>
      </div>

      <div className="user-profile">
        <h2>Profile</h2>
        <ul>
          <li><Link to="/profil-user">👤 Profil</Link></li>
          <li><Link to="/logout">🚪 Keluar</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarUser;
