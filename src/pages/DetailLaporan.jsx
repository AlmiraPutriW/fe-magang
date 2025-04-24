import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import "../css/DetailLaporanSiswa.css"; 

const DetailLaporanSiswa = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchReport = async () => {
            const token = Cookies.get("accessToken");
            if (!token) {
                setError("Akses ditolak! Silakan login kembali.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/reports/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Gagal mengambil laporan siswa.");
                }

                const data = await response.json();
                setReport(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]);

    const handleApproval = async (action) => {
        const token = Cookies.get("accessToken");
        if (!token) {
            setError("Akses ditolak! Silakan login kembali.");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/reports/${id}/${action}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Gagal ${action === "approve" ? "menyetujui" : "menolak"} laporan.`);
            }

            const data = await response.json();
            setReport((prevReport) => ({
                ...prevReport,
                status: data.report.status,
            }));

            Swal.fire({
                icon: "success",
                title: `Laporan ${action === "approve" ? "disetujui" : "ditolak"}`,
                text: `Laporan telah berhasil ${action === "approve" ? "disetujui" : "ditolak"}.`,
            });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="detail-laporan-container">
            <div className="header">
                <button className="btn-back" onClick={() => navigate(-1)}>
                    <FaArrowLeft />
                </button>
                <h2>Detail Laporan Siswa</h2>
            </div>

            {loading && <p className="loading">Memuat laporan...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !report && <p className="empty">Laporan tidak ditemukan.</p>}

            {report && (
                <div className="report-table-container">
                    <table className="report-table">
                        <tbody>
                            <tr>
                                <th>Judul</th>
                                <td>{report.title}</td>
                            </tr>
                            <tr>
                                <th>Nama</th>
                                <td>{report.name}</td>
                            </tr>
                            <tr>
                                <th>Universitas</th>
                                <td>{report.university}</td>
                            </tr>
                            <tr>
                                <th>Deskripsi</th>
                                <td>{report.description}</td>
                            </tr>
                            <tr>
                                <th>Tanggal Mulai</th>
                                <td>{new Date(report.startDate).toLocaleDateString("id-ID")}</td>
                            </tr>
                            <tr>
                                <th>Tanggal Selesai</th>
                                <td>{new Date(report.endDate).toLocaleDateString("id-ID")}</td>
                            </tr>
                            <tr>
                                <th>Tanggal Sistem</th>
                                <td>{new Date(report.systemDate).toLocaleDateString("id-ID")}</td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td>
                                    <span className={`status ${report.status}`}>
                                        {report.status}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {report.status === "pending" && (
                        <div className="action-buttons">
                            <button className="btn-approve" onClick={() => handleApproval("approve")}>
                                ✔ Terima
                            </button>
                            <button className="btn-reject" onClick={() => handleApproval("reject")}>
                                ✖ Tolak
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DetailLaporanSiswa;
