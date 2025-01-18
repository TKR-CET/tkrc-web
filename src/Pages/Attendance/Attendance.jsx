import React, { useState, useEffect } from "react";
import "./Attendance.css";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Attendance = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
  const [attendanceData, setAttendanceData] = useState([]); // Holds the fetched attendance records
  const [loading, setLoading] = useState(false); // Loading state for the fetch operation
  const [error, setError] = useState(""); // Holds error messages

  // Function to fetch attendance records by date
  const fetchAttendanceByDate = async () => {
    setLoading(true); // Set loading state to true
    setError(""); // Reset error state

    try {
      // Make API call to fetch attendance data for the given date
      const response = await fetch(
        `https://tkrcet-backend.onrender.com/Attendance/date?date=${date}`
      );

      if (!response.ok) {
        throw new Error(`No attendance record found for the date: ${response.status}`);
      }

      const { data } = await response.json();

      // Process the data if it is an array
      if (Array.isArray(data)) {
        const processedData = data.map((record) => ({
          ...record,
          absentees: record.attendance
            .filter((student) => student.status === "absent")
            .map((student) => student.rollNumber),
        }));
        setAttendanceData(processedData); // Update the state with processed data
      } else {
        throw new Error("Invalid data format: Expected an array.");
      }
    } catch (err) {
      setError(err.message || "An unknown error occurred."); // Handle errors
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  // Automatically fetch attendance when the date changes
  useEffect(() => {
    fetchAttendanceByDate();
  }, [date]);

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
          <div className="date-selector-wrapper">
            <label htmlFor="date">Select Date: </label>
            <input
              type="date"
              id="date"
              className="date-selector"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p>Loading attendance records...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="attendance-table-wrapper">
            {attendanceData.length > 0 ? (
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
            ) : (
              <p>No attendance records available for the selected date.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
