import React from "react";
import "../css/Sidebar.css";

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="admin-profile">
                <span className="notification-icon">🔔</span>
                <span className="admin-name">Admin</span>
                <img className="admin-avatar" src="https://via.placeholder.com/35" alt="Admin Avatar" />
            </div>
        </div>
    );
};

export default Navbar;
