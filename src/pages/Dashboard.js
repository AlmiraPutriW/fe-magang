// Dashboard.js
import React from "react";
import Sidebar from "../components/Sidebar"; // pastikan ini benar
import Content from "../components/Dashboard"; // atau sesuai struktur Anda

const Dashboard = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "200px", width: "100%" }}>
        <Content />
      </div>
    </div>
  );
};

export default Dashboard;
