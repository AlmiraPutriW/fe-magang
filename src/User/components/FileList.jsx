import React, { useEffect, useState } from "react";
import { getUserFiles, getUserIdFromCookie } from "../services/fileService";
import "../css/Administrasi.css";

const FileList = () => {
    const [files, setFiles] = useState([]);
    const userId = getUserIdFromCookie();

    useEffect(() => {
        const fetchFiles = async () => {
            const userFiles = await getUserFiles();
            setFiles(userFiles);
        };

        fetchFiles();
    }, []);

    return (
        <div className="file-list-wrapper">
            <div className="file-card">
                <h2 className="file-title">🎉 Selamat, kamu berhasil menyelesaikan program! 🎉</h2>
                <p className="file-subtitle">
                    Silakan download sertifikat dan surat kelulusan sebagai bukti resmi keikutsertaanmu di program magang di<b> Dinas Komunikasi dan Informatika SP Surakarta.</b>
                </p>

                {files.length > 0 ? (
                    <ul className="file-list">
                        {files.map((file) => (
                            <li key={file.id} className="file-item">
                                <span className="file-name">📄 {file.nama} {file.type}</span>
                                <a
                                    href={`http://127.0.0.1:8000/api/administrasi/download/${file.id}?userId=${userId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <button className="download-button">⬇ Download {file.nama}</button>
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-files">Tidak ada file tersedia.</p>
                )}
            </div>
        </div>
    );
};

export default FileList;
