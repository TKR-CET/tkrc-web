import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";
import "./Attendance.css";
const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch("https://tkrcet-backend.onrender.com/attendance/all");
        const data = await response.json();
        setAttendanceData(data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div>
      <Header />
      <NavBar />
      <MobileNav />
      <div className="attendanceMain">
        <h2>Attendance Records</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Periods</th>
              <th>Subject</th>
              <th>Absent Roll Numbers</th>
              <th>Topic</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td>{record.periods.join(", ")}</td>
                <td>{record.subject}</td>
                <td>
                  {record.attendance
                    .filter((att) => att.status === "absent")
                    .map((att) => att.rollNumber)
                    .join(", ")}
                </td>
                <td>{record.topic}</td>
                <td>{record.remarks}</td>
                <td>
                  <Link
                    to={`/mark?date=${record.date}&periods=${record.periods.join(",")}&subject=${record.subject}&topic=${record.topic}&remarks=${record.remarks}`}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
