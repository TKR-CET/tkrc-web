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
  const [dates, setDates] = useState([]); // Dates from the database
  const [periods, setPeriods] = useState([]); // Periods for each date
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
                    <td key={idx} className={att === "A" ? "absent" : "present"}>
                      {att}
                    </td>
                  ))}
                  <td>{student.total}</td>
                  <td>{student.attended}</td>
                  <td className={student.percentage < 50 ? "low-percent" : ""}>
                    {student.percentage.toFixed(2)}
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