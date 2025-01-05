import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";
import "./Attendance.css";
const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [batches, setBatches] = useState(["Batch A", "Batch B", "Batch C"]); // Example batches
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch("https://tkrcet-backend.onrender.com/attendance/all");
        const data = await response.json();
        setAttendanceData(data);
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendance();
  }, []);

  const handleFilter = () => {
    const filtered = attendanceData.filter((record) => {
      const matchesBatch = selectedBatch ? record.batch === selectedBatch : true;
      const matchesDate = selectedDate ? record.date === selectedDate : true;
      return matchesBatch && matchesDate;
    });
    setFilteredData(filtered);
  };

  return (
    <div>
      <Header />
      <NavBar />
      <MobileNav />
      <div className="attendanceMain">
        <h2>Attendance Records</h2>
        <div className="filterSection">
          <label>
            Batch:
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              <option value="">All</option>
              {batches.map((batch, index) => (
                <option key={index} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
          </label>
          <label>
            Date:
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </label>
          <button onClick={handleFilter}>Go</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Batch</th>
              <th>Periods</th>
              <th>Subject</th>
              <th>Absent Roll Numbers</th>
              <th>Topic</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td>{record.batch}</td>
                <td>{record.periods.join(", ")}</td>
                <td>{record.subject}</td>
                <td>
                  {record.attendance
                    .filter((att) => att.status === "absent")
                    .map((att) => att.rollNumber)
                    .join(", ")}
                </td>
                <td>{record.topic}</td>
                <td>{record.remarks}</td>
                <td>
                  <Link
                    to={`/mark?date=${record.date}&batch=${record.batch}&periods=${record.periods.join(
                      ","
                    )}&subject=${record.subject}&topic=${record.topic}&remarks=${record.remarks}`}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
