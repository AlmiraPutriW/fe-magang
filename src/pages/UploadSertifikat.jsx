import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import "../css/UploadSertifikat.css";

const UploadSertifikat = () => {
    const { id } = useParams();
    const [sertifikatFile, setSertifikatFile] = useState(null);
    const [suratFile, setSuratFile] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState({ sertifikat: false, surat_keterangan: false });

    const handleFileChange = (e, type) => {
        if (type === "sertifikat") {
            setSertifikatFile(e.target.files[0]);
        } else if (type === "surat_keterangan") {
            setSuratFile(e.target.files[0]);
        }
    };

    const handleUpload = async (type) => {
        const file = type === "sertifikat" ? sertifikatFile : suratFile;
        if (!file) {
            setMessage(`Pilih file ${type} terlebih dahulu!`);
            return;
        }

        const token = Cookies.get("accessToken");
        if (!token) {
            setMessage("Akses ditolak! Silakan login ulang.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("siswa_id", id);
        formData.append("type", type);

        try {
            setLoading((prev) => ({ ...prev, [type]: true }));
            const response = await fetch(`http://127.0.0.1:8000/api/administrasi/upload/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Gagal mengupload ${type}!`);
            }

            setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} berhasil diupload!`);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading((prev) => ({ ...prev, [type]: false }));
        }
    };

    return (
        <div className="upload-container">
            <h2>Upload File</h2>

            {message && <p className="message">{message}</p>}

            {/* Upload Sertifikat */}
            <div className="upload-section">
                <label>Upload Sertifikat:</label>
                <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleFileChange(e, "sertifikat")} />
                <button
                    type="button"
                    className="btn-upload"
                    onClick={() => handleUpload("sertifikat")}
                    disabled={loading.sertifikat}
                >
                    {loading.sertifikat ? "Uploading..." : "Upload Sertifikat"}
                </button>
            </div>

            {/* Upload Surat Keterangan Selesai Magang */}
            <div className="upload-section">
                <label>Upload Surat Keterangan Selesai Magang:</label>
                <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleFileChange(e, "surat_keterangan")} />
                <button
                    type="button"
                    className="btn-upload"
                    onClick={() => handleUpload("surat_keterangan")}
                    disabled={loading.surat_keterangan}
                >
                    {loading.surat_keterangan ? "Uploading..." : "Upload Surat Keterangan"}
                </button>
            </div>
        </div>
    );
};

export default UploadSertifikat;
