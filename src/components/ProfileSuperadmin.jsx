import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import "../css/ProfileSuperadmin.css";

const ProfileSuperadmin = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = Cookies.get("accessToken");
                if (!token) {
                    navigate("/login");
                    return;
                }
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;
                const response = await fetch(`http://127.0.0.1:8000/api/auth/profilebyId/${userId}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Gagal mengambil data profil");
                }
                const data = await response.json();
                setProfile(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

    return (
        <div className="container">
            <h2 className="title">Informasi Pengguna</h2>

            <div className="form-group">
                <label className="label">Nama</label>
                <input type="text" className="input-field" value={profile.name} disabled />
            </div>

            <div className="form-group">
                <label className="label">NIP</label>
                <input type="text" className="input-field" value={profile.nip || "-"} disabled />
            </div>

            <div className="form-group">
                <label className="label">Bidang</label>
                <input type="text" className="input-field" value={profile.bidang || "-"} disabled />
            </div>

            <div className="form-group">
                <label className="label">Jabatan</label>
                <input type="text" className="input-field" value={profile.jabatan || "-"} disabled />
            </div>

            <div className="form-group">
                <label className="label">Email</label>
                <input type="text" className="input-field" value={profile.email} disabled />
            </div>


        </div>
    );
};

export default ProfileSuperadmin;
