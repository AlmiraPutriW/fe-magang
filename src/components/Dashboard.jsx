// src/components/Dashboard.js
import React from "react";
import Sidebar from "./Sidebar"; // Mengimpor Sidebar
import { Outlet } from "react-router-dom"; // Menggunakan Outlet untuk menampilkan konten sesuai rute
import '../css/dashboard.css'

const Dashboard = () => {
  return (
    
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h2>Selamat datang di Dashboard</h2>
        <Outlet /> {/* Konten dinamis akan ditampilkan di sini */}
      </div>
    </div>
  );
};

export default Dashboard;
