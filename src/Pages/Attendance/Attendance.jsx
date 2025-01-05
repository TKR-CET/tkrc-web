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
    setAttendanceData([]);

    try {
      const response = await fetch(
        `https://tkrcet-backend.onrender.com/attendance/fetch-attendance?date=${selectedDate}`
      );

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || "Failed to fetch attendance data.");
      }

      const { data } = await response.json();
      setAttendanceData(data);
    } catch (err) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record, period) => {
    navigate(`/mark?date=${record.date}&period=${period}`);
  };

  const handleUpdate = async (rollNumber, updatedData, period) => {
    try {
      const response = await fetch("https://tkrcet-backend.onrender.com/attendance/update-attendance", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          periods: [period],
          rollNumbers: [rollNumber],
          ...updatedData,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || "Failed to update attendance.");
      }

      // Refresh data after update
      fetchAttendanceData(batch, date);
    } catch (err) {
      setError(err.message || "An unknown error occurred.");
    }
  };

  const getAbsentRollNumbers = (record) => {
    return record.attendance
      .filter((entry) => entry.status === "absent")
      .map((entry) => entry.rollNumber);
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
                  <th>Absentees</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Periods</th>
                  <th>Topic</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record, index) => (
                  <React.Fragment key={index}>
                    {record.periods.map((period, idx) => (
                      <tr key={idx}>
                        <td>{getAbsentRollNumbers(record).join(", ")}</td>
                        <td>{record.subject}</td>
                        <td>{record.date}</td>
                        <td>{period}</td>
                        <td>{record.topic}</td>
                        <td>
                          <button onClick={() => handleEdit(record, period)}>Edit</button>
                          <button
                            onClick={() =>
                              handleUpdate(
                                getAbsentRollNumbers(record)[0],
                                { topic: "Updated Topic", subject: "Updated Subject" },
                                period
                              )
                            }
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
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
