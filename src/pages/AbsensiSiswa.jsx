import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../css/Absensi.css";

const AbsensiSiswa = () => {
    const { id: paramId } = useParams(); 
    const location = useLocation();
    const navigate = useNavigate();

    const id = paramId || location.pathname.split("/")[2];

    const [absensi, setAbsensi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id || id === "undefined") {
            setError("ID siswa tidak valid.");
            setLoading(false);
            return;
        }
    
        const fetchAbsensi = async () => {
            const token = Cookies.get("accessToken");
            if (!token) {
                setError("Akses ditolak! Silakan login kembali.");
                setLoading(false);
                return;
            }
    
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/absensi/user/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`Gagal mengambil data absensi! (Status: ${response.status})`);
                }
    
                const data = await response.json();
                setAbsensi(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchAbsensi();
    }, [id]);

    const handleDetailClick = (absensiId) => {
        if (!absensiId) {
            console.error("ID absensi tidak ditemukan!");
            return;
        }
        navigate(`/absensi/detail/${absensiId}`);
    };

    return (
        <div className="absensi-container">
            <h2>Data Absensi Siswa</h2>
            {loading && <p className="loading">Memuat data absensi...</p>}
            {error && <p className="error">{error}</p>}

            {absensi.length === 0 && !loading && <p className="empty">Belum ada data absensi.</p>}

            <table className="absensi-table">
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Nama</th>
                        <th>NIM</th>
                        <th>Jurusan</th>
                        <th>Status Kehadiran</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {absensi.map((item) => (
                        <tr key={item.id}>
                            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                            <td>{item.siswa?.name || "Tidak tersedia"}</td>
                            <td>{item.siswa?.nim || "Tidak tersedia"}</td>
                            <td>{item.siswa?.jurusan || "Tidak tersedia"}</td>
                            <td className={`status-${item.status_kehadiran?.toLowerCase() || "unknown"}`}>
                                {item.status_kehadiran || "Belum absen"}
                            </td>
                            <td>
                                <button className="detail-button" onClick={() => handleDetailClick(item.id)}>
                                    Detail 🔍
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AbsensiSiswa;
