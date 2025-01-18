import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Attendance.css";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Attendance = () => {
  const location = useLocation();

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const programYear = queryParams.get("programYear");
  const department = queryParams.get("department");
  const section = queryParams.get("section");
  const subject = queryParams.get("subject");

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [batch, setBatch] = useState("ALL");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch attendance with all details
  const fetchAttendanceWithDetails = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://tkrcet-backend.onrender.com/Attendance/fetch?date=${date}&programYear=${programYear}&department=${department}&section=${section}&subject=${subject}`
      );

      if (!response.ok) {
        throw new Error(`No attendance record found: ${response.status}`);
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

  // Fetch attendance by date only
  const fetchAttendanceByDate = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://tkrcet-backend.onrender.com/Attendance/date?date=${date}`
      );

      if (!response.ok) {
        throw new Error(`No attendance record found for the date: ${response.status}`);
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

  // Automatically fetch attendance when date changes
  useEffect(() => {
    if (programYear && department && section && subject) {
      fetchAttendanceWithDetails();
    } else {
      fetchAttendanceByDate();
    }
  }, [date]); // Trigger whenever `date` changes

  const handleEdit = (record) => {
    alert(`Edit functionality for ${record.subject} is not implemented yet.`);
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
          </div>
        </div>
        <div className="class-info">
          <h3>Selected Class Details</h3>
          <p>Program Year: {programYear}</p>
          <p>Department: {department}</p>
          <p>Section: {section}</p>
          <p>Subject: {subject}</p>
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
                      <button onClick={() => handleEdit(record)}>Edit</button>
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
