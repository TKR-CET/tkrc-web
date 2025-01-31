import React, { useState, useEffect } from "react";
import NavBar from "./Components/NavBar/NavBar";
import MobileNav from "./Components/MobileNav/MobileNav";
import Header from "./Components/Header/Header";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);  // New state for attendance
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    if (!studentId) {
      setError("Student ID not found in local storage.");
      setLoading(false);
      return;
    }

    console.log("Student ID from Local Storage:", studentId);

    // Fetch student details
    fetch(`https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Student API Response:", data);

        if (!data || !data.student) {
          console.error("Student data is missing:", data);
          setError("Failed to fetch student data.");
          setLoading(false);
          return;
        }

        setStudent(data.student);

        // Fetch attendance data after student details are loaded
        const { rollNumber, year, department, section } = data.student;
        return fetch(`https://tkrcet-backend-g3zu.onrender.com/Attendance/student-record?rollNumber=${rollNumber}&year=${year}&department=${department}&section=${section}`);
      })
      .then((res) => res.json())
      .then((attendanceData) => {
        console.log("Attendance API Response:", attendanceData);

        if (!attendanceData || !attendanceData.subjectSummary) {
          console.error("Attendance data is missing:", attendanceData);
          setError("Failed to fetch attendance data.");
          setLoading(false);
          return;
        }

        setAttendance(attendanceData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Error fetching data.");
        setLoading(false);
      });
  }, [studentId]);

  if (loading) {
    return <h2 className="loading-text">Loading...</h2>;
  }

  if (error) {
    return <h2 className="loading-text">{error}</h2>;
  }

  if (!student) {
    return <h2 className="loading-text">Error loading student data. Please try again.</h2>;
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
        <h2>Student Details</h2>
        <table>
          <tbody>
            <tr>
              <th>Roll No.</th>
              <td>{student.rollNumber}</td>
              <td rowSpan="4">
                <img src={student.image} alt="Student" className="student-image" />
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

      {/* Attendance Details */}
      {attendance && (
        <div className="attendance-details">
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
            </tbody>
          </table>
        </div>
      )}

      <style>
        {`
          .loading-text {
            text-align: center;
            font-size: 20px;
            margin-top: 20px;
          }

          .student-details, .attendance-details {
            margin-top: 20px;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          .student-details h2, .attendance-details h2 {
            text-align: center;
            color: #333;
          }

          table {
            width: 100%;
            margin: 20px 0;
            border-collapse: collapse;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
          }

          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }

          th {
            background-color: #f2f2f2;
            color: #333;
          }

          td {
            color: #555;
          }

          img.student-image {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 50%;
            margin-left: 20px;
          }

          .nav, .mob-nav {
            margin-top: 20px;
          }
        `}
      </style>
    </div>
  );
};

export default StudentDashboard;