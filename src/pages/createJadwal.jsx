import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { isWeekend, format, parseISO } from "date-fns";
import "../css/jadwal.css";

const SchedulePage = () => {
    const { id } = useParams();
    const [selectedDates, setSelectedDates] = useState([]);
    const [category, setCategory] = useState("Masuk");
    const [schedules, setSchedules] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [error, setError] = useState(null);
    const [editingScheduleId, setEditingScheduleId] = useState(null);

    useEffect(() => {
        fetchSchedules();
        fetchHolidays();
    }, []);

    const fetchSchedules = async () => {
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

    const isDisabledDate = (date) => {
        return isWeekend(date) || holidays.some((holiday) => holiday.getTime() === date.getTime());
    };

    const handleDateChange = (date) => {
        if (isDisabledDate(date)) return;
        
        const formattedDate = format(date, "yyyy-MM-dd");
        const existingSchedule = schedules.find((s) => s.date === formattedDate);
        
        if (existingSchedule) {
            setEditingScheduleId(existingSchedule.id);
            setCategory(existingSchedule.category);
            setSelectedDates([date]);
        } else {
            setEditingScheduleId(null);
            setCategory("Masuk");
            setSelectedDates((prev) => [...prev, date]);
        }
    };

    const handleRemoveDate = (dateToRemove) => {
        setSelectedDates((prev) => prev.filter(date => date.getTime() !== dateToRemove.getTime()));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (selectedDates.length === 0) {
            setError("Pilih setidaknya satu tanggal.");
            return;
        }

        try {
            if (editingScheduleId) {
                await axios.put(`http://127.0.0.1:8000/api/schedule/update/${editingScheduleId}`, {
                    date: format(selectedDates[0], "yyyy-MM-dd"),
                    category,
                });
                alert("Jadwal berhasil diperbarui");
            } else {
                await axios.post(`http://127.0.0.1:8000/api/schedule/${id}`, {
                    dates: selectedDates.map((date) => format(date, "yyyy-MM-dd")),
                    category,
                });
                alert("Jadwal berhasil ditambahkan");
            }
            
            setSelectedDates([]);
            fetchSchedules();
        } catch (err) {
            setError(err.response?.data?.message || "Terjadi kesalahan.");
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

            if (holidays.some(holiday => format(holiday, "yyyy-MM-dd") === formattedDate) || isWeekend(date)) {
                return "holiday-date";
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-xl">Kelola Jadwal Siswa</h1>
            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="mb-6">
                <label>Pilih Tanggal</label>
                <Calendar 
                    onClickDay={handleDateChange} 
                    tileClassName={tileClassName} 
                />

                {selectedDates.length > 0 && (
                    <div className="selected-dates mt-3">
                        <h3 className="text-md font-semibold">Tanggal yang dipilih:</h3>
                        <div className="flex">
                            {selectedDates.map((date, index) => (
                                <span key={index} className="selected-date">
                                    {format(date, "dd MMM yyyy")}
                                    <button type="button" onClick={() => handleRemoveDate(date)} className="text-red-500">❌</button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <label>Kategori</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Masuk">Masuk Sesuai Jam Kerja</option>
                    <option value="Magang Dari Rumah">Magang Dari Rumah</option>
                    <option value="Masuk Pagi">Masuk Pagi (07.30 - 12.00 WIB)</option>
                    <option value="Masuk Siang">Masuk Siang (12.00 - 16.30 WIB)</option>
                    <option value="Masuk Pagi Singkat">Masuk Jam 07.30 - 11.00 WIB</option>
                    <option value="Masuk Siang Singkat">Masuk Jam 11.00 - 14.30 WIB</option>
                    <option value="Libur">Libur</option>
                </select>

                <button type="submit" className="submit-schedule-btn">
                    {editingScheduleId ? "Update Jadwal" : "Tambah Jadwal"}
                </button>
            </form>
        </div>
    );
};

export default SchedulePage;
