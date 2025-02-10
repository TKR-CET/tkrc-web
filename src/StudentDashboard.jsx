import React, { useState, useEffect } from "react";
import NavBar from "./Components/NavBar/NavBar";
import MobileNav from "./Components/MobileNav/MobileNav";
import Header from "./Components/Header/Header";
 External CSS

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

  if (loading) return <h2 className="loading-message">Loading...</h2>;
  if (error) return <h2 className="loading-message">{error}</h2>;
  if (!student || !attendance) return <h2 className="loading-message">Error loading data. Please try again.</h2>;

  return (
<>
 <style>
{`

.student-dashboard {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.loading-message {
  text-align: center;
  font-size: 20px;
  color: red;
}

/* Navigation */
.navbar-container,
.mobile-navbar {
  margin-bottom: 20px;
}

/* Student Info */
.student-info {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.student-table {
  width: 100%;
  border-collapse: collapse;
}

.student-photo {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
}

/* Attendance Summary */
.attendance-summary {
  margin-top: 20px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
}

.attendance-table th,
.attendance-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.total-percentage {
  color: red;
}

/* Daily Attendance */
.daily-attendance {
  margin-top: 20px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.present {
  color: green;
}

.absent {
  color: red;
}

/* Responsive */
@media (max-width: 768px) {
  .student-photo {
    width: 80px;
    height: 80px;
  }

  th, td {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .student-photo {
    width: 60px;
    height: 60px;
  }

  th, td {
    font-size: 10px;
  }
}
`}</style>
    <div className="student-dashboard">
      <Header />
      <div className="navbar-container">
        <NavBar />
      </div>
      <div className="mobile-navbar">
        <MobileNav />
      </div>

      {/* Student Details */}
      <div className="student-info">
        <h2>Student Details</h2>
        <table className="student-table">
          <tbody>
            <tr>
              <th>Roll No.</th>
              <td>{student.rollNumber}</td>
              <td rowSpan="4">
                <img src={student.image} alt="Student" className="student-photo" />
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
        <table className="attendance-table">
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
              <td className="total-percentage">
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
        <table className="daily-attendance-table">
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
                  <td key={period} className={data.periods[period] === "P" ? "present" : "absent"}>
                    {data.periods[period] || "-"}
                  </td>
                ))}
                <td>{data.total}</td>
                <td>{data.attended}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </div>
</>
  );
};

export default StudentDashboard;