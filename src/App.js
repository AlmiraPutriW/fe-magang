import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/RegisterUser";
import Dashboard from "./components/Dashboard";
import CreateAdmin from "./pages/CreateAdmin";
import PendingUsers from "./pages/PendingUsers";
import VerifiedUsers from "./pages/VerifiedUsers";
import UnverifiedUsers from "./pages/UnverifiedUsers";
import SiswaAmpuan from "./pages/SiswaByAdmin";
import DetailSiswa from "./pages/DetailSiswa";
import UploadSertifikat from "./pages/UploadSertifikat";
import LaporanSiswa from "./pages/LaporanSiswa";
import AbsensiSiswa from "./pages/AbsensiSiswa";
import DetailAbsensi from "./pages/DetailAbsensi";
import DetailLaporanSiswa from "./pages/DetailLaporan";
import Layout from "./components/Layout";
import ProfileSuperadmin from "./components/ProfileSuperadmin";
import FormLaporan from "./User/pages/LaporanForm"; // Import Form Laporan
import LaporanUser from "./User/pages/LaporanUser";
import AbsensiUser from "./User/pages/AbsensiUser";
import Administrasi from "./User/pages/Administrasi";
import HolidayApp from "./pages/createHolidays";
import SchedulePage from "./pages/createJadwal";
import ProfileUser from "./components/ProfileUser";
import ScheduleView from "./User/pages/JadwalUser";
import DetailLaporan from "./User/pages/DetailLaporan";
import VerifiedUsersbySuper from "./pages/VerifiedBySuper";

function App() {
  const { user, isLoading } = useContext(AuthContext);
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  if (isLoading) {
    return <div>Loading...</div>; // Tampilkan loading screen saat memeriksa login
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {user && (
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pending-users" element={<PendingUsers />} />
          <Route path="/create-admin" element={<CreateAdmin />} />
          <Route path="/verified-users" element={<VerifiedUsers />} />
          <Route path="/unverified-users" element={<UnverifiedUsers />} />
          <Route path="/ampuanAdmin" element={<SiswaAmpuan />} />
          <Route path="/siswa/:id" element={<DetailSiswa />} />
          <Route path="/siswa/:id/upload-sertifikat" element={<UploadSertifikat />} />
          <Route path="/siswa/:id/laporan" element={<LaporanSiswa />} />
          <Route path="/siswa/:siswaId/absensi" element={<AbsensiSiswa />} />
          <Route path="/laporan/:id" element={<DetailLaporanSiswa />} />
          <Route path="/absensi/detail/:id" element={<DetailAbsensi />} />
          <Route path="/admin-profile" element={<ProfileSuperadmin />} />
          <Route path="/form-laporan" element={<FormLaporan />} /> {/* Route baru */}
          <Route path="/laporan-user" element={<LaporanUser/>}/>
          <Route path="/absensi-user" element={<AbsensiUser/>} />
          <Route path="/administrasi-user" element={<Administrasi/>} />
          <Route path="/create-holidays" element={<HolidayApp/>} />
          <Route path="/siswa/:id/jadwal" element={<SchedulePage/>} />
          <Route path="/profil-user" element={<ProfileUser/>} />
          <Route path="/jadwal-user" element={<ScheduleView/>} />
          <Route path="/detail-laporan/:id" element={<DetailLaporan />} />
          <Route path="/verified-user-bySuper" element={<VerifiedUsersbySuper />} />
        </Route>
      )}

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
