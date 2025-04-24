import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

// 🔐 Fungsi login
export const login = async (email, password) => {
  return axios.post(`${API_URL}/api/auth/login`, { email, password }, { withCredentials: true });
};

// 🔐 Fungsi register superadmin
export const registerSuperadmin = async (nama, nip, bidang, jabatan, email, password) => {
  return axios.post(`${API_URL}/api/auth/register-superadmin`, { nama, nip, bidang, jabatan, email, password });
};

// 🔐 Fungsi logout
export const logout = async () => {
  return axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
};

// 🔥 Fungsi GET profil user berdasarkan ID
export const getProfileById = async (id) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1]; // Ambil token dari cookie

  if (!token) {
    throw new Error("Token tidak ditemukan, silakan login kembali.");
  }

  return axios.get(`${API_URL}/api/auth/profilebyId/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};

// ✅ Fungsi GET semua siswa
export const getAllSiswa = async () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];

  if (!token) {
    throw new Error("Token tidak ditemukan, silakan login kembali.");
  }

  return axios.get(`${API_URL}/api/auth/AllUser`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};

// 🔎 Fungsi GET siswa yang sudah diverifikasi
export const getVerifiedSiswa = async () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];

  if (!token) {
    throw new Error("Token tidak ditemukan, silakan login kembali.");
  }

  return axios.get(`${API_URL}/api/validasi/verified-students`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
};

// 🔎 Fungsi GET siswa yang sudah diverifikasi
export const getPendingSiswa = async () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];

  if (!token) {
    throw new Error("Token tidak ditemukan, silakan login kembali.");
  }

  return axios.get(`${API_URL}/api/validasi/pending-students`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
};

// 🔎 Fungsi GET siswa yang belum diverifikasi
export const getUnverifiedSiswa = async () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];

  if (!token) {
    throw new Error("Token tidak ditemukan, silakan login kembali.");
  }

  return axios.get(`${API_URL}/api/validasi/rejected-students`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
};

// Fungsi untuk mengambil token dari cookies
const getTokenFromCookies = () => {
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((row) => row.startsWith("accessToken="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
};

export const getSiswaByAdmin = async () => {
  try {
    const token = getTokenFromCookies();

    if (!token) {
      throw new Error("❌ Token tidak ditemukan di cookies! Silakan login ulang.");
    }

    let decodedToken;
    try {
      const payloadBase64 = token.split(".")[1]; // Ambil bagian payload token
      decodedToken = JSON.parse(atob(payloadBase64)); // Decode token
      console.log("📜 Decoded Token:", decodedToken);
    } catch (error) {
      console.error("⚠ Gagal decode token:", error.message);
      throw new Error("🚨 Token tidak valid! Silakan login ulang.");
    }

    // Ambil ID admin dari token
    const adminId = Number(decodedToken.id);
    if (!adminId || isNaN(adminId)) {
      throw new Error("🛑 Admin ID tidak valid di dalam token.");
    }

    console.log("✅ Menggunakan ID Admin langsung dari token:", adminId);

    // Pastikan API URL sudah diatur
    const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    const url = `${API_URL}/api/auth/getbyadmin/${adminId}`;
    console.log(`🔗 Fetching from: ${url}`);

    const headers = { Authorization: `Bearer ${token}` };

    // Request ke API
    const response = await axios.get(url, { headers, withCredentials: true });

    console.log("📢 API Response (Admin):", response.data);

    // Pastikan format data sesuai
    if (!response.data || !Array.isArray(response.data.data)) {
      throw new Error("❌ Format data API tidak sesuai atau kosong.");
    }

    return response.data.data;
  } catch (error) {
    console.error("❌ Error fetching students:", error);

    if (error.response) {
      console.error("🛑 Server Response:", error.response.data);
      console.error("🛑 Status Code:", error.response.status);
    } else if (error.request) {
      console.error("⚠ Tidak ada response dari server.");
    } else {
      console.error("🚨 Error saat mengirim request:", error.message);
    }

    throw new Error(
      error.response?.data?.message ||
      `Terjadi kesalahan saat mengambil data siswa. (Status: ${error.response?.status || "Unknown"})`
    );
  }
};

// ✅ Fungsi untuk verifikasi siswa oleh admin/superadmin
export const verifySiswa = async (id, reason) => {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Token tidak ditemukan, silakan login kembali.");
  }

  try {
    const res = await axios.put(
      `${API_URL}/api/validasi/verify-siswa/${id}`,
      { reason },
      { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
    );

    console.log("✅ Siswa berhasil diverifikasi:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Gagal memverifikasi siswa:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Verifikasi gagal");
  }
};

// ❌ Fungsi untuk menolak siswa oleh admin
export const rejectSiswa = async (id, reason) => {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Token tidak ditemukan, silakan login kembali.");
  }

  try {
    const res = await axios.put(
      `${API_URL}/api/validasi/reject-siswa/${id}`,
      { reason },
      { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
    );

    console.log("🚫 Siswa berhasil ditolak:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Gagal menolak siswa:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Penolakan gagal");
  }
};
