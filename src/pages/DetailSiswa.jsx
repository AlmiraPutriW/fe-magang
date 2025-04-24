import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FaArrowLeft } from "react-icons/fa";
import "../css/DetailSiswa.css";

const DetailSiswa = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudentDetail = async () => {
            const token = Cookies.get("accessToken");

            if (!token) {
                setError("Akses ditolak! Silakan login kembali.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/auth/profilebyId/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error("Unauthorized! Silakan login ulang.");
                    } else if (response.status === 404) {
                        throw new Error("Data siswa tidak ditemukan.");
                    } else {
                        throw new Error("Terjadi kesalahan saat mengambil data.");
                    }
                }

                const data = await response.json();

                if (!data || Object.keys(data).length === 0) {
                    throw new Error("Data siswa kosong.");
                }

                setStudent(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetail();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="student-detail-container">
            <button className="btn-back" onClick={() => navigate(-1)}>
                <FaArrowLeft />
            </button>
            
            {loading && <p className="loading">Loading...</p>}
            {error && <p className="error">{error}</p>}
            {student && (
                <>
                    <h2>{student.name}</h2>
                    <table className="student-table">
                        <tbody>
                            <tr><td><strong>NIM</strong></td><td>{student.nim}</td></tr>
                            <tr><td><strong>Jurusan</strong></td><td>{student.jurusan}</td></tr>
                            <tr><td><strong>Universitas</strong></td><td>{student.universitas}</td></tr>
                            <tr><td><strong>Mulai</strong></td><td>{formatDate(student.startDate)}</td></tr>
                            <tr><td><strong>Selesai</strong></td><td>{formatDate(student.endDate)}</td></tr>
                            <tr><td><strong>Email</strong></td><td>{student.email || "Email tidak tersedia"}</td></tr>
                        </tbody>
                    </table>

                    <h3><strong>Menu</strong></h3>
                    <ul className="menu-list">
                        <li><a href={`/siswa/${id}/laporan`}>📄 Laporan Siswa</a></li>
                        <li><a href={`/siswa/${id}/upload-sertifikat`}>📜 Upload Sertifikat</a></li>
                        <li><a href={`/siswa/${id}/jadwal`}>📅 Jadwal Siswa</a></li>
                        <li><a href={`/siswa/${id}/absensi`}>📌 Absensi Siswa</a></li>
                    </ul>
                </>
            )}
        </div>
    );
};

export default DetailSiswa;
