import React from "react";
import FileList from "../components/FileList";
import "../css/Administrasi.css";

const Administrasi = () => {
    const userId = 1; // Contoh userId, bisa diganti sesuai sesi login

    return (
        <div className="administrasi-container">
            <FileList userId={userId} />
        </div>
    );
};

export default Administrasi;
