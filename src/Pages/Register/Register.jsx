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

  // State to track the loading status of the dropdown options
  const [isLoadingDropdown, setIsLoadingDropdown] = useState(true);
  
  // NEW: State to track if the table data is currently being fetched
  const [isFetchingTableData, setIsFetchingTableData] = useState(false);

  const mongoDbFacultyId = localStorage.getItem("facultyId");
  const token = localStorage.getItem("token"); // Retrieve JWT

  useEffect(() => {
    if (!mongoDbFacultyId) {
      setIsLoadingDropdown(false);
      return;
    }

    const fetchFacultyId = async () => {
      try {
        const response = await axios.get(
          `https://tkrc-backend.vercel.app/faculty/${mongoDbFacultyId}`, {
            headers: { Authorization: `Bearer ${token}` } // Attach Token
          }
        );
        setFacultyId(response.data.facultyId);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        setIsLoadingDropdown(false); 
      }
    };

    fetchFacultyId();
  }, [mongoDbFacultyId, token]);

  useEffect(() => {
    if (!facultyId) return;

    const fetchCombinations = async () => {
      try {
        const response = await axios.get(
          `https://tkrc-backend.vercel.app/faculty/${facultyId}/unique`, {
            headers: { Authorization: `Bearer ${token}` } // Attach Token
          }
        );
        setCombinations(response.data.uniqueCombinations || []);
      } catch (error) {
        console.error("Error fetching combinations:", error);
      } finally {
        setIsLoadingDropdown(false); 
      }
    };

    fetchCombinations();
  }, [facultyId, token]);

  useEffect(() => {
    if (!selectedCombination) return;

    const fetchAttendanceRecords = async () => {
      // NEW: Start the loading spinner inside the table
      setIsFetchingTableData(true);
      
      try {
        const [year, department, section, subject] = selectedCombination.split("|");
        const formattedYear = year.includes("B.Tech") ? year : `B.Tech ${year}`;

        const response = await axios.get(
          `https://tkrc-backend.vercel.app/Attendance/fetch-records?year=${encodeURIComponent(formattedYear)}&department=${encodeURIComponent(department)}&section=${encodeURIComponent(section)}&subject=${encodeURIComponent(subject)}`, {
            headers: { Authorization: `Bearer ${token}` } // Attach Token
          }
        );

        setAttendanceRecords(response.data.data || []);
        setPercentageData(response.data.percentageData || []);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
        // If there's an error, clear the table data so old data doesn't sit there
        setAttendanceRecords([]);
        setPercentageData([]);
      } finally {
        // NEW: Stop the loading spinner once the request completes
        setIsFetchingTableData(false);
      }
    };

    fetchAttendanceRecords();
  }, [selectedCombination, token]);

  return (
    <>
      <style>{`
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; box-sizing: border-box; background-color: #f5f5f5; }
        .navbar-container, .mobile-navbar-container { background-color: #004d99; color: white; padding: 10px; text-align: center; }
        .navbar-container { display: block; }
        .mobile-navbar-container { display: none; }
        @media (max-width: 768px) { .navbar-container { display: none; } .mobile-navbar-container { display: block; } }
        .dropdown-section { margin: 20px auto; text-align: center; padding: 0 20px; min-height: 50px; }
        .dropdown-menu { width: 100%; max-width: 300px; padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; background-color: #fff; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); transition: border-color 0.3s; }
        .dropdown-menu:focus { border-color: #004d99; outline: none; }
        
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: #004d99;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .table-header-title-container { text-align: center; margin-bottom: 20px; background-color: #ffffff; padding: 20px 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); border: 1px solid #d9d9d9; }
        .table-header-title { font-size: 22px; font-weight: 600; color: #2c3e50; text-transform: uppercase; margin: 0; letter-spacing: 1px; }
        .attendance-table-section { margin: 20px auto; width: 100%; max-width: 1200px; background-color: #fff; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); overflow-x: auto; }
        .attendance-table-wrapper { overflow-x: auto; padding: 0 5px; }
        .attendance-table { width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden; min-width: 800px; }
        .attendance-table th, .attendance-table td { padding: 10px; text-align: center; border: 1px solid #ddd; }
        .attendance-table th { background-color:#6495ED; color: white; font-weight: bold; }
        .even-row { background-color: #f9f9f9; }
        .odd-row { background-color: #fff; }
        .absent-cell { color: #ff4d4d; font-weight: bold; }
        .present-cell { color: #4caf50; font-weight: bold; }
        .low-attendance-percentage { background-color: #ffe6e6; color: #ff4d4d; font-weight: bold; }
        .high-attendance-percentage { background-color: #e6ffe6; color: #4caf50; font-weight: bold; }
        .no-attendance-data { color: #666; font-style: italic; background-color: #f5f5f5; text-align: center; }
        @media (max-width: 480px) { .attendance-table-section { margin: 10px auto; max-width: 100%; } .attendance-table-wrapper { overflow-x: auto; } .attendance-table { min-width: 600px; width: 100%; } .attendance-table th, .attendance-table td { font-size: 12px; padding: 5px; } .table-header-title { font-size: 14px; } .attendance-table th { padding: 8px; } .attendance-table td { padding: 5px; } .no-attendance-data { font-size: 12px; padding: 5px; } }
      `}</style>

      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>

      <div className="dropdown-section">
        {isLoadingDropdown ? (
          <div className="spinner"></div>
        ) : (
          <select
            id="section-selector"
            onChange={(e) => setSelectedCombination(e.target.value)}
            className="dropdown-menu"
          >
            <option value="">Select Section</option>
            {combinations.map((combo, index) => (
              <option
                key={index}
                value={`${combo.year}|${combo.department}|${combo.section}|${combo.subject}`}
              >
                {combo.year} {combo.department}-{combo.section} ({combo.subject})
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="attendance-table-section">
        <div className="table-header-title-container">
          <h3 className="table-header-title">
            Attendance Register ({selectedCombination ? selectedCombination.replace(/\|/g, " - ") : "None"}) - {new Date().getFullYear()}
          </h3>
        </div>

        <div className="attendance-table-wrapper">
          <table className="attendance-table">
            <thead>
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
              {/* NEW: 3-way conditional rendering: Loading -> Empty -> Data */}
              {isFetchingTableData ? (
                <tr>
                  {/* Using a high colSpan to ensure it spans across the entire table width */}
                  <td colSpan="100" style={{ padding: "40px 0" }}>
                    <div className="spinner"></div>
                  </td>
                </tr>
              ) : percentageData.length === 0 ? (
                <tr>
                  <td className="no-attendance-data" colSpan="100">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                percentageData.map((student, index) => (
                  <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
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
