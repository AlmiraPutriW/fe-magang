import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/LaporanForm.css";

// Fungsi untuk ambil profil user berdasarkan ID
const getProfileById = async (id) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  if (!token) {
    throw new Error("Token tidak ditemukan, silakan login kembali.");
  }

  return axios.get(`http://127.0.0.1:8000/api/auth/profilebyId/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};

const ReportForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const token = getCookie("accessToken");

  // Decode token dan ambil ID
  useEffect(() => {
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedData = JSON.parse(atob(base64));
        console.log("Decoded Token:", decodedData);
        setUserId(decodedData.id); // <- perbaikan di sini
      } catch (err) {
        console.error("Gagal decode token:", err);
      }
    }
  }, [token]);

  // Ambil profil user dan set ke form
  useEffect(() => {
    if (userId) {
      getProfileById(userId)
        .then((res) => {
          console.log("User profile:", res.data);
          setValue("name", res.data.name);
          setValue("university", res.data.universitas);
        })
        .catch((err) => {
          console.error("Gagal ambil profil:", err);
        });
    }
  }, [userId, setValue]);

  const onSubmit = async (data) => {
    if (!token) {
      alert("Anda belum login! Silakan login terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        name: data.name,
        university: data.university,
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/reports/",
        requestData,
        { headers }
      );

      Swal.fire({
        title: "Berhasil!",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/laporan-user");
      });

      reset();
    } catch (error) {
      Swal.fire({
        title: "Terjadi kesalahan",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat mengirim laporan",
        icon: "error",
        confirmButtonText: "Tutup",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Form Laporan</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Nama Pelapor</label>
          <input type="text" readOnly {...register("name")} />
        </div>

        <div className="form-group">
          <label>Universitas</label>
          <input type="text" readOnly {...register("university")} />
        </div>

        <div className="date-group">
          <div className="form-group">
            <label>Tanggal Mulai</label>
            <input
              type="date"
              {...register("startDate", {
                required: "Tanggal mulai wajib diisi",
              })}
            />
            {errors.startDate && (
              <small className="error">{errors.startDate.message}</small>
            )}
          </div>

          <span className="separator">-</span>

          <div className="form-group">
            <label>Tanggal Selesai</label>
            <input
              type="date"
              {...register("endDate", {
                required: "Tanggal selesai wajib diisi",
              })}
            />
            {errors.endDate && (
              <small className="error">{errors.endDate.message}</small>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Judul Laporan</label>
          <input
            type="text"
            placeholder="Masukkan Judul Laporan"
            {...register("title", { required: "Judul wajib diisi" })}
          />
          {errors.title && (
            <small className="error">{errors.title.message}</small>
          )}
        </div>

        <div className="form-group">
          <label>Deskripsi Laporan</label>
          <textarea
            placeholder="Masukkan deskripsi laporan"
            {...register("description", { required: "Deskripsi wajib diisi" })}
          ></textarea>
          {errors.description && (
            <small className="error">{errors.description.message}</small>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Mengirim..." : "Buat Laporan"}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
