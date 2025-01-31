import React, { useState, useEffect } from "react";
import NavBar from "./Components/NavBar/NavBar";
import MobileNav from "./Components/MobileNav/MobileNav";
import Header from "./Components/Header/Header";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const studentId = localStorage.getItem("studentId"); // Get student ID from local storage

  useEffect(() => {
    if (!studentId) return;

    // Fetch student details
    fetch(`https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        setStudent(data.student);

        // Fetch attendance details using student details
        fetch(
          `https://tkrcet-backend-g3zu.onrender.com/Attendance/student-record?rollNumber=${data.student.rollNumber}&year=${encodeURIComponent(
            data.student.year
          )}&department=${encodeURIComponent(
            data.student.department
          )}&section=${data.student.section}`
        )
          .then((res) => res.json())
          .then((attendanceData) => setAttendance(attendanceData))
          .catch((err) => console.error("Error fetching attendance:", err));
      })
      .catch((err) => console.error("Error fetching student details:", err));
  }, [studentId]);

  if (!student || !attendance) {
    return <h2 className="loading-text">Loading...</h2>;
  }

  return (
    <div>
      <style>
        {`
        body {
          font-family: 'Poppins', sans-serif;
          background-color: #f4f6f8;
          margin: 0;
          padding: 0;
          color: #333;
        }

        .container {
          width: 90%;
          margin: auto;
          max-width: 1200px;
          padding: 20px;
        }

        /* Navigation */
        .nav, .mob-nav {
          margin-bottom: 20px;
        }

        /* Loading Text */
        .loading-text {
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
          color: #555;
          margin-top: 50px;
        }

        /* Student Details */
        .student-details {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          text-align: center;
        }

        .student-details table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .student-details th, .student-details td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
        }

        .student-details img {
          width: 120px;
          height: auto;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* Attendance Table */
        .attendance-table, .daily-attendance {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        th, td {
          padding: 14px;
          text-align: center;
          border-bottom: 1px solid #ddd;
        }

        th {
          background-color: #007bff;
          color: white;
        }

        td {
          background-color: #fff;
        }

        /* Attendance Colors */
        .daily-attendance td.P {
          background-color: #c8e6c9;
          font-weight: bold;
          color: #2e7d32;
        }

        .daily-attendance td.A {
          background-color: #ffcccb;
          font-weight: bold;
          color: #c62828;
        }

        /* Responsive Styling */
        @media (max-width: 768px) {
          .student-details, .attendance-table, .daily-attendance {
            width: 100%;
            overflow-x: auto;
            display: block;
          }

          .student-details img {
            width: 100px;
          }
        }
        `}
      </style>

      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>

      <div className="container">
        {/* Student Details */}
        <div className="student-details">
          <h2>Student Details</h2>
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
    </div>
  );
};

export default StudentDashboard;