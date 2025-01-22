import React, { useState, useEffect } from "react";

const Register = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch attendance data from backend (replace with your API)
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // Placeholder API URL, replace it when backend is ready
        const response = await fetch("https://your-backend-api.com/attendance");
        const data = await response.json();
        setAttendanceData(data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return <p>Loading attendance...</p>;
  }

  return (
    <div className="attendance-table">
      <h2>Attendance Register (CAD / CAM Lab)</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Roll No.</th>
            {attendanceData.dates.map((date, index) => (
              <th key={index}>{date}</th>
            ))}
            <th>Total</th>
            <th>Attend</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.students.map((student, index) => (
            <tr key={index}>
              <td>{student.rollNo}</td>
              {student.attendance.map((status, idx) => (
                <td key={idx} style={{ color: status === "A" ? "red" : "green" }}>
                  {status}
                </td>
              ))}
              <td>{student.total}</td>
              <td>{student.attended}</td>
              <td style={{ color: student.percentage === "0.00" ? "red" : "black" }}>
                {student.percentage}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Register;
