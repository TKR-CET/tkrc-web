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
    if (!subject || !topic || !remarks) {
      alert("Please fill in all the fields.");
      return;
    }

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
    <div style={styles.attendanceMain}>
      <Header />
      <div style={styles.nav}>
        <NavBar />
      </div>
      <div style={styles.mobileNav}>
        <MobileNav />
      </div>
      <div style={styles.main}>
        <h2 style={styles.attendanceHeading}>Attendance on {date}</h2>
        <div style={styles.attendanceDetails}>
          <div style={styles.periodSelection}>
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
          <div style={styles.subjectTopicEntry}>
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
        <table style={styles.attendanceList}>
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
  attendanceMain: {
    padding: "25px",
    backgroundColor: "#fff",
    margin: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  attendanceHeading: {
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  attendanceDetails: {
    marginBottom: "20px",
  },
  periodSelection: {
    marginBottom: "15px",
  },
  label: {
    fontSize: "18px",
  },
  periodLabel: {
    fontSize: "18px",
    marginRight: "12px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginTop: "6px",
    marginBottom: "12px",
    borderRadius: "5px",
    border: "1px solid #dcdcdc",
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "12px",
    marginTop: "6px",
    marginBottom: "12px",
    borderRadius: "5px",
    border: "1px solid #dcdcdc",
  },
  attendanceList: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "22px",
  },
  tableHeader: {
    textAlign: "center",
    padding: "14px",
    border: "1px solid #ddd",
    backgroundColor: "#f7f7f7",
    fontWeight: "bold",
  },
  tableCell: {
    textAlign: "center",
    padding: "14px",
    border: "1px solid #ddd",
  },
  submitButton: {
    backgroundColor: "#FF5733",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "18px",
    marginTop: "10px",
  },
};

export default Marking;
