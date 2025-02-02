import React, { useState, useEffect } from "react";
import NavBar from "./Components/NavBar/NavBar";
import MobileNav from "./Components/MobileNav/MobileNav";
import Header from "./Components/Header/Header";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    if (!studentId) {
      setError("Student ID not found.");
      setLoading(false);
      return;
    }

    // Fetch Student Details
    fetch(`https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.student) {
          setError("Failed to fetch student details.");
          setLoading(false);
          return;
        }
        setStudent(data.student);
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching student details.");
        setLoading(false);
      });

    // Fetch Attendance Details
    fetch(`https://tkrcet-backend-g3zu.onrender.com/Attendance/student-record?rollNumber=${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.subjectSummary) {
          setError("Failed to fetch attendance data.");
          return;
        }
        setAttendance(data);
      })
      .catch(() => {
        setError("Error fetching attendance data.");
      });
  }, [studentId]);

  if (loading) return <h2 className="loading-message">Loading...</h2>;
  if (error) return <h2 className="error-message">{error}</h2>;

  return (
<>
    
      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>

      {/* Student Details Section */}
      <div className="card student-info">
        <h2>Student Information</h2>
        <table>
          <tbody>
            <tr>
              <th>Roll No.</th>
              <td>{student.rollNumber}</td>
              <td rowSpan="4">
                <img src={student.image} alt="Student" className="profile-image" />
              </td>
            </tr>
            <tr>
              <th>Name</th>
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

      {/* Attendance Summary */}
      <div className="card attendance-overview">
        <h2>Attendance Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Classes Conducted</th>
              <th>Classes Attended</th>
              <th>Percentage</th>
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
            <tr className="total-row">
              <td><b>Total</b></td>
              <td><b>{attendance.subjectSummary.reduce((sum, sub) => sum + sub.classesConducted, 0)}</b></td>
              <td><b>{attendance.subjectSummary.reduce((sum, sub) => sum + sub.classesAttended, 0)}</b></td>
              <td>
                <b>
                  {(
                    (attendance.subjectSummary.reduce((sum, sub) => sum + sub.classesAttended, 0) /
                      attendance.subjectSummary.reduce((sum, sub) => sum + sub.classesConducted, 0)) *
                    100
                  ).toFixed(2)}%
                </b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Daily Attendance Summary */}
      <div className="card daily-attendance">
        <h2>Daily Attendance</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              {[1, 2, 3, 4, 5, 6].map((period) => <th key={period}>{period}</th>)}
              <th>Total</th>
              <th>Attended</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(attendance.dailySummary).map(([date, data], index) => (
              <tr key={index}>
                <td>{date}</td>
                {[1, 2, 3, 4, 5, 6].map((period) => (
                  <td key={period}>{data.periods[period] || "-"}</td>
                ))}
                <td>{data.total}</td>
                <td>{data.attended}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CSS Styling */}
      <style>
        {`
        /* General Styles */
        .dashboard-container {
          max-width: 1200px;
          margin: auto;
          padding: 20px;
          font-family: 'Poppins', sans-serif;
          color: #333;
        }

        .loading-message, .error-message {
          text-align: center;
          font-size: 20px;
          margin-top: 20px;
        }

        /* Card Layout */
        .card {
          background: #ffffff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .card h2 {
          text-align: center;
          color: #007bff;
          border-bottom: 2px solid #007bff;
          padding-bottom: 5px;
          display: inline-block;
        }

        /* Table Styles */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        th, td {
          padding: 12px;
          text-align: center;
          border-bottom: 1px solid #ddd;
        }

        th {
          background: #007bff;
          color: white;
          font-weight: bold;
        }

        td {
          color: #555;
        }

        tr:hover {
          background: rgba(0, 123, 255, 0.1);
          transition: 0.3s ease-in-out;
        }

        .total-row {
          font-weight: bold;
          background: #f2f2f2;
        }

        /* Profile Image */
        .profile-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #007bff;
          margin-left: 20px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .profile-image {
            margin-left: 0;
            margin-top: 10px;
          }

          table {
            font-size: 14px;
          }

          th, td {
            padding: 8px;
          }
        }
        `}
      </style>
    </>
  );
};

export default StudentDashboard;