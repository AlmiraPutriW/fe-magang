import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../css/LaporanSiswa.css"; // ✅ Pastikan file ini ada

const LaporanSiswa = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const reportsPerPage = 5;

    useEffect(() => {
        const fetchReports = async () => {
            const token = Cookies.get("accessToken");
            if (!token) {
                setError("Akses ditolak! Silakan login kembali.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/reports/user/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Gagal mengambil laporan siswa.");
                }

                const data = await response.json();
                setReports(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [id]);

    // Hitung indeks untuk pagination
    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

    return (
        <div className="laporan-container">
            <h2>Laporan Siswa</h2>
            {loading && <p className="loading">Memuat laporan...</p>}
            {error && <p className="error">{error}</p>}

            {reports.length === 0 && !loading && <p className="empty">Belum ada laporan.</p>}

            <table className="report-table">
                <thead>
                    <tr>
                        <th>Siswa</th>
                        <th>Status</th>
                        <th>Tanggal</th>
                        <th>Judul Laporan</th>
                        <th>Deskripsi Laporan</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {currentReports.map((report) => (
                        <tr key={report.id}>
                            <td>
                                <strong><div className="nama">{report.name}</div></strong>
                            </td>
                            <td>
                                <div className={`status ${report.status ? report.status.toLowerCase() : "pending"}`}>
                                    {report.status || "Pending"}
                                </div>
                            </td>
                            <td>{new Date(report.systemDate).toLocaleDateString("id-ID")}</td>
                            <td>{report.title}</td>
                            <td>
                                {report.description.length > 50 
                                    ? report.description.substring(0, 50) + "..." 
                                    : report.description}
                            </td>
                            <td>
                                <button className="btn-detail" onClick={() => navigate(`/laporan/${report.id}`)}>
                                    Detail
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            {reports.length > reportsPerPage && (
                <div className="pagination">
                    <button 
                        className="btn-prev" 
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        ← Previous
                    </button>
                    <div className="page-numbers">
                        {Array.from({ length: Math.ceil(reports.length / reportsPerPage) }, (_, i) => (
                            <span 
                                key={i + 1} 
                                className={currentPage === i + 1 ? "active" : ""}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </span>
                        ))}
                    </div>
                    <button 
                        className="btn-next" 
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(reports.length / reportsPerPage)))}
                        disabled={currentPage === Math.ceil(reports.length / reportsPerPage)}
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
};

export default LaporanSiswa;
