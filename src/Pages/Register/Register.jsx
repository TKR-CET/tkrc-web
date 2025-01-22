import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";
import "./Register.css";

const Register = () => {
  const [combinations, setCombinations] = useState([]); // Dropdown options
  const [selectedCombination, setSelectedCombination] = useState(""); // Selected dropdown value
  const [attendanceData, setAttendanceData] = useState([]); // Fetched attendance records
  const [dates, setDates] = useState([]); // Unique dates
  const [periods, setPeriods] = useState([]); // Periods grouped by date

  // Fetch unique combinations for dropdown
  useEffect(() => {
    const fetchCombinations = async () => {
      try {
        const response = await axios.get(
          `https://tkrcet-backend-g3zu.onrender.com/faculty/unique`
        );
        setCombinations(response.data.uniqueCombinations || []);
      } catch (error) {
        console.error("Error fetching combinations:", error);
      }
    };

    fetchCombinations();
  }, []);

  // Fetch attendance records based on selected combination
  useEffect(() => {
    if (!selectedCombination) return;

    const fetchAttendanceRecords = async () => {
      try {
        const [year, department, section, subject] = selectedCombination.split("-");
        const response = await axios.get(
          `https://tkrcet-backend-g3zu.onrender.com/Attendance/filters`,
          {
            params: { year, department, section, subject },
          }
        );

        const rawData = response.data.data || [];
        setAttendanceData(rawData);

        // Extract unique dates and periods
        const uniqueDates = [...new Set(rawData.map((record) => record.date))];
        const periodsByDate = uniqueDates.map((date) =>
          rawData
            .filter((record) => record.date === date)
            .map((record) => record.period)
        );

        setDates(uniqueDates);
        setPeriods(periodsByDate);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
      }
    };

    fetchAttendanceRecords();
  }, [selectedCombination]);

  const handleSelectionChange = (event) => {
    setSelectedCombination(event.target.value);
  };

  const renderTableRows = () => {
    if (attendanceData.length === 0) {
      return (
        <tr>
          <td colSpan={dates.length * 2 + 3}>No attendance records found</td>
        </tr>
      );
    }

    const students = {};

    // Process student data
    attendanceData.forEach((record) => {
      record.attendance.forEach((student) => {
        if (!students[student.rollNumber]) {
          students[student.rollNumber] = {
            rollNo: student.rollNumber,
            name: student.name,
            attendance: {},
            total: 0,
            attended: 0,
          };
        }

        // Mark attendance for the specific date and period
        students[student.rollNumber].attendance[`${record.date}-${record.period}`] =
          student.status === "present" ? "P" : "A";

        // Update totals
        students[student.rollNumber].total++;
        if (student.status === "present") {
          students[student.rollNumber].attended++;
        }
      });
    });

    // Calculate percentages
    Object.values(students).forEach((student) => {
      student.percentage =
        student.attended > 0 ? (student.attended / student.total) * 100 : 0;
    });

    // Render rows
    return Object.values(students).map((student, index) => (
      <tr key={index}>
        <td>{student.rollNo}</td>
        {dates.map((date) =>
          periods[dates.indexOf(date)].map((period) => {
            const attendanceStatus =
              student.attendance[`${date}-${period}`] || "-";
            return (
              <td
                key={`${date}-${period}`}
                className={attendanceStatus === "A" ? "absent" : "present"}
              >
                {attendanceStatus}
              </td>
            );
          })
        )}
        <td>{student.total}</td>
        <td>{student.attended}</td>
        <td
          className={
            student.percentage === 0
              ? "zero-percent"
              : student.percentage < 75
              ? "low-percent"
              : ""
          }
        >
          {student.percentage.toFixed(2)}
        </td>
      </tr>
    ));
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
                <th key={index} colSpan={periods[index].length}>
                  {date}
                </th>
              ))}
              <th>Total</th>
              <th>Attend</th>
              <th>%</th>
            </tr>
            <tr>
              <th></th>
              {periods.map((periodGroup, dateIndex) =>
                periodGroup.map((period, periodIndex) => (
                  <th key={`${dateIndex}-${periodIndex}`}>P{period}</th>
                ))
              )}
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>{renderTableRows()}</tbody>
        </table>
      </div>
    </>
  );
};

export default Register;