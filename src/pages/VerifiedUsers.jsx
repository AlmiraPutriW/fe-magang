import React, { useState, useEffect } from "react";
import { getVerifiedSiswa } from "../api/auth";
import "../css/Students.css";

const VerifiedUsers = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 10; // Menampilkan 5 siswa per halaman

    useEffect(() => {
        const fetchVerifiedStudents = async () => {
            try {
                const response = await getVerifiedSiswa();
                console.log("📢 Response dari API:", response);

                if (response.data && response.data.verifiedStudents) {
                    setStudents(response.data.verifiedStudents);
                } else {
                    throw new Error("Format data API tidak sesuai.");
                }
            } catch (err) {
                console.error("❌ Error:", err);
                setError(err.message || "Terjadi kesalahan saat mengambil data.");
            } finally {
                setLoading(false);
            }
        };

        fetchVerifiedStudents();
    }, []);

    // Hitung jumlah halaman
    const totalPages = Math.ceil(students.length / studentsPerPage);
    
    // Hitung indeks awal dan akhir untuk data yang akan ditampilkan
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

    // Fungsi untuk mengubah halaman
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Buat pagination dengan maksimal 5 angka di tengahnya
    const renderPagination = () => {
        let pages = [];
        for (let i = 1; i <= Math.min(5, totalPages); i++) {
            pages.push(
                <button 
                    key={i} 
                    className={`page-button ${currentPage === i ? "active" : ""}`}
                    onClick={() => goToPage(i)}
                >
                    {i}
                </button>
            );
        }
        
        // Jika total halaman lebih dari 5, tambahkan "..."
        if (totalPages > 5) {
            pages.push(<span key="dots" className="dots">...</span>);
        }

        return pages;
    };

    return (
        <div className="students-container">
            <h2>Daftar Siswa yang Terverifikasi</h2>
            
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
                        </tr>
                    </thead>
                    <tbody>
                        {currentStudents.length > 0 ? (
                            currentStudents.map((student, index) => (
                                <tr key={student.id}>
                                    <td>{indexOfFirstStudent + index + 1}</td>
                                    <td>{student.name}</td>
                                    <td>{student.nim}</td>
                                    <td>{student.jurusan}</td>
                                    <td>{student.universitas}</td>
                                    <td>{student.email || "Email tidak tersedia"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">Tidak ada siswa yang tersedia</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
                <button 
                    className="prev-button" 
                    onClick={() => setCurrentPage(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    Prev
                </button>

                {renderPagination()}

                <button 
                    className="next-button" 
                    onClick={() => setCurrentPage(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default VerifiedUsers;
