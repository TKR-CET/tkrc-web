import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Register = () => {
  const [combinations, setCombinations] = useState([]);
  const [selectedCombination, setSelectedCombination] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [percentageData, setPercentageData] = useState([]);
  const [facultyId, setFacultyId] = useState(null);

  const mongoDbFacultyId = localStorage.getItem("facultyId");

  // Step 1: Fetch faculty-provided ID using MongoDB faculty _id
  useEffect(() => {
    if (!mongoDbFacultyId) return;

    const fetchFacultyId = async () => {
      try {
        const response = await axios.get(
          `https://tkrcet-backend-g3zu.onrender.com/faculty/${mongoDbFacultyId}`
        );
        setFacultyId(response.data.facultyId);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };

    fetchFacultyId();
  }, [mongoDbFacultyId]);

  // Step 2: Fetch unique class combinations based on facultyId
  useEffect(() => {
    if (!facultyId) return;

    const fetchCombinations = async () => {
      try {
        const response = await axios.get(
          `https://tkrcet-backend-g3zu.onrender.com/faculty/${facultyId}/unique`
        );
        setCombinations(response.data.uniqueCombinations || []);
      } catch (error) {
        console.error("Error fetching combinations:", error);
      }
    };

    fetchCombinations();
  }, [facultyId]);

  // Step 3: Fetch attendance records
  useEffect(() => {
    if (!selectedCombination) return;

    const fetchAttendanceRecords = async () => {
      try {
        const [year, department, section, subject] = selectedCombination.split("-");
        const response = await axios.get(
          `https://tkrcet-backend-g3zu.onrender.com/Attendance/fetch-records?year=B.Tech ${year}&department=${department}&section=${section}&subject=${subject}`
        );

        setAttendanceRecords(response.data.data || []);
        setPercentageData(response.data.percentageData || []);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
      }
    };

    fetchAttendanceRecords();
  }, [selectedCombination]);

  // **CSS Styles (Internal)**
  const styles = {
    tableContainer: {
      width: "100%",
      overflowX: "auto",
      margin: "20px auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      textAlign: "center",
    },
    thTd: {
      border: "1px solid #ddd",
      padding: "8px",
    },
    th: {
      backgroundColor: "#b3e5fc",
      color: "#4a148c",
      fontWeight: "bold",
    },
    headerTitle: {
      backgroundColor: "#e0f7fa",
      fontSize: "18px",
      fontWeight: "bold",
      textAlign: "center",
      padding: "10px",
    },
    present: {
      color: "green",
      fontWeight: "bold",
    },
    absent: {
      color: "red",
      fontWeight: "bold",
    },
    lowAttendance: {
      backgroundColor: "#ffccbc",
      fontWeight: "bold",
    },
  };

  return (
    <>
      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>
      <div style={styles.tableContainer}>
        <div className="dropdown-container">
          <select id="section-dropdown" onChange={(e) => setSelectedCombination(e.target.value)}>
            <option value="">Select Section</option>
            {combinations.map((combo, index) => (
              <option
                key={index}
                value={`${combo.year}-${combo.department}-${combo.section}-${combo.subject}`}
              >
                {combo.year} {combo.department}-{combo.section} ({combo.subject})
              </option>
            ))}
          </select>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.headerTitle} colSpan={attendanceRecords.length + 4}>
                Attendance Register ({selectedCombination}) - {new Date().getFullYear()}
              </th>
            </tr>
            <tr>
              <th style={styles.th}>Roll No.</th>
              {attendanceRecords.map((record, index) => (
                <th key={index} style={styles.th} colSpan={record.periods.length}>{record.date}</th>
              ))}
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Attend</th>
              <th style={styles.th}>%</th>
            </tr>
            <tr>
              <th style={styles.th}></th>
              {attendanceRecords.map((record) =>
                record.periods.map((period, idx) => (
                  <th key={idx} style={styles.th}>{period}</th>
                ))
              )}
              <th style={styles.th}></th>
              <th style={styles.th}></th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {percentageData.length === 0 ? (
              <tr>
                <td style={styles.thTd} colSpan={attendanceRecords.length + 4}>
                  No attendance records found
                </td>
              </tr>
            ) : (
              percentageData.map((student, index) => (
                <tr key={index}>
                  <td style={styles.thTd}>{student.rollNumber}</td>
                  {attendanceRecords.map((record) =>
                    record.students[student.rollNumber]
                      ? record.students[student.rollNumber].map((status, idx) => (
                          <td key={idx} style={status === "A" ? styles.absent : styles.present}>
                            {status}
                          </td>
                        ))
                      : record.periods.map((_, idx) => <td key={idx} style={styles.thTd}>-</td>)
                  )}
                  <td style={styles.thTd}>{student.total}</td>
                  <td style={styles.thTd}>{student.attended}</td>
                  <td
                    style={{
                      ...styles.thTd,
                      ...(student.percentage < 75 ? styles.lowAttendance : {}),
                    }}
                  >
                    {student.percentage}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Register;