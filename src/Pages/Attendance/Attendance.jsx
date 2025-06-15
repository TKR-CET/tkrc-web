import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Attendance.css";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Attendance = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const programYear = queryParams.get("programYear");
  const department = queryParams.get("department");
  const section = queryParams.get("section");
  const subject = queryParams.get("subject");

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [markedPeriods, setMarkedPeriods] = useState([]);
  const [editPermissions, setEditPermissions] = useState({});
  const [facultyId, setFacultyId] = useState("");

  const todayDate = new Date().toISOString().split("T")[0];
  const facultyMongoId = localStorage.getItem("facultyId"); // MongoDB `_id`

  useEffect(() => {
    const fetchFacultyDetails = async () => {
      try {
        if (facultyMongoId) {
          const response = await axios.get(
            `https://tkrc-backend.vercel.app/faculty/${facultyMongoId}`
          );
          console.log("Faculty details fetched:", response.data);
          setFacultyId(response.data.facultyId); // Extract actual facultyId (e.g., D600)
        }
      } catch (error) {
        console.error("Error fetching faculty details:", error);
      }
    };

    fetchFacultyDetails();
  }, [facultyMongoId]);

  useEffect(() => {
    fetchAttendanceRecords();
  }, [date]);

  const fetchAttendanceRecords = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `https://tkrc-backend.vercel.app/Attendance/date?date=${date}`
      );

      if (response.data && Array.isArray(response.data.data)) {
        const processedData = response.data.data.map((record) => ({
          ...record,
          classDetails: `${record.year} ${record.department}-${record.section}`,
          absentees: record.attendance
            .filter((student) => student.status === "absent")
            .map((student) => student.rollNumber),
        }));

        setAttendanceData(processedData);
        setMarkedPeriods(processedData.map((record) => record.period));
      } else {
        throw new Error(`No attendance records found for ${date}.`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkEditPermission = async (record) => {
    try {
      if (!facultyId) return;

      console.log("Checking edit permission for:", record);

      const response = await axios.get(
        `https://tkrc-backend.vercel.app/Attendance/checkEditPermission?facultyId=${facultyId}&year=${record.year}&department=${record.department}&section=${record.section}&date=${record.date}`
      );
      const data = response.data;

      console.log("Edit permission response:", data);

      setEditPermissions((prev) => ({
        ...prev,
        [`${record.date}-${record.section}`]: data.canEdit,
      }));
    } catch (err) {
      console.error("Error checking edit permission:", err);
    }
  };

  useEffect(() => {
    if (facultyId && attendanceData.length > 0) {
      attendanceData.forEach((record) => {
        if (record.date !== todayDate) {
          checkEditPermission(record);
        }
      });
    }
  }, [facultyId, attendanceData]);

  const handleGoClick = () => {
    const selectedDate = new Date(date).toISOString().split("T")[0];
    if (selectedDate !== todayDate) {
      alert("You can only mark attendance for today's date.");
      setDate(todayDate);
    } else {
      navigate(
        `/mark?programYear=${programYear}&department=${department}&section=${section}&subject=${subject}&date=${date}`
      );
    }
  };

  const handleEdit = (record) => {
    const canEdit =
      record.date === todayDate || editPermissions[`${record.date}-${record.section}`] === true;

    if (canEdit) {
      navigate(
        `/mark?programYear=${record.year}&department=${record.department}&section=${record.section}&subject=${record.subject}&date=${record.date}&editPeriod=${record.period}`
      );
    }
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
    <div className="attendance-container">
 
  
  <div className="attendance-header">
    <div className="date-selector-container">
      <label htmlFor="date" className="date-label">Select Date: </label>
      <input 
        type="date" 
        id="date" 
        className="date-input"
        value={date} 
        onChange={(e) => setDate(e.target.value)} 
      />
      <button onClick={handleGoClick} className="go-button">Go</button>
    </div>
  </div>

  {loading ? (
    <p>Loading attendance records...</p>
  ) : error ? (
    <p className="error-message">No Attendance record found</p>
  ) : (
    <div className="attendance-table-wrapper">
      {attendanceData.length > 0 ? (
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Period</th>
              <th>Topic</th>
              <th>Remarks</th>
              <th>Absentees</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record, index) => {
              const canEdit =
                record.date === todayDate || editPermissions[`${record.date}-${record.section}`] === true;

              return (
                <tr key={index}>
                  <td>{record.classDetails}</td>
                  <td>{record.subject}</td>
                  <td>{record.date}</td>
                  <td>{record.period}</td>
                  <td>{record.topic}</td>
                  <td>{record.remarks}</td>
                  <td>
                    {record.absentees.length > 0 ? record.absentees.join(", ") : "None"}
                  </td>
                  <td>
                    <button 
                      onClick={() => handleEdit(record)} 
                      disabled={!canEdit} 
                      className="edit-button"
                      title={!canEdit ? "Editing is restricted for this record." : ""}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No attendance records available for the selected date.</p>
      )}
    </div>
  )}
</div>
</>
  );
};

export default Attendance;
