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
  const [allStudents, setAllStudents] = useState([]); // All students in the class
  const [percentageData, setPercentageData] = useState([]); // Attendance percentage
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
        setProvidedFacultyId(response.data);
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
          `https://tkrcet-backend-g3zu.onrender.com/Attendance/fetch-records?year=B.Tech ${year}&department=${department}&section=${section}&subject=${subject}`
        );

        const { data, percentageData } = response.data || {};
        setAttendanceRecords(data || []);
        setPercentageData(percentageData || []);

        // Get all unique roll numbers
        const students = Array.from(
          new Set(
            data.flatMap((record) => record.students.map((entry) => entry.rollNumber))
          )
        ).map((rollNumber) => ({
          rollNumber,
          name:
            data.find((record) =>
              record.students.find((entry) => entry.rollNumber === rollNumber)
            )?.students.find((entry) => entry.rollNumber === rollNumber)?.name || "",
        }));

        setAllStudents(students);
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
              <th>Roll No.</th>
              <th>Name</th>
              {attendanceRecords.map((record, index) => (
                <th key={index}>
                  {record.date}
                  <table>
                    <thead>
                      <tr>
                        {record.periods.map((period, pIndex) => (
                          <th key={pIndex}>P{period}</th>
                        ))}
                      </tr>
                    </thead>
                  </table>
                </th>
              ))}
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {allStudents.length === 0 ? (
              <tr>
                <td colSpan={attendanceRecords.length + 4}>No students found</td>
              </tr>
            ) : (
              allStudents.map((student, index) => {
                const percentageEntry = percentageData.find(
                  (entry) => entry.rollNumber === student.rollNumber
                );
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{student.rollNumber}</td>
                    <td>{student.name}</td>
                    {attendanceRecords.map((record, recordIndex) => (
                      <td key={recordIndex}>
                        <table>
                          <tbody>
                            <tr>
                              {record.students
                                .find((entry) => entry.rollNumber === student.rollNumber)
                                ?.statuses.map((status, sIndex) => (
                                  <td key={sIndex} className={status === "A" ? "absent" : "present"}>
                                    {status}
                                  </td>
                                ))}
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    ))}
                    <td>{percentageEntry ? `${percentageEntry.percentage}%` : "N/A"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Register;