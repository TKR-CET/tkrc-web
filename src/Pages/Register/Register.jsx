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
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message

  // Fetch faculty-provided ID using MongoDB _id
  useEffect(() => {
    const fetchProvidedFacultyId = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://tkrcet-backend-g3zu.onrender.com/faculty/${mongoDbFacultyId}`
        );
        setProvidedFacultyId(response.data); // Store the faculty object
      } catch (error) {
        setError("Error fetching faculty-provided ID.");
        console.error(error);
      } finally {
        setLoading(false);
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
        setLoading(true);
        const response = await axios.get(
          `https://tkrcet-backend-g3zu.onrender.com/faculty/${providedFacultyId.facultyId}/unique`
        );
        setCombinations(response.data.uniqueCombinations || []);
      } catch (error) {
        setError("Error fetching unique combinations.");
        console.error(error);
      } finally {
        setLoading(false);
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
        setLoading(true);
        const [year, department, section, subject] = selectedCombination.split("-");
        const response = await axios.get(
          `https://tkrcet-backend-g3zu.onrender.com/Attendance/filters?year=B.Tech ${year}&department=${department}&section=${section}&subject=${subject}`
        );

        const data = response.data || {};
        setAttendanceRecords(data.students || []);
        setDates(data.dates || []);
        setPeriods(data.periods || []);
      } catch (error) {
        setError("Error fetching attendance records.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [selectedCombination]);

  const handleSelectionChange = (event) => {
    setSelectedCombination(event.target.value); // Update selected combination
    setError(""); // Clear any previous error
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
          <select
            id="section-dropdown"
            onChange={handleSelectionChange}
            disabled={loading || combinations.length === 0}
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

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {/* Attendance Table */}
        <table className="attendance-table">
          <thead>
            <tr>
              <th colSpan={dates.length * periods.length + 4} className="header-title">
                Attendance Register Section: {selectedCombination || "None"}
              </th>
            </tr>
            <tr>
              <th>Roll No.</th>
              {dates.map((date) => (
                <th key={date} colSpan={periods.length}>
                  {date}
                </th>
              ))}
              <th>Total</th>
              <th>Attend</th>
              <th>%</th>
            </tr>
            <tr>
              <th></th>
              {dates.flatMap((date) =>
                periods.map((period, index) => <th key={`${date}-${period}-${index}`}>P{period}</th>)
              )}
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.length === 0 ? (
              <tr>
                <td colSpan={dates.length * periods.length + 4}>No attendance records found</td>
              </tr>
            ) : (
              attendanceRecords.map((student, index) => (
                <tr key={index}>
                  <td>{student.rollNo}</td>
                  {dates.flatMap((date) =>
                    periods.map((period, idx) => {
                      const attendanceStatus =
                        student.attendance?.[date]?.[period] || "A";
                      return (
                        <td
                          key={`${student.rollNo}-${date}-${period}-${idx}`}
                          className={attendanceStatus === "A" ? "absent" : "present"}
                        >
                          {attendanceStatus}
                        </td>
                      );
                    })
                  )}
                  <td>{student.total || 0}</td>
                  <td>{student.attended || 0}</td>
                  <td className={student.percentage === 0 ? "zero-percent" : "low-percent"}>
                    {student.percentage ? student.percentage.toFixed(2) : "0.00"}
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