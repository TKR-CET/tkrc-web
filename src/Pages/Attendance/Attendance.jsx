import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Attendance.css";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Attendance = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const programYear = queryParams.get("programYear");
  const department = queryParams.get("department");
  const section = queryParams.get("section");
  const subject = queryParams.get("subject");

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch attendance records for the selected date
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

      // Process data to include each period as a separate record
      if (Array.isArray(data)) {
        const processedData = data.map((record) => ({
          ...record,
          classDetails: `B.tech${record.year} ${record.department}-${record.section}`,
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

  // Automatically fetch attendance when the date changes
  useEffect(() => {
    fetchAttendanceByDate();
  }, [date]);

  // Redirect to the marking page with query parameters
  const handleGoClick = () => {
    navigate(
      `/mark?programYear=${programYear}&department=${department}&section=${section}&subject=${subject}&date=${date}`
    );
  };

  const handleEdit = (record) => {
    navigate(
      `/edit?programYear=${record.year}&department=${record.department}&section=${record.section}&subject=${record.subject}&date=${record.date}&period=${record.period}`
    );
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
            <label htmlFor="date">Select Date: </label>
            <input
              type="date"
              id="date"
              className="date-selector"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button onClick={handleGoClick} className="go">
              Go
            </button>
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
                    <th>Class</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Period</th>
                    <th>Topic</th>
                    <th>Remarks</th>
                    <th>Absentees</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record, index) => (
                    <tr key={index}>
                      <td>{record.classDetails}</td>
                      <td>{record.subject}</td>
                      <td>{record.date}</td>
                      <td>{record.period}</td>
                      <td>{record.topic}</td>
                      <td>{record.remarks}</td>
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
