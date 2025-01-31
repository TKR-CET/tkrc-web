import React, { useState, useEffect } from "react";
import NavBar from "./Components/NavBar/NavBar";
import MobileNav from "./Components/MobileNav/MobileNav";
import Header from "./Components/Header/Header";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);  // Added loading state
  const studentId = localStorage.getItem("studentId"); // Get student ID from local storage

  useEffect(() => {
    if (!studentId) return;

    // Log the studentId to verify
    console.log("Student ID from Local Storage:", studentId);

    // Fetch student details
    fetch(`https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Student API Response:", data); // Debugging log

        if (!data || !data.student) {
          console.error("Student data is missing:", data);
          setLoading(false);
          return;
        }
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
          .then((attendanceData) => {
            console.log("Attendance API Response:", attendanceData); // Debugging log

            if (!attendanceData || !attendanceData.subjectSummary) {
              console.error("Attendance data is missing:", attendanceData);
              setLoading(false);
              return;
            }
            setAttendance(attendanceData);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error fetching attendance:", err);
            setLoading(false);
          });
      })
      .catch((err) => {
        console.error("Error fetching student details:", err);
        setLoading(false);
      });
  }, [studentId]);

  // Loading state before data is fetched
  if (loading) {
    return <h2 className="loading-text">Loading...</h2>;
  }

  if (!student || !attendance) {
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
          {attendance.subjectSummary && attendance.subjectSummary.length > 0 ? (
            attendance.subjectSummary.map((subject, index) => (
              <tr key={index}>
                <td>{subject.subject}</td>
                <td>{subject.classesConducted}</td>
                <td>{subject.classesAttended}</td>
                <td>{subject.percentage}%</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No attendance data available.</td>
            </tr>
          )}
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
          {Object.entries(attendance.dailySummary || {}).length > 0 ? (
            Object.entries(attendance.dailySummary).map(([date, record], index) => (
              <tr key={index}>
                <td>{date}</td>
                <td className={record.periods["1"]}>{record.periods["1"]}</td>
                <td>{record.total}</td>
                <td>{record.attended}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No daily attendance data available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentDashboard;