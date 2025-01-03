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
    <div style={styles.container}>
      <Header />
      <div style={styles.nav}>
        <NavBar />
      </div>
      <div style={styles.mobileNav}>
        <MobileNav />
      </div>
      <div style={styles.main}>
        <h2 style={styles.heading}>Attendance on {date}</h2>
        <div style={styles.details}>
          <div style={styles.periodSection}>
            <label style={styles.label}>Periods:</label>
            {[1, 2, 3, 4, 5, 6].map((period) => (
              <label key={period} style={styles.periodLabel}>
                <input
                  type="checkbox"
                  checked={periods.includes(period)}
                  onChange={() => handlePeriodChange(period)}
                />
                {period}
              </label>
            ))}
          </div>
          <div style={styles.inputSection}>
            <label style={styles.label} htmlFor="subject">
              Subject:
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={styles.input}
            />
            <label style={styles.label} htmlFor="topic">
              Topic:
            </label>
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              style={styles.textarea}
            />
            <label style={styles.label} htmlFor="remarks">
              Remarks:
            </label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              style={styles.textarea}
            />
          </div>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Roll Number</th>
              <th style={styles.tableHeader}>Student Name</th>
              <th style={styles.tableHeader}>Present</th>
              <th style={styles.tableHeader}>Absent</th>
            </tr>
          </thead>
          <tbody>
            {studentsData.map((student) => (
              <tr key={student.rollNumber}>
                <td style={styles.tableCell}>{student.rollNumber}</td>
                <td style={styles.tableCell}>{student.name}</td>
                <td style={styles.tableCell}>
                  <input
                    type="radio"
                    checked={attendance[student.rollNumber] === "present"}
                    onChange={() =>
                      handleAttendanceChange(student.rollNumber, "present")
                    }
                  />
                </td>
                <td style={styles.tableCell}>
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
        <button style={styles.submitButton} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

const styles = {
/* Marking.module.css */
.attendanceMain {
  padding: 25px;
  background-color: #fff;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.compulsoryText {
  color: red;
  font-weight: bold;
}

.attendanceHeading {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.attendanceDetails {
  margin-bottom: 20px;
}

.periodSelection {
  margin-bottom: 15px;
}

.periodSelection label {
  font-size: 18px;
  margin-right: 12px;
}

.periodSelection input[type="checkbox"] {
  margin-right: 7px;
}

.subjectTopicEntry label {
  font-size: 18px;
  margin-top: 12px;
  display: block;
}

.subjectTopicEntry input,
.subjectTopicEntry textarea {
  width: 100%;
  padding: 12px;
  margin-top: 6px;
  margin-bottom: 12px;
  border-radius: 5px;
  border: 1px solid #dcdcdc;
}

.subjectTopicEntry textarea {
  height: 120px;
}

#btn-submit {
  background-color: #FF5733;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  align-items: center;
  position: relative;
  top: 10px;
  left: 50%;
  justify-content: center;
}

#btn-submit:hover {
  background-color: #ff704d;
}

button:disabled {
  background-color: #dcdcdc;
  cursor: not-allowed;
}

button a {
  color: white;
  text-decoration: none;
}

/* Table Styles */
.attendanceList {
  width: 100%;
  border-collapse: collapse;
  margin-top: 22px;
}

.attendanceList th,
.attendanceList td {
  text-align: center;
  padding: 14px;
  border: 1px solid #ddd;
}

.attendanceList th {
  background-color: #f7f7f7;
  font-weight: bold;
}

.attendanceList td {
  background-color: #fff;
}

.attendanceList td input {
  cursor: pointer;
}

/* Radio Button Styles */
.attendanceList input[type="radio"] {
  appearance: none;
  width: 26px;
  height: 26px;
  border: 2px solid #ddd;
  border-radius: 50%;
  cursor: pointer;
}

.attendanceList input[type="radio"]:checked {
  background-color: #2ecc71;
  border-color: #2ecc71;
}

/* Present Radio Button (Green) */
.attendanceList input[type="radio"].presentStatus:checked {
  background-color: #2ecc71;
  border-color: #2ecc71;
}

/* Absent Radio Button (Red) */
.attendanceList input[type="radio"].absentStatus:checked {
  background-color: #e74c3c;
  border-color: #e74c3c;
}

/* Hover Effects for both */
.attendanceList input[type="radio"]:hover {
  border-color: #aaa;
}

/* Responsiveness */
@media (max-width: 768px) {
  .attendanceMain {
    margin: 15px;
    padding: 20px;
  }
  
  .attendanceList th,
  .attendanceList td {
    font-size: 14px;
    padding: 10px;
  }

  .attendanceList {
    font-size: 14px;
  }

  .subjectTopicEntry textarea {
    height: 100px;
  }

  .subjectTopicEntry input,
  .subjectTopicEntry textarea {
    font-size: 14px;
  }

  button {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .attendanceList th,
  .attendanceList td {
    font-size: 12px;
    padding: 8px;
  }

  #btn-submit {
    font-size: 16px;
    width: 100%;
    left: 0;
    top: 0;
  }
    }
};

export default Marking;
