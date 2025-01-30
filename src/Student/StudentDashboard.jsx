
import React from "react";

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "auto",
    fontFamily: "'Arial', sans-serif",
    padding: "20px",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  th: {
    background: "#007bff",
    color: "#fff",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  trHover: {
    background: "#f8f9fa",
  },
  img: {
    width: "80px",
    height: "100px",
    borderRadius: "5px",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
};

const StudentDetails = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Student Details</h2>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <tbody>
            <tr>
              <th style={styles.th}>Roll No.</th>
              <td style={styles.td}>22R91A05Q4</td>
              <td rowSpan="4" style={styles.td}>
                <img src="student-photo.png" alt="Student" style={styles.img} />
              </td>
            </tr>
            <tr>
              <th style={styles.th}>Student Name</th>
              <td style={styles.td}>Vemula Vinay</td>
            </tr>
            <tr>
              <th style={styles.th}>Father's Name</th>
              <td style={styles.td}>Ramanjaneyulu</td>
            </tr>
            <tr>
              <th style={styles.th}>Department</th>
              <td style={styles.td}>III CSE I D (B.Tech)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AttendanceTable = () => {
  const attendanceData = [
    ["Design and Analysis of Algorithms", 51, 32, 62.75],
    ["Computer Networks", 51, 37, 72.55],
    ["Dev Ops", 56, 40, 71.43],
    ["Data Analytics", 47, 31, 65.96],
    ["Distributed Databases", 54, 34, 62.96],
    ["Computer Networks Lab", 27, 18, 66.67],
    ["Dev Ops Lab", 33, 15, 45.45],
    ["UI Design (Flutter) Lab", 33, 17, 51.52],
    ["Advanced English Communication Skills Lab", 10, 4, 40.00],
    ["Intellectual Property Rights", 14, 8, 57.14],
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Attendance Details</h2>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Subject</th>
              <th style={styles.th}>Classes C</th>
              <th style={styles.th}>Classes A</th>
              <th style={styles.th}>%</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((subject, index) => (
              <tr key={index} style={index % 2 === 0 ? styles.trHover : {}}>
                <td style={styles.td}>{subject[0]}</td>
                <td style={styles.td}>{subject[1]}</td>
                <td style={styles.td}>{subject[2]}</td>
                <td style={styles.td}>{subject[3]}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th style={styles.th}>Total</th>
              <td style={styles.td}>385</td>
              <td style={styles.td}>241</td>
              <td style={styles.td}>62.60</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

const DailyAttendance = () => {
  const dailyAttendanceData = [
    ["12-11-24", "P", "P", "P", "P", "P", "P", 6, 6],
    ["11-11-24", "P", "P", "P", "P", "P", "P", 6, 6],
    ["09-11-24", "P", "P", "A", "A", "P", "P", 6, 4],
    ["08-11-24", "A", "A", "P", "P", "P", "A", 6, 3],
    ["07-11-24", "P", "P", "P", "A", "A", "A", 6, 3],
    ["05-11-24", "P", "P", "P", "P", "A", "P", 6, 5],
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Daily Attendance</h2>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>1</th>
              <th style={styles.th}>2</th>
              <th style={styles.th}>3</th>
              <th style={styles.th}>4</th>
              <th style={styles.th}>5</th>
              <th style={styles.th}>6</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Attend</th>
            </tr>
          </thead>
          <tbody>
            {dailyAttendanceData.map((day, index) => (
              <tr key={index} style={index % 2 === 0 ? styles.trHover : {}}>
                <td style={styles.td}>{day[0]}</td>
                {day.slice(1, 7).map((status, i) => (
                  <td key={i} style={styles.td}>
                    {status}
                  </td>
                ))}
                <td style={styles.td}>{day[7]}</td>
                <td style={styles.td}>{day[8]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  return (
    <div>
      <StudentDetails />
      <AttendanceTable />
      <DailyAttendance />
    </div>
  );
};

export default StudentDashboard;
