import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCheck, FaUserTimes, FaChalkboardTeacher, FaUserShield, FaSignOutAlt, FaCalendarAlt } from "react-icons/fa"; // ✅ Tambah icon kalender
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import "../css/Sidebar.css";

const SidebarAdmin = () => {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault(); 

        Swal.fire({
            title: "Konfirmasi Logout",
            text: "Apakah Anda yakin ingin logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Logout",
            cancelButtonText: "Batal"
        }).then((result) => {
            if (result.isConfirmed) {
                Cookies.remove("accessToken");

                Swal.fire({
                    icon: "success",
                    title: "Logout Berhasil",
                    text: "Anda akan dialihkan ke halaman login.",
                    confirmButtonColor: "#3085d6",
                });

                setTimeout(() => {
                    navigate("/login"); 
                }, 1500);
            }
        });
    };

    return (
        <div className="sidebar open">
            <h1 className="sidebar-title">Menu</h1>
            <ul className="sidebar-menu">
                <li>
                    <Link to="/verified-users">
                        <FaUserCheck className="icon" /> Siswa Diverifikasi
                    </Link>
                </li>
                <li>
                    <Link to="/unverified-users">
                        <FaUserTimes className="icon" /> Siswa Ditolak
                    </Link>
                </li>
                <li>
                    <Link to="/ampuanAdmin">
                        <FaChalkboardTeacher className="icon" /> Siswa Ampuan Admin
                    </Link>
                </li>
                <li>
                    <Link to="/pending-users">
                        <FaChalkboardTeacher className="icon" /> Siswa Pending
                    </Link>
                </li>
            </ul>

            <h1 className="sidebar-title">Profile</h1>
            <ul className="sidebar-menu">
                <li>
                    <Link to="/admin-profile">
                        <FaUserShield className="icon" /> Profile Admin
                    </Link>
                </li>
                <li>
                    <Link to="#" onClick={handleLogout}>
                        <FaSignOutAlt className="icon" /> Logout
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default SidebarAdmin;
