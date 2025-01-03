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
  container: {
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    backgroundColor: "#333",
    color: "white",
  },
  mobileNav: {
    display: "none",
  },
  main: {
    margin: "20px auto",
    maxWidth: "900px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  },
  details: {
    marginBottom: "20px",
  },
  periodSection: {
    marginBottom: "10px",
  },
  periodLabel: {
    marginRight: "10px",
  },
  inputSection: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "5px",
  },
  input: {
    marginBottom: "10px",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
  },
  textarea: {
    marginBottom: "10px",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
    resize: "none",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  tableHeader: {
    border: "1px solid #ddd",
    padding: "8px",
    backgroundColor: "#333",
    color: "white",
    textAlign: "left",
  },
  tableCell: {
    border: "1px solid #ddd",
    padding: "8px",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Marking;
