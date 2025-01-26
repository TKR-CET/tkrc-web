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
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>
      <div className="table-container">
        <div className="dropdown-container">
          <select
            id="section-dropdown"
            onChange={(e) => setSelectedCombination(e.target.value)}
            className="dropdown"
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

        <table className="table">
          <thead>
            <tr>
              <th className="header-title" colSpan={attendanceRecords.length + 4}>
                Attendance Register ({selectedCombination}) - {new Date().getFullYear()}
              </th>
            </tr>
            <tr>
              <th className="th">Roll No.</th>
              {attendanceRecords.map((record, index) => (
                <th key={index} className="th" colSpan={record.periods.length}>
                  {record.date}
                </th>
              ))}
              <th className="th">Total</th>
              <th className="th">Attend</th>
              <th className="th">%</th>
            </tr>
            <tr>
              <th className="th"></th>
              {attendanceRecords.map((record) =>
                record.periods.map((period, idx) => (
                  <th key={idx} className="th">
                    {period}
                  </th>
                ))
              )}
              <th className="th"></th>
              <th className="th"></th>
              <th className="th"></th>
            </tr>
          </thead>
          <tbody>
            {percentageData.length === 0 ? (
              <tr>
                <td className="th-td" colSpan={attendanceRecords.length + 4}>
                  <div className="no-data">No attendance records found</div>
                </td>
              </tr>
            ) : (
              percentageData.map((student, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "even-row" : "odd-row"}
                >
                  <td className="th-td">{student.rollNumber}</td>
                  {attendanceRecords.map((record) =>
                    record.students[student.rollNumber]
                      ? record.students[student.rollNumber].map((status, idx) => (
                          <td
                            key={idx}
                            className={status === "A" ? "absent" : "present"}
                          >
                            {status}
                          </td>
                        ))
                      : record.periods.map((_, idx) => (
                          <td key={idx} className="th-td">
                            -
                          </td>
                        ))
                  )}
                  <td className="th-td">{student.total}</td>
                  <td className="th-td">{student.attended}</td>
                  <td
                    className={`th-td ${
                      student.percentage < 75 ? "low-attendance" : ""
                    }`}
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