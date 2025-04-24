import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react"; // Import ikon panah kiri
import "../css/DetailLaporan.css";

const DetailLaporan = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchReportDetail = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/reports/${id}`);
                setReport(response.data);
            } catch (err) {
                setError("Gagal mengambil data laporan.");
            } finally {
                setLoading(false);
            }
        };

        fetchReportDetail();
    }, [id]);

    return (
        <div className="detail-laporan-container">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="detail-laporan-card">
                    {/* Tombol kembali dengan ikon */}
                    <div className="detail-laporan-back-icon" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                    </div>

                    <h2>{report.title}</h2>
                    <p className="detail-laporan-description">{report.description}</p>
                    <p className="detail-laporan-info">
                        <strong>Tanggal:</strong> {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}
                    </p>
                    <p className={`detail-laporan-status detail-laporan-${report.status}`}>
                        {report.status === "approved" ? "✅ Laporan Selesai" :
                         report.status === "pending" ? "🟠 Laporan Diproses" :
                         "🔴 Belum Diproses"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default DetailLaporan;
