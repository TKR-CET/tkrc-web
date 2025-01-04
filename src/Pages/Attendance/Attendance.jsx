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
        ` http://127.0.0.1:8000/api/attendance?batch=${selectedBatch}&date=${selectedDate}
`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch attendance data: ${response.status}`);
      }

      const { data } = await response.json();
      console.log("Fetched Data:", data);

      if (Array.isArray(data)) {
        setAttendanceData(data);
      } else {
        throw new Error("Invalid data format: Expected an array.");
      }
    } catch (err) {
      console.error(err);
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
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Absentees</th>
                  <th>Topic</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record, index) => (
                  <tr key={index}>
                    <td>{record.subject}</td>
                    <td>{record.date}</td>
                    <td>
                      {record.attendance
                        .filter((att) => att.status === "absent")
                        .map((att) => att.rollNumber)
                        .join(", ")}
                    </td>
                    <td>{record.topic}</td>
                    <td>{record.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
