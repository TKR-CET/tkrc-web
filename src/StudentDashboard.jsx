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

  const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return await res.json();
      } catch (err) {
        if (attempt === retries) throw err;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  useEffect(() => {
    if (!studentId) {
      setError("Student ID not found in local storage.");
      setLoading(false);
      return;
    }

    const fetchStudentDetails = fetchWithRetry(
      `https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`
    );
    const fetchAttendanceDetails = fetchWithRetry(
      `https://tkrcet-backend-g3zu.onrender.com/Attendance/student-record?rollNumber=${studentId}`
    );

    Promise.all([fetchStudentDetails, fetchAttendanceDetails])
      .then(([studentData, attendanceData]) => {
        if (!studentData?.student) {
          throw new Error("Failed to fetch student data.");
        }
        if (!attendanceData?.subjectSummary) {
          throw new Error("Failed to fetch attendance data.");
        }

        setStudent(studentData.student);
        setAttendance(attendanceData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [studentId]);

  if (loading) {
    return <h2 className="loading-text">Loading...</h2>;
  }

  if (error) {
    return <h2 className="loading-text">{error}</h2>;
  }

  if (!student || !attendance) {
    return <h2 className="loading-text">Error loading data. Please try again.</h2>;
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

      {/* Attendance Summary */}
      <div className="attendance-summary">
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
            <tr>
              <td><b>Total</b></td>
              <td><b>{attendance.subjectSummary.reduce((sum, sub) => sum + sub.classesConducted, 0)}</b></td>
              <td><b>{attendance.subjectSummary.reduce((sum, sub) => sum + sub.classesAttended, 0)}</b></td>
              <td id="total">
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
      <div className="daily-attendance">
        <h2>Daily Attendance</h2>
        <table className="t2">
          <thead>
            <tr>
              <th>Date</th>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>5</th>
              <th>6</th>
              <th>Total</th>
              <th>Attended</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(attendance.dailySummary).map(([date, data], index) => (
              <tr key={index}>
                <td>{date}</td>
                {[1, 2, 3, 4, 5, 6].map((period) => {
                  const periodData = data.periods[period];
                  return (
                    <td
                      key={period}
                      className={periodData?.status === "present" ? "present-cell" : "absent-cell"}
                    >
                      {periodData?.subject || "-"}
                    </td>
                  );
                })}
                <td>{data.total}</td>
                <td>{data.attended}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDashboard;