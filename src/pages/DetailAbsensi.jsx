import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../css/DetailAbsensi.css"; // Pastikan file CSS ada

const DetailAbsensi = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [absensi, setAbsensi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [alamat, setAlamat] = useState("");

    useEffect(() => {
        if (!id || id === "undefined") {
            setError("ID absensi tidak valid.");
            setLoading(false);
            return;
        }

        const fetchDetailAbsensi = async () => {
            const token = Cookies.get("accessToken");
            if (!token) {
                setError("Akses ditolak! Silakan login kembali.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/absensi/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Gagal mengambil detail absensi! (Status: ${response.status})`);
                }

                const data = await response.json();
                setAbsensi(data);

                if (data.position_latitude && data.position_longitude) {
                    fetchAddress(data.position_latitude, data.position_longitude);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDetailAbsensi();
    }, [id]);

    const fetchAddress = async (lat, lon) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            const data = await response.json();
            setAlamat(data.display_name || "Alamat tidak ditemukan");
        } catch (error) {
            console.error("Gagal mengambil alamat:", error);
            setAlamat("Alamat tidak tersedia");
        }
    };

    // Custom icon untuk marker
    const customIcon = new L.Icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        iconSize: [30, 45],
        iconAnchor: [15, 45],
    });

    return (
        <div className="detail-absensi-container">
            <h2>Detail Absensi</h2>
            {loading && <p className="loading">Memuat detail absensi...</p>}
            {error && <p className="error">{error}</p>}

            {absensi && (
                <div className="detail-card">
                    <p><strong>Nama:</strong> {absensi.nama || "Tidak tersedia"}</p>
                    <p><strong>NIM:</strong> {absensi.nim || "Tidak tersedia"}</p>
                    <p><strong>Jurusan:</strong> {absensi.bidang || "Tidak tersedia"}</p>
                    <p><strong>Tanggal:</strong> {new Date(absensi.createdAt).toLocaleDateString()}</p>
                    <p><strong>Jam Mulai:</strong> {absensi.jam_mulai || "Belum absen"}</p>
                    <p><strong>Jam Pulang:</strong> {absensi.jam_pulang || "Belum absen"}</p>
                    <p><strong>Status Kehadiran:</strong> {absensi.status_kehadiran || "Belum absen"}</p>

                    {absensi.position_latitude && absensi.position_longitude ? (
                        <div className="maps-container">
                            <h3>Lokasi Absen</h3>
                            <MapContainer 
                                center={[absensi.position_latitude, absensi.position_longitude]} 
                                zoom={13} 
                                className="leaflet-map"
                                style={{ height: "400px", width: "100%" }} // Pastikan ukurannya ada
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[absensi.position_latitude, absensi.position_longitude]} icon={customIcon}>
                                    <Popup>
                                        <strong>Lokasi Absensi</strong>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                            <p><strong>Alamat:</strong> {alamat || "Sedang mengambil alamat..."}</p>
                        </div>
                    ) : (
                        <p className="error">Lokasi tidak tersedia</p>
                    )}

                    <button className="back-button" onClick={() => navigate(-1)}>🔙 Kembali</button>
                </div>
            )}
        </div>
    );
};

export default DetailAbsensi;
