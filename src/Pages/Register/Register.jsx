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

  // Fetch faculty ID based on MongoDB facultyId from localStorage
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

  // Fetch unique combinations for the dropdown based on facultyId
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

  // Fetch attendance records and percentage data based on the selected combination
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

  return (
    <>
      <Header />
      <div className="navbar-container">
        <NavBar />
      </div>
      <div className="mobile-navbar-container">
        <MobileNav />
      </div>

      {/* Dropdown Section */}
      <div className="dropdown-section">
        <select
          id="section-selector"
          onChange={(e) => setSelectedCombination(e.target.value)}
          className="dropdown-menu"
        >
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

      {/* Table Section */}
      <div className="attendance-table-section">
        <table className="attendance-table">
          <thead>
            <tr>
              <th className="table-header-title" colSpan={attendanceRecords.length + 4}>
                Attendance Register ({selectedCombination || "None"}) - {new Date().getFullYear()}
              </th>
            </tr>
            <tr>
              <th>Roll No.</th>
              {attendanceRecords.map((record, index) => (
                <th key={index} colSpan={record.periods.length}>
                  {record.date}
                </th>
              ))}
              <th>Total</th>
              <th>Attend</th>
              <th>%</th>
            </tr>
            <tr>
              <th></th>
              {attendanceRecords.map((record) =>
                record.periods.map((period, idx) => (
                  <th key={idx}>{period}</th>
                ))
              )}
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {percentageData.length === 0 ? (
              <tr>
                <td className="no-attendance-data" colSpan={attendanceRecords.length + 4}>
                  No attendance records found
                </td>
              </tr>
            ) : (
              percentageData.map((student, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "even-row" : "odd-row"}
                >
                  <td>{student.rollNumber}</td>
                  {attendanceRecords.map((record) =>
                    record.students[student.rollNumber]
                      ? record.students[student.rollNumber].map((status, idx) => (
                          <td key={idx} className={status === "A" ? "absent-cell" : "present-cell"}>
                            {status}
                          </td>
                        ))
                      : record.periods.map((_, idx) => <td key={idx}>-</td>)
                  )}
                  <td>{student.total}</td>
                  <td>{student.attended}</td>
                  <td
                    className={
                      student.percentage < 75 ? "low-attendance-percentage" : "high-attendance-percentage"
                    }
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