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

  const currentDate = new Date().toISOString().split("T")[0]; // Current date in 'YYYY-MM-DD' format

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
        throw new Error(`No attendance record found : ${response.status}`);
      }

      const { data } = await response.json();

      if (Array.isArray(data)) {
        const processedData = data.map((record) => ({
          ...record,
          absentees: record.attendance
            .filter((student) => student.status === "absent")
            .map((student) => student.rollNumber),
        }));
        setAttendanceData(processedData);
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
      subject: row.subject,
      topic: row.topic,
      remarks: row.remarks || "",
    }).toString();

    const attendanceData = row.attendance
      .map((student) => `${student.rollNumber}:${student.status}`)
      .join(",");

    window.location.href = `/mark?${queryParams}&attendance=${encodeURIComponent(attendanceData)}`;
  };

  const isDateInPast = (attendanceDate) => {
  const currentDate = new Date();
  const recordDate = new Date(attendanceDate);
  currentDate.setHours(0, 0, 0, 0);
  recordDate.setHours(0, 0, 0, 0);

  return recordDate < currentDate; // Return true if the record date is in the past
};

const isDateInFuture = (attendanceDate) => {
  const currentDate = new Date();
  const recordDate = new Date(attendanceDate);
  currentDate.setHours(0, 0, 0, 0);
  recordDate.setHours(0, 0, 0, 0);

  return recordDate > currentDate; // Return true if the record date is in the future
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
                  <th>Periods</th>
                  <th>Topic</th>
                  <th>Absentees</th>
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
                    <td>
                      {record.absentees.length > 0
                        ? record.absentees.join(", ")
                        : "None"}
                    </td>
                    <td>
  {isDateInPast(record.date) || isDateInFuture(record.date) ? (
    "Not Editable"
  ) : (
    <button onClick={() => handleEdit(record)}>Edit</button>
  )}
</td>
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
