import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav.jsx";
import "./Activitydiary.css";

const ActivityDiary = () => {
  const [combinations, setCombinations] = useState([]); 
  const [attendanceRecords, setAttendanceRecords] = useState([]); 
  const [selectedCombination, setSelectedCombination] = useState(""); 
  const [providedFacultyId, setProvidedFacultyId] = useState(null); 
  
  // NEW: Loading states for UX
  const [isLoadingDropdown, setIsLoadingDropdown] = useState(true);
  const [isFetchingTableData, setIsFetchingTableData] = useState(false);

  const mongoDbFacultyId = localStorage.getItem("facultyId"); 
  const token = localStorage.getItem("token"); // Retrieve JWT

  useEffect(() => {
    // Stop dropdown loading immediately if there is no faculty ID
    if (!mongoDbFacultyId) {
      setIsLoadingDropdown(false);
      return;
    }

    const fetchProvidedFacultyId = async () => {
      try {
        const response = await axios.get(
          `https://tkrc-backend.vercel.app/faculty/${mongoDbFacultyId}`, {
            headers: { Authorization: `Bearer ${token}` } // Attach Token
          }
        );
        setProvidedFacultyId(response.data); 
      } catch (error) {
        console.error("Error fetching faculty-provided ID:", error);
        setIsLoadingDropdown(false); // Stop loading on error
      }
    };

    fetchProvidedFacultyId();
  }, [mongoDbFacultyId, token]);

  useEffect(() => {
    const fetchUniqueCombinations = async () => {
      if (!providedFacultyId) return;

      try {
        const response = await axios.get(
          `https://tkrc-backend.vercel.app/faculty/${providedFacultyId.facultyId}/unique`, {
            headers: { Authorization: `Bearer ${token}` } // Attach Token
          }
        );
        setCombinations(response.data.uniqueCombinations || []);
      } catch (error) {
        console.error("Error fetching unique combinations:", error);
      } finally {
        setIsLoadingDropdown(false); // Stop loading once data is fetched
      }
    };

    fetchUniqueCombinations();
  }, [providedFacultyId, token]);

  useEffect(() => {
    if (!selectedCombination) return;

    const fetchAttendanceRecords = async () => {
      setIsFetchingTableData(true); // Start table loading spinner

      try {
        // FIX 1: Split using the new safe '|' delimiter
        const [year, department, section, subject] = selectedCombination.split("|");
        
        // FIX 2: Prevent duplicating "B.Tech" if it's already in the string
        const formattedYear = year.includes("B.Tech") ? year : `B.Tech ${year}`;

        // FIX 3: Encode the URI components to handle spaces safely
        const response = await axios.get(
          `https://tkrc-backend.vercel.app/Attendance/filters?year=${encodeURIComponent(formattedYear)}&department=${encodeURIComponent(department)}&section=${encodeURIComponent(section)}&subject=${encodeURIComponent(subject)}`, {
            headers: { Authorization: `Bearer ${token}` } // Attach Token
          }
        );
        setAttendanceRecords(response.data.data || []);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
        setAttendanceRecords([]); 
      } finally {
        setIsFetchingTableData(false); // Stop table loading spinner
      }
    };

    fetchAttendanceRecords();
  }, [selectedCombination, token]);

  const handleSelectionChange = (event) => {
    setSelectedCombination(event.target.value); 
  };

  return (
    <div>
      {/* Adding spinner styles directly to ensure it works globally with the component */}
      <style>{`
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
      `}</style>

      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>
      
      <div className="activity-container">
        <div className="activity-sidebar">
          {/* Conditional rendering for the dropdown loading state */}
          {isLoadingDropdown ? (
            <div className="spinner" style={{ marginTop: "20px" }}></div>
          ) : (
            <select id="section-dropdown" onChange={handleSelectionChange}>
              <option value="">Select Section</option>
              {combinations.map((combo, index) => (
                <option
                  key={index}
                  // FIX 1: Changing this value to use '|' instead of '-'
                  value={`${combo.year}|${combo.department}|${combo.section}|${combo.subject}`}
                >
                  {combo.year} {combo.department}-{combo.section} ({combo.subject})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="activity-content">
          <h2 id="activity-title">
            {/* Replaces the pipes with a hyphen for a cleaner display title */}
            Activity Diary Section: {selectedCombination ? selectedCombination.replace(/\|/g, " - ") : "None"}
          </h2>
          <table id="activity-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date</th>
                <th>Period</th>
                <th>Topic</th>
                <th>Remark</th>
                <th>Absentees</th>
              </tr>
            </thead>
            <tbody>
              {/* 3-way conditional rendering: Loading -> Empty -> Data */}
              {isFetchingTableData ? (
                <tr>
                  <td colSpan="6" style={{ padding: "40px 0", textAlign: "center" }}>
                    <div className="spinner"></div>
                  </td>
                </tr>
              ) : attendanceRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    No attendance records found
                  </td>
                </tr>
              ) : (
                attendanceRecords.map((record, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{record.date}</td>
                    <td>{record.period}</td>
                    <td>{record.topic || "N/A"}</td>
                    <td>{record.remarks || "N/A"}</td>
                    <td>
                      {record.attendance
                        .filter((entry) => entry.status === "absent")
                        .map((entry) => entry.rollNumber)
                        .join(", ") || "None"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityDiary;
