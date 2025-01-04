import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Attendance.css"; 
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav.jsx";

const Attendance = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [batch, setBatch] = useState("ALL");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAttendanceData(batch, date);
  }, [batch, date]);

  const fetchAttendanceData = async (selectedBatch, selectedDate) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/attendance/fetch-attendance?date=${selectedDate}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch attendance data: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format: Expected an array.");
      }

      setAttendanceData(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>
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
        <ul className="container">
          <li className="section">Subject: CAD/CAM Lab</li>
          <li className="section">Section: IV ME I A (2024-25)</li>
        </ul>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="attendance-table-wrapper">
            {attendanceData.length > 0 ? (
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Date</th>
                    <th>P</th>
                    <th>Absentees</th>
                    <th>Topic</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record, index) => (
                    <tr key={index}>
                      <td>{record.class}</td>
                      <td>{record.date}</td>
                      <td>{record.present}</td>
                      <td>{record.absentees}</td>
                      <td>{record.topic}</td>
                      <td>{record.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No attendance data available for the selected date.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
