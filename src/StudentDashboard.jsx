import React, { useState, useEffect } from "react";
import NavBar from "./Components/NavBar/NavBar";
import MobileNav from "./Components/MobileNav/MobileNav";
import Header from "./Components/Header/Header";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const studentId = localStorage.getItem("studentId"); // Get student ID from local storage

  useEffect(() => {
    if (!studentId) {
      window.alert("Student ID not found in local storage.");
      setError("Student ID not found.");
      setLoading(false);
      return;
    }

    window.alert("Fetching student details...");

    // Fetch student details
    fetch(`https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Student API Response:", data);
        if (!data || !data.student) {
          throw new Error("Invalid student data received.");
        }

        setStudent(data.student);
        window.alert("Student details fetched successfully!");

        // Ensure student details are populated correctly
        const { rollNumber, year, department, section } = data.student;
        if (!rollNumber || !year || !department || !section) {
          throw new Error("Student details are incomplete.");
        }

        // Alert student details before fetching attendance
        window.alert(`Student details - Roll: ${rollNumber}, Year: ${year}, Department: ${department}, Section: ${section}`);

        // Construct API URL with encoded parameters
        const attendanceURL = `https://tkrcet-backend-g3zu.onrender.com/Attendance/student-record?rollNumber=${encodeURIComponent(rollNumber)}&year=${encodeURIComponent(year)}&department=${encodeURIComponent(department)}&section=${encodeURIComponent(section)}`;

        window.alert("Fetching attendance details...");
        console.log("Fetching attendance from:", attendanceURL);

        return fetch(attendanceURL);
      })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((attendanceData) => {
        console.log("Attendance Data:", attendanceData);
        setAttendance(attendanceData);
        window.alert("Attendance details fetched successfully!");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        window.alert(`Error: ${err.message}`);
        setError(err.message);
        setLoading(false);
      });
  }, [studentId]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2 style={{ color: "red", textAlign: "center" }}>{error}</h2>;
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
      {student ? (
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
      ) : (
        <h2>Student data not available</h2>
      )}

      {/* Attendance Table */}
      {attendance && attendance.subjectSummary ? (
        <>
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
        </>
      ) : (
        <h2>Loading Attendance...</h2>
      )}

      {/* Daily Attendance */}
      {attendance && attendance.dailySummary ? (
        <>
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
                  <td>{record.periods["1"]}</td>
                  <td>{record.total}</td>
                  <td>{record.attended}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <h2>Loading Daily Attendance...</h2>
      )}
    </div>
  );
};

export default StudentDashboard;