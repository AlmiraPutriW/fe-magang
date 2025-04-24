import { useEffect, useState } from "react";
import axios from "axios";
import "../css/hariLibur.css";

const API_URL = "http://127.0.0.1:8000/api/holiday/";

export default function HolidayApp() {
  const [holidays, setHolidays] = useState([]);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const response = await axios.get(API_URL);
      setHolidays(response.data.holidays);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  const addHoliday = async () => {
    if (!date || !description) {
      alert("Tanggal dan deskripsi wajib diisi.");
      return;
    }
    try {
      await axios.post(API_URL, { date, description });
      setDate("");
      setDescription("");
      fetchHolidays();
    } catch (error) {
      console.error("Error adding holiday:", error);
    }
  };

  const deleteHoliday = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}`);
      setHolidays((prevHolidays) => prevHolidays.filter((holiday) => holiday.id !== id));
    } catch (error) {
      console.error("Error deleting holiday:", error);
    }
  };

  return (
    <div className="holiday-container">
      <h1 className="holiday-title">Manajemen Hari Libur</h1>
      <div className="holiday-input-container">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="holiday-input"
        />
        <input
          type="text"
          placeholder="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="holiday-input"
        />
        <button onClick={addHoliday} className="holiday-button">Tambah</button>
      </div>
      <div className="holiday-list">
        {holidays.length > 0 ? (
          holidays.map((holiday) => (
            <div key={holiday.id} className="holiday-item">
              <div>
                <p className="holiday-date">{holiday.date}</p>
                <p className="holiday-description">{holiday.description}</p>
              </div>
              <button onClick={() => deleteHoliday(holiday.id)} className="holiday-delete-button">
                Hapus
              </button>
            </div>
          ))
        ) : (
          <p className="no-holiday">Tidak ada hari libur yang tersedia.</p>
        )}
      </div>
    </div>
  );
}