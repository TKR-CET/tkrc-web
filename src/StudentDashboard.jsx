import React from "react";

const StudentDashboard = () => {
  return (
    <div>
      <style>
        {`
          .container {
            max-width: 1000px;
            margin: auto;
            font-family: 'Arial', sans-serif;
            padding: 20px;
          }
          .table-container {
            overflow-x: auto;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th {
            background: #007bff;
            color: #fff;
            padding: 10px;
            text-align: left;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background: #f8f9fa;
          }
          img {
            width: 80px;
            height: 100px;
            border-radius: 5px;
          }
          .heading {
            text-align: center;
            margin-bottom: 20px;
            font-size: 24px;
            color: #333;
          }
        `}
      </style>

      {/* Student Details */}
      <div className="container">
        <h2 className="heading">Student Details</h2>
        <div className="table-container">
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
      </div>

      {/* Attendance Table */}
      <div className="container">
        <h2 className="heading">Attendance Details</h2>
        <div className="table-container">
          <table>
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
          </table>
        </div>
      </div>

      {/* Daily Attendance */}
      <div className="container">
        <h2 className="heading">Daily Attendance</h2>
        <div className="table-container">
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
                    <td key={i}>{status}</td>
                  ))}
                  <td>{day[7]}</td>
                  <td>{day[8]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
