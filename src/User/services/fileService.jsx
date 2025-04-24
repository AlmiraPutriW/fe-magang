import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Pastikan jwt-decode diinstall dengan npm install jwt-decode

const API_URL = "http://127.0.0.1:8000/api/administrasi";

export const getUserIdFromCookie = () => {
    const accessToken = Cookies.get("accessToken");
    console.log("🔍 AccessToken:", accessToken); // Debugging

    if (!accessToken) {
        console.error("⚠️ AccessToken tidak ditemukan di cookie.");
        return null;
    }

    try {
        const payload = jwtDecode(accessToken);
        console.log("✅ Extracted userId:", payload.id); // Pastikan ini muncul
        return payload.id;
    } catch (error) {
        console.error("❌ Gagal decode accessToken:", error);
        return null;
    }
};


// ✅ Fungsi untuk mengambil daftar file milik user
export const getUserFiles = async () => {
    const userId = getUserIdFromCookie();
    console.log("🔍 userId sebelum request:", userId); // Debugging

    if (!userId) {
        console.error("❌ UserId tidak valid atau undefined");
        return [];
    }

    try {
        const response = await axios.get(`${API_URL}/user/${userId}`, {
            headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
        });

        console.log("✅ Data file berhasil diambil:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("❌ Error fetching user files:", error);
        return [];
    }
};

export const downloadFile = async (fileId) => {
    const userId = getUserIdFromCookie(); // Ambil userId dari token/cookie

    if (!userId) {
        console.error("❌ UserId tidak ditemukan!");
        return;
    }

    const downloadUrl = `${API_URL}/administrasi/download/${fileId}?userId=${userId}`;
    console.log("📡 Fetching URL:", downloadUrl);

    try {
        const response = await axios.get(downloadUrl, {
            responseType: "blob", // Untuk file
            headers: {
                Authorization: `Bearer ${Cookies.get("accessToken")}`,
                "x-user-id": userId, // Pastikan dikirim di header
            },
        });

        console.log("✅ Response headers:", response.headers);

        let fileName = "downloaded_file";
        const contentDisposition = response.headers["content-disposition"];
        if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+)"/);
            if (match && match.length > 1) {
                fileName = match[1];
            }
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        console.log("✅ File berhasil diunduh:", fileName);
    } catch (error) {
        console.error("❌ Error downloading file:", error);
    }
};
