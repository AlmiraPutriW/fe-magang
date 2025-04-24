import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { getSiswaByAdmin } from "../api/auth";
import "../css/Students.css"; // Menggunakan CSS yang sama untuk konsistensi

const SiswaAmpuan = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 8; // Menampilkan 5 siswa per halaman
    const navigate = useNavigate(); // Untuk navigasi ke halaman detail siswa

    useEffect(() => {
        const fetchAmpuanAdmin = async () => {
            try {
                const studentsData = await getSiswaByAdmin();
                console.log("📢 Data siswa yang diterima:", studentsData);

                if (!Array.isArray(studentsData)) {
                    throw new Error("Data siswa tidak valid, pastikan API mengembalikan array.");
                }

                setStudents(studentsData);
            } catch (err) {
                console.error("❌ Error fetching students:", err);
                setError(err.message || "Terjadi kesalahan saat mengambil data.");
                setStudents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAmpuanAdmin();
    }, []);

    // Hitung jumlah halaman
    const totalPages = Math.ceil(students.length / studentsPerPage);
    
    // Hitung indeks awal dan akhir untuk data yang akan ditampilkan
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

    // Fungsi untuk navigasi ke halaman detail siswa
    const handleViewStudent = (id) => {
        navigate(`/siswa/${id}`);
    };

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
            <h2>Daftar Siswa Ampuan</h2>
            
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
                        {currentStudents.length > 0 ? (
                            currentStudents.map((student, index) => (
                                <tr key={student.id}>
                                    <td>{indexOfFirstStudent + index + 1}</td>
                                    <td>{student.name}</td>
                                    <td>{student.nim}</td>
                                    <td>{student.jurusan}</td>
                                    <td>{student.universitas}</td>
                                    <td>{student.email || "Email tidak tersedia"}</td>
                                    <td>
                                        <button className="view-button" onClick={() => handleViewStudent(student.id)}>
                                            Lihat Siswa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">Tidak ada siswa ampuan.</td>
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

export default SiswaAmpuan;
