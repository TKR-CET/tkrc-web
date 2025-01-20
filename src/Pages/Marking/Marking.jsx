import React, { useState, useEffect } from "react";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";
import { useLocation, useNavigate } from "react-router-dom";

const Marking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const date = query.get("date") || new Date().toISOString().split("T")[0];
  const programYear = query.get("programYear");
  const department = query.get("department");
  const section = query.get("section");
  const subject = query.get("subject");

  const [studentsData, setStudentsData] = useState([]);
  const [topic, setTopic] = useState(query.get("topic") || "");
  const [remarks, setRemarks] = useState(query.get("remarks") || "");
  const [attendance, setAttendance] = useState({});
  const [periods, setPeriods] = useState([]);
  const [markedPeriods, setMarkedPeriods] = useState([]); // Tracks already marked periods
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch student data and already marked periods
  useEffect(() => {
    fetchStudents();
    fetchMarkedPeriods();

    // Extract attendance data if editing
    const attendanceParam = query.get("attendance");
    if (attendanceParam) {
      try {
        const parsedAttendance = JSON.parse(decodeURIComponent(attendanceParam));
        setAttendance(
          parsedAttendance.reduce((acc, student) => {
            acc[student.rollNumber] = student.status;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error("Failed to parse attendance data:", error);
      }
    }

    // Extract periods if editing
    const periodsParam = query.get("periods");
    if (periodsParam) {
      try {
        setPeriods(JSON.parse(decodeURIComponent(periodsParam)));
      } catch (error) {
        console.error("Failed to parse periods data:", error);
      }
    }
  }, []);

  // Fetch students for attendance marking
  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `https://tkrcet-backend.onrender.com/Section/${programYear}/${department}/${section}/students`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.students && Array.isArray(result.students)) {
        setStudentsData(result.students);

        // If not editing, initialize attendance with "present"
        if (!query.get("attendance")) {
          setAttendance(
            result.students.reduce((acc, student) => {
              acc[student.rollNumber] = "present";
              return acc;
            }, {})
          );
        }
      } else {
        throw new Error("Unexpected data format. 'students' property is missing or invalid.");
      }
    } catch (error) {
      alert(`Failed to fetch data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch already marked periods
  const fetchMarkedPeriods = async () => {
    try {
      const response = await fetch(
        `https://tkrcet-backend.onrender.com/Attendance/check?date=${date}&year=${programYear}&department=${department}&section=${section}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.periods && Array.isArray(result.periods)) {
        setMarkedPeriods(result.periods); // Save marked periods
      } else {
        throw new Error("Unexpected data format. 'periods' property is missing or invalid.");
      }
    } catch (error) {
      alert(`Failed to fetch marked periods: ${error.message}`);
    }
  };

  // Handle attendance change for each student
  const handleAttendanceChange = (rollNumber, status) => {
    setAttendance((prev) => ({
      ...prev,
      [rollNumber]: status,
    }));
  };

  // Handle submit of attendance data
  const handleSubmit = async () => {
    if (!subject.trim() || !topic.trim() || periods.length === 0) {
      alert("Please fill in all mandatory fields (Periods, Subject, Topic).");
      return;
    }

    const attendanceData = {
      date,
      year: programYear,
      department,
      section,
      subject: subject.trim(),
      topic: topic.trim(),
      remarks: remarks.trim(),
      periods,
      attendance: studentsData.map((student) => ({
        rollNumber: student.rollNumber,
        name: student.name,
        status: attendance[student.rollNumber],
      })),
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://tkrcet-backend.onrender.com/Attendance/mark-attendance",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(attendanceData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Attendance submitted successfully!");
        navigate("/attendance");
      } else {
        throw new Error(result.message || "Failed to submit attendance.");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
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
      <div className="attendanceMain">
        <h2 className="attendanceHeading">Mark Attendance</h2>
        <p>Year: {programYear} | Department: {department} | Section: {section} | Subject: {subject}</p>

        <div className="periodSelection">
          <label>Periods:</label>
          {[1, 2, 3, 4, 5, 6].map((period) => (
            <label key={period}>
              <input
                type="checkbox"
                value={period}
                checked={periods.includes(period)}
                disabled={markedPeriods.includes(period) && !periods.includes(period)} // Disable already marked periods unless editing
                onChange={() =>
                  setPeriods((prev) =>
                    prev.includes(period) ? prev.filter((p) => p !== period) : [...prev, period]
                  )
                }
              />
              {period} {markedPeriods.includes(period) && "(Marked)"}
            </label>
          ))}
        </div>

        <div className="subjectTopicEntry">
          <label>Topic:</label>
          <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter Topic" />
          <label>Remarks:</label>
          <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Enter Remarks" />
        </div>

        {isLoading ? (
          <p>Loading students...</p>
        ) : (
          <table className="attendanceList">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Name</th>
                <th>Present</th>
                <th>Absent</th>
              </tr>
            </thead>
            <tbody>
              {studentsData.map((student) => (
                <tr key={student.rollNumber}>
                  <td>{student.rollNumber}</td>
                  <td>{student.name}</td>
                  <td>
                    <input type="radio" checked={attendance[student.rollNumber] === "present"} onChange={() => handleAttendanceChange(student.rollNumber, "present")} />
                  </td>
                  <td>
                    <input type="radio" className="absentStatus" checked={attendance[student.rollNumber] === "absent"} onChange={() => handleAttendanceChange(student.rollNumber, "absent")} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button id="btn-submit" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</button>
      </div>
    </>
  );
};

export default Marking;
