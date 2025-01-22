import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";
import "./Register.css";

const Register = () => {
  const [combinations, setCombinations] = useState([]); // Dropdown options
  const [selectedCombination, setSelectedCombination] = useState(""); // Selected dropdown value
  const [attendanceRecords, setAttendanceRecords] = useState([]); // Attendance data for the table
  const [dates, setDates] = useState([]); // Dates for the attendance table
  const [periods, setPeriods] = useState([]); // Periods for the attendance table
  const [providedFacultyId, setProvidedFacultyId] = useState(null); // Faculty object
  const mongoDbFacultyId = localStorage.getItem("facultyId"); // Retrieve MongoDB _id from local storage

  useEffect(() => {
    // Fetch faculty-provided ID using MongoDB _id
    const fetchProvidedFacultyId = async () => {
      try {
        const response = await axios.get(
          `https://tkrcet-backend-g3zu.onrender.com/faculty/${mongoDbFacultyId}`
        );
        setProvidedFacultyId(response.data); // Store the faculty object
      } catch (error) {
        console.error("Error fetching faculty-provided ID:", error);
      }
    };

    if (mongoDbFacultyId) {
      fetchProvidedFacultyId();
    }
  }, [mongoDbFacultyId]);

  // Fetch unique combinations for the dropdown
  useEffect(() => {
    const fetchCombinations = async () => {
      if (!providedFacultyId) return;

      try {
        const response = await axios.get(
          `https://tkrcet-backend-g3zu.onrender.com/faculty/${providedFacultyId.facultyId}/unique`
        );
        setCombinations(response.data.uniqueCombinations || []);
      } catch (error) {
        console.error("Error fetching unique combinations:", error);
      }
    };

    if (providedFacultyId) {
      fetchCombinations();
    }
  }, [providedFacultyId]);

  // Fetch attendance records based on selected combination
  useEffect(() => {
    if (!selectedCombination) return;

    const fetchAttendanceRecords = async () => {
      try {
        const [year, department, section, subject] = selectedCombination.split("-");
        const response = await axios.get(
          `https://tkrcet-backend-g3zu.onrender.com/Attendance/filters?year=B.Tech ${year}&department=${department}&section=${section}&subject=${subject}`
        );

        const data = response.data || {};
        setAttendanceRecords(data.students || []);
        setDates(data.dates || []);
        setPeriods(data.periods || []);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
      }
    };

    fetchAttendanceRecords();
  }, [selectedCombination]);

  const handleSelectionChange = (event) => {
    setSelectedCombination(event.target.value); // Update selected combination
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
      {/* Dropdown for selecting combination */}
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
            <th colSpan={dates.length + 4} className="header-title">
              Attendance Register Section: {selectedCombination || "None"}
            </th>
          </tr>
          <tr>
            <th>Roll No.</th>
            {dates.map((date, index) => (
              <th key={index} colSpan="2">{date}</th>
            ))}
            <th>Total</th>
            <th>Attend</th>
            <th>%</th>
          </tr>
          <tr>
            <th></th>
            {periods.map((period, index) => (
              <th key={index}>{period}</th>
            ))}
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.length === 0 ? (
            <tr>
              <td colSpan={dates.length + 4}>No attendance records found</td>
            </tr>
          ) : (
            attendanceRecords.map((student, index) => (
              <tr key={index}>
                <td>{student.rollNo}</td>
                {student.attendance.map((att, idx) => (
                  <td key={idx} className={att === "A" ? "absent" : "present"}>{att}</td>
                ))}
                <td>{student.total}</td>
                <td>{student.attended}</td>
                <td className={student.percentage === 0 ? "zero-percent" : "low-percent"}>
                  {student.percentage.toFixed(2)}</td>
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
