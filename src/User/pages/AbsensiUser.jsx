import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../css/AbsensiUser.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const AbsensiUser = () => {
  const [absensiList, setAbsensiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const customMarker = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    popupAnchor: [1, -34],
    shadowSize: [45, 45],
  });

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const token = getCookie("accessToken");
  let userId = null;
  if (token) {
    try {
      userId = jwtDecode(token).id;
    } catch (err) {
      console.error("Gagal decode token:", err);
    }
  }

  // Ambil posisi GPS
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Gagal mendapatkan lokasi:", err);
          setError("Gagal mendapatkan lokasi. Pastikan GPS diaktifkan.");
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser.");
    }
  }, []);

  // Fetch daftar absensi
  useEffect(() => {
    if (userId != null) {
      fetchAbsensi();
    }
  }, [userId]);

  const fetchAbsensi = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/absensi/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAbsensiList(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data absensi.");
    } finally {
      setLoading(false);
    }
  };

  // Handler Absen Masuk
  const handleAbsensiMasuk = async () => {
    if (!position.latitude || !position.longitude) {
      Swal.fire("Error", "Lokasi tidak tersedia. Pastikan GPS aktif.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/absensi/",
        {
          statusKehadiran: "Hadir",
          position,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        icon: "success",
        title: "Absen Masuk Berhasil",
        text: res.data.message,
        timer: 2000,
        showConfirmButton: false,
      });
      await fetchAbsensi();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Gagal absen masuk.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handler Absen Pulang
  const handleAbsensiPulang = async () => {
    if (!position.latitude || !position.longitude) {
      Swal.fire("Error", "Lokasi tidak tersedia. Pastikan GPS aktif.", "error");
      return;
    }
    setLoading(true);
    try {
      // Ambil absensi paling baru untuk update
      const latest = absensiList[0];
      if (!latest) throw new Error("Tidak ada data absen untuk di-update.");
      const res = await axios.put(
        `http://127.0.0.1:8000/api/absensi/update/${latest.id}`,
        {
          statusKehadiran: "Hadir",
          position,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        icon: "success",
        title: "Absen Pulang Berhasil",
        text: res.data.message,
        timer: 2000,
        showConfirmButton: false,
      });
      await fetchAbsensi();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Gagal absen pulang.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(absensiList.length / itemsPerPage);
  const currentData = absensiList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="absensi-container">
      <h2>Absensi Kehadiran</h2>

      {/* Peta */}
      <div className="map-container">
        <MapContainer
          center={[-2.5489, 118.0149]}
          zoom={5}
          className="leaflet-container"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {position.latitude && position.longitude && (
            <Marker
              position={[position.latitude, position.longitude]}
              icon={customMarker}
            >
              <Popup>Lokasi Anda</Popup>
            </Marker>
          )}
          {absensiList.map((item) =>
            item.latitude && item.longitude ? (
              <Marker
                key={item.id}
                position={[item.latitude, item.longitude]}
                icon={customMarker}
              >
                <Popup>
                  <strong>{item.nama}</strong>
                  <br />
                  NIM: {item.nim}
                  <br />
                  Masuk: {item.jam_mulai}
                  <br />
                  Pulang: {item.jam_pulang || "Belum Pulang"}
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>

      {/* Tombol Absen */}
      <button
        className="absen-btn masuk"
        onClick={handleAbsensiMasuk}
        disabled={loading}
      >
        {loading ? "Mengirim..." : "Absen Masuk"}
      </button>
      <button
        className="absen-btn pulang"
        onClick={handleAbsensiPulang}
        disabled={loading}
      >
        {loading ? "Mengirim..." : "Absen Pulang"}
      </button>

      {/* Riwayat Absensi */}
      <h3 className="riwayat-title">Riwayat Absensi</h3>
      <table className="riwayat-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>NIM</th>
            <th>Status</th>
            <th>Jam Masuk</th>
            <th>Jam Pulang</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.id}>
              <td>{item.nama}</td>
              <td>{item.nim}</td>
              <td>{item.status_kehadiran}</td>
              <td>{item.jam_mulai}</td>
              <td>{item.jam_pulang || "Belum Pulang"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          &laquo; Prev
        </button>
        <span>
          Halaman {currentPage} dari {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((p) => Math.min(p + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next &raquo;
        </button>
      </div>
    </div>
  );
};

export default AbsensiUser;
