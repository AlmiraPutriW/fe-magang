import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, parseISO, isWeekend } from "date-fns";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "../css/jadwaluser.css";

const ScheduleView = () => {
    const { id: paramId } = useParams();
    const [schedules, setSchedules] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = Cookies.get("accessToken");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserId(decoded.id);
            } catch (err) {
                console.error("Gagal mendekode token.", err);
            }
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchSchedules(userId);
            fetchHolidays();
        }
    }, [userId]);

    const fetchSchedules = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/schedule/student/${id}`);
            setSchedules(response.data.schedules);
        } catch (err) {
            setError("Gagal mengambil data jadwal.");
        }
    };

    const fetchHolidays = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/holiday/");
            const holidayDates = response.data.holidays.map((holiday) => parseISO(holiday.date));
            setHolidays(holidayDates);
        } catch (err) {
            console.error("Gagal mengambil data hari libur.");
        }
    };

    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const formattedDate = format(date, "yyyy-MM-dd");
            const schedule = schedules.find((s) => s.date === formattedDate);

            if (schedule) {
                switch (schedule.category) {
                    case "Masuk": return "bg-green-200";
                    case "Magang Dari Rumah": return "bg-gray-300";
                    case "Masuk Pagi": return "bg-orange-200";
                    case "Masuk Siang": return "bg-blue-200";
                    case "Masuk Pagi Singkat": return "bg-yellow-300";
                    case "Masuk Siang Singkat": return "bg-yellow-500";
                    case "Libur": return "bg-red-200";
                    default: return "";
                }
            }

            if (holidays.some(holiday => holiday.getTime() === date.getTime()) || isWeekend(date)) {
                return "holiday-date";
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold">Jadwal Siswa</h1>
            {error && <p className="text-red-500">{error}</p>}
            <Calendar tileClassName={tileClassName} />
            <h2 className="mt-4 text-lg font-semibold">Keterangan:</h2>
            <div className="legend">
                <div className="flex items-center"><span className="legend-box bg-green-200"></span> Masuk Sesuai Jam Kerja</div>
                <div className="flex items-center"><span className="legend-box bg-gray-300"></span> Magang Dari Rumah</div>
                <div className="flex items-center"><span className="legend-box bg-orange-200"></span> Masuk Pagi (07.30 - 12.00 WIB)</div>
                <div className="flex items-center"><span className="legend-box bg-blue-200"></span> Masuk Siang (12.00 - 16.30 WIB)</div>
                <div className="flex items-center"><span className="legend-box bg-yellow-300"></span> Masuk 07.30 - 11.00 WIB</div>
                <div className="flex items-center"><span className="legend-box bg-yellow-500"></span> Masuk 11.00 - 14.30 WIB</div>
                <div className="flex items-center"><span className="legend-box bg-red-200"></span> Libur</div>
            </div>
        </div>
    );
};

export default ScheduleView;