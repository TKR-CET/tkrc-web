import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";
import "./Attendance.css"
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
        `https://tkrcet-backend.onrender.com/attendance/fetch-attendance?batch=${selectedBatch}&date=${selectedDate}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch attendance data: ${response.status}`);
      }

      const { data } = await response.json();
      setAttendanceData(data || []);
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
      <NavBar />
      <MobileNav />
      <div>
        <label>Batch:</label>
        <select value={batch} onChange={(e) => setBatch(e.target.value)}>
          <option value="ALL">ALL</option>
          <option value="Batch1">Batch 1</option>
          <option value="Batch2">Batch 2</option>
        </select>
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Link to={`/mark?date=${date}`} className="go">
          GO
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Date</th>
              <th>Periods</th>
              <th>Absentees</th>
              <th>Topic</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record, index) => (
              <tr key={index}>
                <td>{record.subject}</td>
                <td>{record.date}</td>
                <td>{record.periods.join(", ")}</td> {/* Display periods */}
                <td>
                  {record.attendance
                    .filter((att) => att.status === "absent")
                    .map((att) => att.rollNumber)
                    .join(", ")}
                </td>
                <td>{record.topic}</td>
                <td>{record.remarks}</td>
                <td>
                  <Link to={`/mark?date=${record.date}&edit=true`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Attendance;
