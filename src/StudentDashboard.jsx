import React, { useState, useEffect } from "react";
import NavBar from "./Components/NavBar/NavBar";
import MobileNav from "./Components/MobileNav/MobileNav";
import Header from "./Components/Header/Header";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [error, setError] = useState(""); // Error state
  const studentId = localStorage.getItem("studentId"); // Get student ID from local storage

  useEffect(() => {
    if (!studentId) {
      setError("Student ID not found in local storage.");
      return;
    }

    alert("Fetching student data...");

    console.log("Fetching student data for:", studentId);

    fetch(`https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Student Data:", data);

        if (!data.student) {
          throw new Error("No student data received.");
        }

        setStudent(data.student);

        alert("Fetching attendance data...");
        const attendanceURL = `https://tkrcet-backend-g3zu.onrender.com/Attendance/student-record?rollNumber=${data.student.rollNumber}&year=${encodeURIComponent(
          data.student.year
        )}&department=${encodeURIComponent(data.student.department)}&section=${data.student.section}`;

        console.log("Fetching attendance data from:", attendanceURL);

        return fetch(attendanceURL);
      })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((attendanceData) => {
        console.log("Attendance Data:", attendanceData);
        setAttendance(attendanceData);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err.message);
      });
  }, [studentId]);

  if (error) {
    return <h2 style={{ textAlign: "center", color: "red" }}>Error: {error}</h2>;
  }

  if (!student || !attendance || !attendance.subjectSummary || !attendance.dailySummary) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div>
      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>

      {/* Student Details */}
      <div className="student-details">
        <table>
          <tbody>
            <tr>
              <th>Roll No.</th>
              <td>{student.rollNumber}</td>
              <td rowSpan="4">
                <img src={student.image} alt="Student" />
              </td>
            </tr>
            <tr>
              <th>Student Name</th>
              <td>{student.name}</td>
            </tr>
            <tr>
              <th>Father's Name</th>
              <td>{student.fatherName}</td>
            </tr>
            <tr>
              <th>Department</th>
              <td>{`${student.year} ${student.department} ${student.section}`}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Attendance Table */}
      <h2 style={{ textAlign: "center" }}>Attendance Details</h2>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Classes Conducted</th>
            <th>Classes Attended</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {attendance.subjectSummary.map((subject, index) => (
            <tr key={index}>
              <td>{subject.subject}</td>
              <td>{subject.classesConducted}</td>
              <td>{subject.classesAttended}</td>
              <td>{subject.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Daily Attendance */}
      <h2 style={{ textAlign: "center" }}>Daily Attendance</h2>
      <table className="daily-attendance">
        <thead>
          <tr>
            <th>Date</th>
            <th>1</th>
            <th>Total</th>
            <th>Attend</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(attendance.dailySummary).map(([date, record], index) => (
            <tr key={index}>
              <td>{date}</td>
              <td className={record.periods["1"]}>{record.periods["1"]}</td>
              <td>{record.total}</td>
              <td>{record.attended}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentDashboard;