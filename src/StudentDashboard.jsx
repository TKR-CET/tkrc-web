import React, { useState, useEffect } from "react";
import NavBar from "./Components/NavBar/NavBar";
import MobileNav from "./Components/MobileNav/MobileNav";
import Header from "./Components/Header/Header";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    if (!studentId) return;

    fetch(`https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        setStudent(data.student);

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
    return <h2 id="loadingMessage">Loading...</h2>;
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

        #dashboardContainer {
          width: 90%;
          margin: auto;
          max-width: 1200px;
          padding: 20px;
        }

        #navigationBar, #mobileNavigation {
          margin-bottom: 20px;
        }

        #loadingMessage {
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
          color: #555;
          margin-top: 50px;
        }

        #studentInfo {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          text-align: center;
        }

        #studentTable {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .studentDetailsHeader, .studentDetailsData {
          padding: 12px;
          border-bottom: 1px solid #ddd;
        }

        #studentPhoto {
          width: 120px;
          height: auto;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        #attendanceTable, #dailyAttendanceTable {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .tableHeader, .tableData {
          padding: 14px;
          text-align: center;
          border-bottom: 1px solid #ddd;
        }

        .tableHeader {
          background-color: #007bff;
          color: white;
        }

        .tableData {
          background-color: #fff;
        }

        .attendancePresent {
          background-color: #c8e6c9;
          font-weight: bold;
          color: #2e7d32;
        }

        .attendanceAbsent {
          background-color: #ffcccb;
          font-weight: bold;
          color: #c62828;
        }

        @media (max-width: 768px) {
          #studentInfo, #attendanceTable, #dailyAttendanceTable {
            width: 100%;
            overflow-x: auto;
            display: block;
          }

          #studentPhoto {
            width: 100px;
          }
        }
        `}
      </style>

      <Header />
      <div id="navigationBar">
        <NavBar />
      </div>
      <div id="mobileNavigation">
        <MobileNav />
      </div>

      <div id="dashboardContainer">
        <div id="studentInfo">
          <h2>Student Details</h2>
          <table id="studentTable">
            <tbody>
              <tr>
                <th className="studentDetailsHeader">Roll No.</th>
                <td className="studentDetailsData">{student.rollNumber}</td>
                <td rowSpan="4">
                  <img id="studentPhoto" src={student.image} alt="Student" />
                </td>
              </tr>
              <tr>
                <th className="studentDetailsHeader">Student Name</th>
                <td className="studentDetailsData">{student.name}</td>
              </tr>
              <tr>
                <th className="studentDetailsHeader">Father's Name</th>
                <td className="studentDetailsData">{student.fatherName}</td>
              </tr>
              <tr>
                <th className="studentDetailsHeader">Department</th>
                <td className="studentDetailsData">{`${student.year} ${student.department} ${student.section}`}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 style={{ textAlign: "center" }}>Attendance Details</h2>
        <table id="attendanceTable">
          <thead>
            <tr>
              <th className="tableHeader">Subject</th>
              <th className="tableHeader">Classes Conducted</th>
              <th className="tableHeader">Classes Attended</th>
              <th className="tableHeader">%</th>
            </tr>
          </thead>
          <tbody>
            {attendance.subjectSummary.map((subject, index) => (
              <tr key={index}>
                <td className="tableData">{subject.subject}</td>
                <td className="tableData">{subject.classesConducted}</td>
                <td className="tableData">{subject.classesAttended}</td>
                <td className="tableData">{subject.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={{ textAlign: "center" }}>Daily Attendance</h2>
        <table id="dailyAttendanceTable">
          <thead>
            <tr>
              <th className="tableHeader">Date</th>
              <th className="tableHeader">1</th>
              <th className="tableHeader">Total</th>
              <th className="tableHeader">Attend</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(attendance.dailySummary).map(([date, record], index) => (
              <tr key={index}>
                <td className="tableData">{date}</td>
                <td className={record.periods["1"] === "P" ? "attendancePresent" : "attendanceAbsent"}>
                  {record.periods["1"]}
                </td>
                <td className="tableData">{record.total}</td>
                <td className="tableData">{record.attended}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDashboard;