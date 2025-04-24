// src/components/Dashboard.js
import React from "react";
import Sidebar from "../components/Sidebar"; // Mengimpor Sidebar
import { Outlet } from "react-router-dom"; // Menggunakan Outlet untuk menampilkan konten sesuai rute
import '../css/dashboard.css'

const AdminProfile = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h2>ini profile</h2>
        <Outlet /> {/* Konten dinamis akan ditampilkan di sini */}
      </div>
    </div>
  );
};

export default AdminProfile;
