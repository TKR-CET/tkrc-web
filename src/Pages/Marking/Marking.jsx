import React, { useState } from "react";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";
import { useLocation } from "react-router-dom";

const Marking = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const date = query.get("date") || new Date().toISOString().split("T")[0];

  const studentsData = [
    { rollNumber: "23891A6XYZ", name: "Name 1" },
    { rollNumber: "23891A6XYZ2", name: "Name 2" },
    { rollNumber: "23891A6XYZ3", name: "Name 3" },
    { rollNumber: "23891A6XYZ4", name: "Name 4" },
  ];

  const initialAttendance = studentsData.reduce((acc, student) => {
    acc[student.rollNumber] = "present";
    return acc;
  }, {});

  const [attendance, setAttendance] = useState(initialAttendance);
  const [periods, setPeriods] = useState([]);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [remarks, setRemarks] = useState("");

  const handlePeriodChange = (period) => {
    setPeriods((prev) =>
      prev.includes(period) ? prev.filter((p) => p !== period) : [...prev, period]
    );
  };

  const handleAttendanceChange = (rollNumber, status) => {
    setAttendance((prevState) => ({
      ...prevState,
      [rollNumber]: status,
    }));
  };

  const handleSubmit = async () => {
    const data = {
      date,
      periods,
      subject,
      topic,
      remarks,
      attendance,
    };

    try {
      const response = await fetch("http://localhost:5000/attendance/mark-attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit attendance");
      }

      const submitButton = document.getElementById("btn-submit");
      submitButton.innerHTML = "Submitted";
      submitButton.style.backgroundColor = "#FFA500";
      submitButton.style.color = "#003366";

      alert("Attendance submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("An error occurred while submitting attendance");
    }
  };

  return (
    <div>
      <style>
        {`
         .attendanceMain {
           padding: 20px;
           background-color: #fff;
           margin: 20px;
           border-radius: 8px;
           box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
         }

         .attendanceHeading {
           font-size: 19px;
           font-weight: bold;
           text-align: center;
           margin-bottom: 15px;
         }

         .attendanceDetails label {
           display: block;
           margin: 8px 0 4px;
         }

         .attendanceDetails input,
         .attendanceDetails textarea {
           width: 100%;
           padding: 8px;
           margin-bottom: 10px;
           border: 1px solid #ccc;
           border-radius: 4px;
         }

         .periodSelection {
           display: flex;
           flex-wrap: wrap;
           gap: 10px;
           margin-bottom: 15px;
         }

         .periodSelection label {
           display: flex;
           align-items: center;
           font-size: 14px;
           cursor: pointer;
         }

         .periodSelection input {
           margin-right: 8px;
         }

         .tableWrapper {
           overflow-x: auto;
           margin-top: 20px;
         }

         .attendanceList {
           width: 100%;
           border-collapse: collapse;
           min-width: 600px;
         }

         .attendanceList th,
         .attendanceList td {
           text-align: center;
           padding: 10px;
           border: 1.5px solid #ddd;
         }

         .attendanceList th {
           background-color: #f7f7f7;
           font-weight: bold;
         }

         .attendanceList input[type="radio"] {
           appearance: none;
           width: 25px;
           height: 25px;
           border: 2px solid #aaa;
           border-radius: 50%;
           cursor: pointer;
         }

         .attendanceList input[type="radio"]:checked {
           background-color: #2ecc71; /* Green for Present */
           border-color: #2ecc71;
         }

         .attendanceList input[type="radio"].absentStatus:checked {
           background-color: #e74c3c; /* Red for Absent */
           border-color: #e74c3c;
         }

         #btn-submit {
           background-color: #FF5733;
           color: white;
           padding: 10px 20px;
           border: none;
           border-radius: 5px;
           cursor: pointer;
           font-size: 16px;
           margin: 20px 0;
         }

         #btn-submit:hover {
           background-color: #ff704d;
         }

         @media (max-width: 768px) {
           .periodSelection {
             gap: 5px;
           }

           .attendanceList th,
           .attendanceList td {
             font-size: 12px;
             padding: 8px;
           }

           .attendanceList input[type="radio"] {
             width: 20px;
             height: 20px;
           }
         }
        `}
      </style>
      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>
      <div className="attendanceMain">
        <h2 className="attendanceHeading">Attendance on {date}</h2>
        <div className="attendanceDetails">
          <div className="periodSelection">
            {[1, 2, 3, 4, 5, 6].map((period) => (
              <label key={period}>
                <input
                  type="checkbox"
                  checked={periods.includes(period)}
                  onChange={() => handlePeriodChange(period)}
                />
                Period {period}
              </label>
            ))}
          </div>
          <label>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <label>Topic:</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <label>Remarks:</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        <div className="tableWrapper">
          <table className="attendanceList">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Student Name</th>
                <th>Present</th>
                <th>Absent</th>
              </tr>
            </thead>
            <tbody>
              {studentsData.map((student) => (
                <tr key={student.rollNumber}>
                  <td>{student.rollNumber}</td>
                  <td>{student.name}</td>
                  <td>
                    <input
                      type="radio"
                      checked={attendance[student.rollNumber] === "present"}
                      onChange={() =>
                        handleAttendanceChange(student.rollNumber, "present")
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="radio"
                      className="absentStatus"
                      checked={attendance[student.rollNumber] === "absent"}
                      onChange={() =>
                        handleAttendanceChange(student.rollNumber, "absent")
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button id="btn-submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Marking;
