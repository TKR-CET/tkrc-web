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
      <style>
        {`
          .table-container {
            width: 100%;
            overflow-x: auto;
            margin: 30px auto;
            padding: 0 10px;
            background-color: #fafafa;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .dropdown-container {
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .dropdown {
            padding: 10px;
            font-size: 16px;
            width: 250px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #fff;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }

          table {
            width: 100%;
            border-collapse: collapse;
            text-align: center;
            margin-bottom: 20px;
          }

          th,
          td {
            border: 1px solid #000;
            padding: 12px 15px;
            font-size: 14px;
          }

          th {
            background-color: #f5f5f5;
            color: #000;
            font-weight: bold;
            text-transform: uppercase;
          }

          .header-title {
            background-color: #f5f5f5;
            color: #000;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            padding: 15px 0;
            border-radius: 8px;
            margin-bottom: 20px;
          }

          .present {
            color: #4caf50;
            font-weight: bold;
          }

          .absent {
            color: #f44336;
            font-weight: bold;
          }

          .low-attendance {
            background-color: #ffebee;
            font-weight: bold;
          }

          .no-data {
            text-align: center;
            font-size: 18px;
            color: #757575;
            padding: 20px 0;
          }
        `}
      </style>
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

        <table>
          <thead>
            <tr>
              <th className="header-title" colSpan={attendanceRecords.length + 4}>
                Attendance Register ({selectedCombination}) - {new Date().getFullYear()}
              </th>
            </tr>
            <tr>
              <th>Roll No.</th>
              {attendanceRecords.map((record, index) => (
                <th key={index} colSpan={record.periods.length}>{record.date}</th>
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
                <td className="no-data" colSpan={attendanceRecords.length + 4}>
                  No attendance records found
                </td>
              </tr>
            ) : (
              percentageData.map((student, index) => (
                <tr key={index} style={index % 2 === 0 ? { backgroundColor: "#f9f9f9" } : {}}>
                  <td>{student.rollNumber}</td>
                  {attendanceRecords.map((record) =>
                    record.students[student.rollNumber]
                      ? record.students[student.rollNumber].map((status, idx) => (
                          <td key={idx} className={status === "A" ? "absent" : "present"}>
                            {status}
                          </td>
                        ))
                      : record.periods.map((_, idx) => <td key={idx}>-</td>)
                  )}
                  <td>{student.total}</td>
                  <td>{student.attended}</td>
                  <td className={student.percentage < 75 ? "low-attendance" : ""}>
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