import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaArrowRight } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../css/LaporanUser.css";

const LaporanUser = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 3;

  // helper ambil cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
  };

  const token = getCookie("accessToken");
  let userId = null;
  if (token) {
    try {
      userId = jwtDecode(token).id;
    } catch {
      console.error("Gagal decode token");
    }
  }

  // fetch laporan + profil
  useEffect(() => {
    if (!token || !userId) {
      setError("Anda belum login! Silakan login terlebih dahulu.");
      setLoading(false);
      return;
    }

    // ambil profil
    axios
      .get(`http://127.0.0.1:8000/api/auth/profilebyId/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => setUserProfile(res.data))
      .catch(() => setError("Gagal mengambil data profil"));

    // ambil laporan
    axios
      .get(`http://127.0.0.1:8000/api/reports/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setReports(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Gagal mengambil laporan")
      )
      .finally(() => setLoading(false));
  }, [token, userId]);

  const truncateText = (text, max) =>
    text.length > max ? text.slice(0, max) + "…" : text;

  const idxLast = currentPage * reportsPerPage;
  const idxFirst = idxLast - reportsPerPage;
  const currentReports = reports.slice(idxFirst, idxLast);

  const paginate = (n) => setCurrentPage(n);
  const nextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, Math.ceil(reports.length / reportsPerPage)));
  const prevPage = () =>
    setCurrentPage((p) => Math.max(p - 1, 1));

  const exportToPDF = () => {
    const doc = new jsPDF();
    const w = doc.internal.pageSize.width;

    // Title
    doc.setFont("helvetica", "bold").setFontSize(16);
    const title = "Daftar Laporan Siswa";
    const tw = doc.getTextWidth(title);
    doc.text(title, (w - tw) / 2, 15);

    // Separator
    doc.setLineWidth(0.5).line(20, 19, w - 20, 19);

    // Biodata (hanya di PDF)
    if (userProfile) {
      const y0 = 25;
      const lh = 7;
      doc.setFontSize(11);

      doc.setFont("helvetica", "bold").text("Nama", 20, y0);
      doc.setFont("helvetica", "normal").text(userProfile.name, 50, y0);

      doc.setFont("helvetica", "bold").text("NIM", 20, y0 + lh);
      doc.setFont("helvetica", "normal").text(userProfile.nim, 50, y0 + lh);

      doc.setFont("helvetica", "bold").text("Jurusan", 20, y0 + 2 * lh);
      doc.setFont("helvetica", "normal").text(userProfile.jurusan, 50, y0 + 2 * lh);

      doc.setFont("helvetica", "bold").text("Asal Sekolah", 20, y0 + 3 * lh);
      doc.setFont("helvetica", "normal").text(userProfile.universitas, 50, y0 + 3 * lh);
    }

    // Table laporan
    const tableStartY = 25 + 4 * 7 + 5;
    doc.setFont("helvetica", "normal").setFontSize(10);
    const cols = ["Judul", "Deskripsi", "Tanggal Kejadian", "Tanggal Laporan"];
    const rows = reports.map((r) => [
      r.title,
      r.description,
      `${new Date(r.startDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })} – ${new Date(r.endDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`,
      new Date(r.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    ]);

    autoTable(doc, {
      startY: tableStartY,
      head: [cols],
      body: rows,
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [220, 220, 220], textColor: 30, fontStyle: "bold" },
    });

    // Footer
    const finalY = doc.lastAutoTable.finalY + 8;
    const today = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(`Surakarta, ${today}`, w - 60, finalY);
    doc.text("Pembimbing Magang", w - 60, finalY + 6);
    doc.text("(_________________________)", w - 60, finalY + 24);

    doc.save("laporan_user.pdf");
  };

  return (
    <div className="report-container">
      <div className="header">
        <h2>Daftar Laporan</h2>
        <div>
          <button
            className="add-report-btn"
            onClick={() => navigate("/form-laporan")}
          >
            + Tambah Laporan
          </button>
          <button className="export-btn" onClick={exportToPDF}>
            📄 Unduh PDF
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : reports.length === 0 ? (
        <p>Tidak ada laporan ditemukan.</p>
      ) : (
        <>
          <ul className="report-list">
            {currentReports.map((report) => (
              <li key={report.id} className="report-item report-card">
                <div className="report-content">
                  <h3>{report.title}</h3>
                  <p>{truncateText(report.description, 100)}</p>
                  <span>
                    {new Date(report.startDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    –{" "}
                    {new Date(report.endDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <div className={`status ${report.status}`}>
                    {report.status === "approved"
                      ? "✅ Laporan Selesai"
                      : report.status === "pending"
                      ? "🟠 Laporan Diproses"
                      : "🔴 Belum Diproses"}
                  </div>
                </div>
                <button
                  className="detail-btn"
                  onClick={() => navigate(`/detail-laporan/${report.id}`)}
                >
                  <FaArrowRight />
                </button>
              </li>
            ))}
          </ul>

          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
              Prev
            </button>
            {Array.from(
              { length: Math.ceil(reports.length / reportsPerPage) },
              (_, i) => (
                <button
                  key={i + 1}
                  className={currentPage === i + 1 ? "active" : undefined}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </button>
              )
            )}
            <button
              onClick={nextPage}
              disabled={currentPage === Math.ceil(reports.length / reportsPerPage)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LaporanUser;
