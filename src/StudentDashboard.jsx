import React from "react";

const StudentDashboard = () => {
  return (
    <div>
      <style>
        {`
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          color: #333;
          margin: 0;
          padding: 0;
        }

        /* Navigation Styling */
        nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px;
          background-color: red;
        }

        .left-section {
          display: flex;
        }

        .nav-links {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-links li {
          margin: 0 15px;
        }

        .nav-links a {
          color: white;
          text-decoration: none;
          font-weight: bold;
          padding: 8px 12px;
          transition: background 0.3s, color 0.3s;
        }

        .nav-links a:hover {
          background-color: #FFA500;
          color: #003366;
          border-radius: 4px;
        }

        /* Header Section */
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #ffffff;
          padding: 20px 40px;
          border-bottom: 2px solid #ccc;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }

        .center-content h1 {
          font-size: 24px;
          color: purple;
          margin: 0;
          font-weight: bold;
        }

        .logo {
          width: 120px;
          height: auto;
        }

        /* Student Details */
        .student-details table {
          width: 50%;
          margin: 20px auto;
          border-collapse: collapse;
        }

        .student-details img {
          width: 100px;
          height: auto;
          border-radius: 10px;
        }

        /* Attendance Table */
        table {
          width: 80%;
          margin: 20px auto;
          border-collapse: collapse;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        th, td {
          padding: 10px;
          text-align: center;
          border: 1px solid #ddd;
        }

        th {
          background-color: #f0f0f0;
        }

        td {
          background-color: #fff;
        }

        tfoot th {
          background-color: #ffe0b2;
          color: #000;
        }

        .attendance-table th {
          background-color: #ffcc80;
        }

        /* Daily Attendance */
        .daily-attendance td {
          background-color: #e0f7fa;
        }

        .daily-attendance td.A {
          background-color: #ffcccb;
        }

        .daily-attendance td.P {
          background-color: #c8e6c9;
        }
        `}
      </style>

      {/* Navigation Bar */}
      <nav>
        <ul className="nav-links left-section">
          <li><a href="#">Home</a></li>
          <li><a href="#">Attendance</a></li>
          <li><a href="#">Profile</a></li>
        </ul>
      </nav>

      {/* Header */}
      <header className="header">
        <img src="college-logo.png" alt="College Logo" className="logo" />
        <div className="center-content">
          <h1>TKR College of Engineering & Technology</h1>
        </div>
        <img src="college-logo.png" alt="College Logo" className="logo" />
      </header>

      {/* Student Details */}
      <div className="student-details">
        <table>
          <tbody>
            <tr>
              <th>Roll No.</th>
              <td>22R91A05Q4</td>
              <td rowSpan="4">
                <img src="student-photo.png" alt="Student" />
              </td>
            </tr>
            <tr>
              <th>Student Name</th>
              <td>Vemula Vinay</td>
            </tr>
            <tr>
              <th>Father's Name</th>
              <td>Ramanjaneyulu</td>
            </tr>
            <tr>
              <th>Department</th>
              <td>III CSE I D (B.Tech)</td>
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
            <th>Classes C</th>
            <th>Classes A</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Design and Analysis of Algorithms", 51, 32, 62.75],
            ["Computer Networks", 51, 37, 72.55],
            ["Dev Ops", 56, 40, 71.43],
            ["Data Analytics", 47, 31, 65.96],
            ["Distributed Databases", 54, 34, 62.96],
          ].map((subject, index) => (
            <tr key={index}>
              <td>{subject[0]}</td>
              <td>{subject[1]}</td>
              <td>{subject[2]}</td>
              <td>{subject[3]}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            <td>385</td>
            <td>241</td>
            <td>62.60</td>
          </tr>
        </tfoot>
      </table>

      {/* Daily Attendance */}
      <h2 style={{ textAlign: "center" }}>Daily Attendance</h2>
      <table className="daily-attendance">
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
            <th>Attend</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["12-11-24", "P", "P", "P", "P", "P", "P", 6, 6],
            ["11-11-24", "P", "P", "P", "P", "P", "P", 6, 6],
            ["09-11-24", "P", "P", "A", "A", "P", "P", 6, 4],
          ].map((day, index) => (
            <tr key={index}>
              <td>{day[0]}</td>
              {day.slice(1, 7).map((status, i) => (
                <td key={i} className={status}>{status}</td>
              ))}
              <td>{day[7]}</td>
              <td>{day[8]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentDashboard;