import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import { getPendingSiswa, verifySiswa, rejectSiswa } from "../api/auth"; // Import API
import "../css/Students.css"; // Pastikan file CSS tersedia

const PendingUsers = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [loadingIds, setLoadingIds] = useState([]);

    useEffect(() => {
        fetchPendingStudents();
    }, []);

    const fetchPendingStudents = async () => {
        setLoading(true);
        setError(""); // Reset error sebelum melakukan request
        try {
            const response = await getPendingSiswa();
            console.log("📢 Response dari API:", response);
    
            if (response.data && Array.isArray(response.data.pendingStudents)) {
                setStudents(response.data.pendingStudents);
    
                // Hanya set error jika terjadi kesalahan, bukan saat data kosong
                if (response.data.pendingStudents.length === 0) {
                    setError(""); // Jangan tampilkan error jika hanya kosong
                }
            } else {
                throw new Error("Format data API tidak sesuai.");
            }
        } catch (err) {
            console.error("❌ Error:", err);
            setError("Gagal mengambil data siswa. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleVerify = async (id) => {
        const confirm = await Swal.fire({
            title: "Konfirmasi Verifikasi",
            text: "Apakah kamu yakin ingin memverifikasi siswa ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, verifikasi!",
            cancelButtonText: "Batal",
        });

        if (confirm.isConfirmed) {
            try {
                await verifySiswa(id, "Diverifikasi oleh admin");
                Swal.fire("✅ Berhasil!", "Siswa telah diverifikasi.", "success");
                setStudents((prevStudents) => prevStudents.filter((student) => student.id !== id));
            } catch (error) {
                Swal.fire("❌ Gagal!", "Gagal memverifikasi siswa.", "error");
            }
        }
    };

    const handleReject = async (id) => {
        if (loadingIds.includes(id)) return; // Cegah klik ganda

        const confirm = await Swal.fire({
            title: "Konfirmasi Penolakan",
            text: "Apakah kamu yakin ingin menolak siswa ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, tolak!",
            cancelButtonText: "Batal",
        });

        if (confirm.isConfirmed) {
            setLoadingIds((prev) => [...prev, id]); // Tandai sebagai loading
    
            try {
                await rejectSiswa(id, "Data tidak valid atau tidak memenuhi syarat");
                Swal.fire("❌ Ditolak!", "Siswa berhasil ditolak.", "success");
                setStudents((prevStudents) => prevStudents.filter((student) => student.id !== id));
            } catch (error) {
                Swal.fire("🚨 Gagal!", "Gagal menolak siswa.", "error");
            } finally {
                setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id)); // Hapus dari loading state
            }
        }
    };

    return (
        <div className="students-container">
            <h2>Daftar Siswa Menunggu</h2>

            {loading && <p>Loading...</p>}

            <div className="students-table-wrapper">
                <table className="students-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama</th>
                            <th>NIM</th>
                            <th>Jurusan</th>
                            <th>Universitas</th>
                            <th>Email</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students.map((student, index) => (
                                <tr key={student.id}>
                                    <td>{index + 1}</td>
                                    <td>{student.name}</td>
                                    <td>{student.nim}</td>
                                    <td>{student.jurusan}</td>
                                    <td>{student.universitas}</td>
                                    <td>{student.email || "Email tidak tersedia"}</td>
                                    <td className="action-buttons">
                                        <button className="btn-approve" onClick={() => handleVerify(student.id)}>
                                            ✅ Terima
                                        </button>
                                        <button 
                                            className="btn-reject" 
                                            onClick={() => handleReject(student.id)} 
                                            disabled={loadingIds.includes(student.id)}
                                        >
                                            {loadingIds.includes(student.id) ? "⏳ Menolak..." : "❌ Tolak"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">Tidak ada siswa dalam daftar menunggu.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingUsers;
