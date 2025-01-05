import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Attendance.css";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Attendance = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [batch, setBatch] = useState("ALL");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAttendanceData(batch, date);
  }, [batch, date]);

  const fetchAttendanceData = async (selectedBatch, selectedDate) => {
    setLoading(true);
    setError("");
    setAttendanceData([]); // Clear data while loading new data.

    try {
      const response = await fetch(
        `https://tkrcet-backend.onrender.com/attendance/fetch-attendance?batch=${selectedBatch}&date=${selectedDate}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch attendance data: ${response.status}`);
      }

      const { data } = await response.json();
      if (Array.isArray(data)) {
        setAttendanceData(data);
      } else {
        throw new Error("Invalid data format: Expected an array.");
      }
    } catch (err) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    const queryParams = new URLSearchParams({
      date: row.date,
      periods: row.periods.join(","),
    }).toString();
    navigate(`/mark?${queryParams}`);
  };

  return (
    <div>
      <Header />
      <NavBar />
      <MobileNav />
      <div className="content">
        <div className="title-bar">
          <div className="batch-date-selectors">
            <label htmlFor="batch">Batch: </label>
            <select
              id="batch"
              className="batch-selector"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
            >
              <option value="ALL">ALL</option>
              <option value="Batch1">Batch 1</option>
              <option value="Batch2">Batch 2</option>
            </select>
            <label htmlFor="date">Date: </label>
            <input
              type="date"
              id="date"
              className="date-selector"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Link to={`/mark?date=${date}`} className="go">
              GO
            </Link>
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : attendanceData.length > 0 ? (
          <div className="attendance-table-wrapper">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Periods</th>
                  <th>Topic</th>
                  <th>Remarks</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record, index) => (
                  <tr key={index}>
                    <td>{record.subject}</td>
                    <td>{record.date}</td>
                    <td>{record.periods.join(", ")}</td>
                    <td>{record.topic}</td>
                    <td>{record.remarks}</td>
                    <td>
                      <button onClick={() => handleEdit(record)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No attendance records found for the selected batch and date.</p>
        )}
      </div>
    </div>
  );
};

export default Attendance;
