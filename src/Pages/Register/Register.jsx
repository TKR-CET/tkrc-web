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
      <style>{`
        /* General Styles */
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          background-color: #f5f5f5;
        }

        /* Navbar Styling */
        .navbar-container,
        .mobile-navbar-container {
          background-color: #004d99;
          color: white;
          padding: 10px;
          text-align: center;
        }

        .navbar-container {
          display: block;
        }

        .mobile-navbar-container {
          display: none;
        }

        @media (max-width: 768px) {
          .navbar-container {
            display: none;
          }
          .mobile-navbar-container {
            display: block;
          }
        }

        /* Dropdown Section */
        .dropdown-section {
          margin: 20px auto;
          text-align: center;
          padding: 0 20px;
        }

        .dropdown-menu {
          width: 100%;
          max-width: 300px;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #fff;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          transition: border-color 0.3s;
        }

        .dropdown-menu:focus {
          border-color: #004d99;
          outline: none;
        }

        /* Table Section */
        .attendance-table-section {
          margin: 20px auto;
          width: 100%;
          max-width: 1200px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          overflow-x: auto;
        }

        .attendance-table-wrapper {
          overflow-x: auto;
          padding: 0 5px;
        }

        .attendance-table {
          width: 100%;
          border-collapse: collapse;
          border-radius: 8px;
          overflow: hidden;
          min-width: 800px;
        }

        .attendance-table th,
        .attendance-table td {
          padding: 10px;
          text-align: center;
          border: 1px solid #ddd;
        }

        .attendance-table th {
          background-color: #2c3e50;
          color: white;
          font-weight: bold;
        }

        /* Header Title Style */
        .table-header-title {
          font-size: 20px;
          font-weight: bold;
          color: #004d99; /* Use a distinct color */
          text-transform: uppercase;
          background-color: #e6f2ff;
          text-align: center;
          padding: 15px;
          border-bottom: 2px solid #004d99;
        }

        .even-row {
          background-color: #f9f9f9;
        }

        .odd-row {
          background-color: #fff;
        }

        .absent-cell {
          color: #ff4d4d;
          font-weight: bold;
        }

        .present-cell {
          color: #4caf50;
          font-weight: bold;
        }

        .low-attendance-percentage {
          background-color: #ffe6e6;
          color: #ff4d4d;
          font-weight: bold;
        }

        .high-attendance-percentage {
          background-color: #e6ffe6;
          color: #4caf50;
          font-weight: bold;
        }

        .no-attendance-data {
          color: #666;
          font-style: italic;
          background-color: #f5f5f5;
          text-align: center;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 480px) {
          .attendance-table-section {
            margin: 10px auto;
            max-width: 100%;
          }

          .attendance-table-wrapper {
            overflow-x: auto;
          }

          .attendance-table {
            min-width: 600px;
            width: 100%;
          }

          .attendance-table th,
          .attendance-table td {
            font-size: 12px;
            padding: 5px;
          }

          .table-header-title {
            font-size: 14px;
          }

          .attendance-table th {
            padding: 8px;
          }

          .attendance-table td {
            padding: 5px;
          }

          .no-attendance-data {
            font-size: 12px;
            padding: 5px;
          }
        }
      `}</style>

      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
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
        <div className="attendance-table-wrapper">
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
      </div>
    </>
  );
};

export default Register;