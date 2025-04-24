import React, { useState, useEffect } from "react";
import { getVerifiedSiswa, getProfileById } from "../api/auth"; // Import getProfileById to fetch the pengampu data
import "../css/Students.css";

const VerifiedUsersbySuper = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pengampuMap, setPengampuMap] = useState({}); // To store the pengampu names
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 10;

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

    useEffect(() => {
        if (students.length > 0) {
            const fetchPengampuData = async () => {
                try {
                    const pengampuData = {};
                    for (const student of students) {
                        const adminId = student.ampuanAdminId;

                        // Check if amuanAdminId exists before making the API request
                        if (adminId) {
                            try {
                                const profile = await getProfileById(adminId);
                                console.log(`Fetching profile for adminId ${adminId}:`, profile);

                                // Log the full response for debugging
                                console.log("Profile data:", profile.data);

                                // Correctly access the 'name' field from the profile data
                                const pengampuName = profile.data?.name;

                                // If pengampuName exists, update the pengampuData object
                                if (pengampuName) {
                                    pengampuData[adminId] = pengampuName;
                                } else {
                                    console.warn(`No name found for adminId: ${adminId}`);
                                    pengampuData[adminId] = "Nama pengampu tidak tersedia"; // Default value
                                }
                            } catch (err) {
                                console.error(`❌ Gagal memuat data pengampu untuk ${student.name}:`, err);
                                pengampuData[adminId] = "Gagal memuat data pengampu"; // Default error value
                            }
                        } else {
                            console.warn(`Student ${student.name} does not have an amuanAdminId.`);
                        }
                    }
                    setPengampuMap(pengampuData);
                } catch (err) {
                    console.error("❌ Gagal memuat data pengampu:", err);
                    setError("Gagal memuat data pengampu.");
                }
            };

            fetchPengampuData();
        }
    }, [students]); // This will trigger when `students` changes

    const totalPages = Math.ceil(students.length / studentsPerPage);
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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
                            <th>Nama Pengampu</th> {/* Added column for Pengampu name */}
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
                                    <td>{pengampuMap[student.ampuanAdminId] || "Nama Pengampu Tidak Tersedia"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">Tidak ada siswa yang tersedia</td>
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

export default VerifiedUsersbySuper;
