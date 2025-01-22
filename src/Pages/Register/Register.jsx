import React from "react";
import "./Register.css";

const Register = () => {
  const data = [
    { rollNo: "20K91A0328", attendance: ["A", "A", "A", "A", "A", "A", "A", "1", "2", "3", "A", "A", "A", "A", "A", "A"], total: 26, attended: 3, percentage: 11.54 },
    { rollNo: "20K91A0335", attendance: ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"], total: 26, attended: 0, percentage: 0.00 },
  ];

  const dates = ["12.08.24", "13.08.24", "03.09.24", "10.09.24", "23.09.24", "30.09.24", "15.10.24", "21.10.24", "28.10.24"];
  const periods = [4, 5, 6, 3, 4, 5, 1, 2, 3, 1, 2, 3, 4, 5, 6];

  return (
    <div className="table-container">
      <table className="attendance-table">
        <thead>
          <tr>
            <th colSpan={dates.length + 4} className="header-title">
              Attendance Register (CAD / CAM Lab) Section : IV ME I A - 2024-25
            </th>
          </tr>
          <tr>
            <th>Roll No.</th>
            {dates.map((date, index) => (
              <th key={index} colSpan="2">{date}</th>
            ))}
            <th>Total</th>
            <th>Attend</th>
            <th>%</th>
          </tr>
          <tr>
            <th></th>
            {periods.map((period, index) => (
              <th key={index}>{period}</th>
            ))}
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((student, index) => (
            <tr key={index}>
              <td>{student.rollNo}</td>
              {student.attendance.map((att, idx) => (
                <td key={idx} className={att === "A" ? "absent" : "present"}>{att}</td>
              ))}
              <td>{student.total}</td>
              <td>{student.attended}</td>
              <td className={student.percentage === 0 ? "zero-percent" : "low-percent"}>{student.percentage.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Register;
