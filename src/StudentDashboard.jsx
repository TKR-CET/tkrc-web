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
      setError("Student ID not found in local storage.");
      setLoading(false);
      return;
    }

    // Fetch Student Details
    fetch(`https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.student) {
          setError("Failed to fetch student data.");
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
      <div className="daily-attendance">
        <h2>Daily Attendance</h2>
        <table>
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

      {/* Internal CSS */}
      <style>
        {`
          
/* General Styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Poppins', sans-serif;
}

.loading-text {
  text-align: center;
  font-size: 20px;
  color: #ff4d4d;
  margin-top: 20px;
}

/* Section Styles */
.section {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.section h2 {
  text-align: center;
  color: #333;
  margin-bottom: 15px;
  font-size: 24px;
  border-bottom: 2px solid #007bff;
  display: inline-block;
  padding-bottom: 5px;
}

/* Table Styling */
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
}

th, td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
}

th {
  background: #007bff;
  color: #fff;
  font-weight: 600;
}

td {
  color: #555;
}

tr:hover {
  background: rgba(0, 123, 255, 0.1);
  transition: 0.3s ease-in-out;
}

/* Student Details */
.student-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.student-details img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #007bff;
  margin-left: 20px;
}

/* Attendance Summary */
.attendance-summary {
  text-align: center;
}

/* Daily Attendance */
.daily-attendance th:nth-child(2),
.daily-attendance td:nth-child(2) {
  background: #f8f9fa;
  font-weight: bold;
}

/* Responsive Design */
@media (max-width: 768px) {
  .student-details {
    flex-direction: column;
    align-items: center;
  }

  .student-details img {
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
    </div>
  );
};

export default StudentDashboard;