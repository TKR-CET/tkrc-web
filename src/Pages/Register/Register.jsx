import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";
import "./Register.css";

const Register = () => {
  const [combinations, setCombinations] = useState([]); // Dropdown options
  const [selectedCombination, setSelectedCombination] = useState(""); // Selected dropdown value
  const [attendanceRecords, setAttendanceRecords] = useState([]); // Attendance data
  const [providedFacultyId, setProvidedFacultyId] = useState(null); // Faculty object
  const mongoDbFacultyId = localStorage.getItem("facultyId"); // Faculty ID from local storage

  // Fetch faculty-provided ID using MongoDB faculty _id
  useEffect(() => {
    if (!mongoDbFacultyId) return;

    const fetchProvidedFacultyId = async () => {
      try {
        const response = await axios.get(
          `https://tkrcet-backend-g3zu.onrender.com/faculty/${mongoDbFacultyId}`
        );
        setProvidedFacultyId(response.data); // Store faculty details
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };

    fetchProvidedFacultyId();
  }, [mongoDbFacultyId]);

  // Fetch unique class combinations
  useEffect(() => {
    if (!providedFacultyId) return;

    const fetchCombinations = async () => {
      try {
        const response = await axios.get(
          `https://tkrcet-backend-g3zu.onrender.com/faculty/${providedFacultyId.facultyId}/unique`
        );
        setCombinations(response.data.uniqueCombinations || []);
      } catch (error) {
        console.error("Error fetching combinations:", error);
      }
    };

    fetchCombinations();
  }, [providedFacultyId]);

  // Fetch attendance records dynamically
  useEffect(() => {
    if (!selectedCombination) return;

    const fetchAttendanceRecords = async () => {
      try {
        const [year, department, section, subject] = selectedCombination.split("-");
        const response = await axios.get(
          `https://tkrcet-backend-g3zu.onrender.com/Attendance/filters?year=B.Tech ${year}&department=${department}&section=${section}&subject=${subject}`
        );

        const data = response.data.data || [];
        setAttendanceRecords(data);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
      }
    };

    fetchAttendanceRecords();
  }, [selectedCombination]);

  // Handle dropdown selection
  const handleSelectionChange = (event) => {
    setSelectedCombination(event.target.value);
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
      <div className="table-container">
        {/* Dropdown for selecting a section */}
        <div className="dropdown-container">
          <select id="section-dropdown" onChange={handleSelectionChange}>
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

        {/* Attendance Table */}
        <table className="attendance-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Date</th>
              <th>Period</th>
              <th>Subject</th>
              <th>Topic</th>
              <th>Remarks</th>
              <th>Absentees</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.length === 0 ? (
              <tr>
                <td colSpan="7">No attendance records found</td>
              </tr>
            ) : (
              attendanceRecords.map((record, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{record.date}</td>
                  <td>{record.period}</td>
                  <td>{record.subject}</td>
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
    </>
  );
};

export default Register;
