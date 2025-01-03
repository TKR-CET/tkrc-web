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

      alert("Attendance submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("An error occurred while submitting attendance");
    }
  };

  return (
    <div>
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
            <label>Periods:</label>
            {[1, 2, 3, 4, 5, 6].map((period) => (
              <label key={period}>
                <input
                  type="checkbox"
                  checked={periods.includes(period)}
                  onChange={() => handlePeriodChange(period)}
                />
                {period}
              </label>
            ))}
          </div>
          <div className="subjectTopicEntry">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <label htmlFor="topic">Topic:</label>
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <label htmlFor="remarks">Remarks:</label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        </div>
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
        <button id="btn-submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Marking;
