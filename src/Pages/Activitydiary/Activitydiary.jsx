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
  const mongoDbFacultyId = localStorage.getItem("facultyId"); 
  const token = localStorage.getItem("token"); // Retrieve JWT

  useEffect(() => {
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
      }
    };

    if (mongoDbFacultyId) {
      fetchProvidedFacultyId();
    }
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
      }
    };

    if (providedFacultyId) {
      fetchUniqueCombinations();
    }
  }, [providedFacultyId, token]);

  useEffect(() => {
    if (!selectedCombination) return;

    const fetchAttendanceRecords = async () => {
      try {
        const [year, department, section, subject] = selectedCombination.split("-");
        const response = await axios.get(
          `https://tkrc-backend.vercel.app/Attendance/filters?year=B.Tech ${year}&department=${department}&section=${section}&subject=${subject}`, {
            headers: { Authorization: `Bearer ${token}` } // Attach Token
          }
        );
        setAttendanceRecords(response.data.data || []);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
        setAttendanceRecords([]); 
      }
    };

    fetchAttendanceRecords();
  }, [selectedCombination, token]);

  const handleSelectionChange = (event) => {
    setSelectedCombination(event.target.value); 
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
      <div className="activity-container">
        <div className="activity-sidebar">
          <select id="section-dropdown" onChange={handleSelectionChange}>
            <option value="">Select Section</option>
            {combinations.map((combo, index) => (
              <option
                key={index}
                value={ `${combo.year}-${combo.department}-${combo.section}-${combo.subject}`}
              >
                {combo.year} {combo.department}-{combo.section} ({combo.subject})
              </option>
            ))}
          </select>
        </div>

        <div className="activity-content">
          <h2 id="activity-title">
            Activity Diary Section: {selectedCombination || "None"}
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
              {attendanceRecords.length === 0 ? (
                <tr>
                  <td colSpan="6">No attendance records found</td>
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
