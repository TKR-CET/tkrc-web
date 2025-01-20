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
  const editingPeriod = query.get("period");
  const prefilledTopic = query.get("topic") || "";
  const prefilledRemarks = query.get("remarks") || "";
  const prefilledAttendance = query.get("attendance");

  const [studentsData, setStudentsData] = useState([]);
  const [topic, setTopic] = useState(prefilledTopic);
  const [remarks, setRemarks] = useState(prefilledRemarks);
  const [attendance, setAttendance] = useState({});
  const [periods, setPeriods] = useState(editingPeriod ? [parseInt(editingPeriod)] : []);
  const [markedPeriods, setMarkedPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchMarkedPeriods();

    if (prefilledAttendance) {
      try {
        const parsedAttendance = JSON.parse(decodeURIComponent(prefilledAttendance));
        const attendanceMap = parsedAttendance.reduce((acc, student) => {
          acc[student.rollNumber] = student.status;
          return acc;
        }, {});
        setAttendance(attendanceMap);
      } catch (error) {
        console.error("Error parsing attendance data:", error);
      }
    }
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `https://tkrcet-backend.onrender.com/Section/${programYear}/${department}/${section}/students`
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const jsonResponse = await response.json();
      console.log("Student API Response:", jsonResponse);

      if (!jsonResponse.students || !Array.isArray(jsonResponse.students)) {
        throw new Error("Invalid student data format received");
      }

      setStudentsData(jsonResponse.students);
      setAttendance((prev) =>
        jsonResponse.students.reduce((acc, student) => {
          acc[student.rollNumber] = prev[student.rollNumber] || "present";
          return acc;
        }, {})
      );
    } catch (error) {
      alert(`Failed to fetch students: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMarkedPeriods = async () => {
    try {
      const response = await fetch(
        `https://tkrcet-backend.onrender.com/Attendance/check?date=${date}&year=${programYear}&department=${department}&section=${section}`
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const jsonResponse = await response.json();
      console.log("Marked Periods Response:", jsonResponse);

      setMarkedPeriods(jsonResponse.periods || []);
    } catch (error) {
      alert(`Failed to fetch marked periods: ${error.message}`);
    }
  };

  const handleAttendanceChange = (rollNumber, status) => {
    setAttendance((prev) => ({
      ...prev,
      [rollNumber]: status,
    }));
  };

  const handlePeriodChange = (period) => {
    if (markedPeriods.includes(period) && (!editingPeriod || parseInt(editingPeriod) !== period)) {
      alert(`❌ Period ${period} is already marked. Please choose another period.`);
      return;
    }

    setPeriods((prev) =>
      prev.includes(period) ? prev.filter((p) => p !== period) : [...prev, period]
    );
  };

  const handleSubmit = async () => {
    if (!subject.trim() || !topic.trim() || periods.length === 0) {
      alert("⚠️ Please fill in all mandatory fields.");
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
      console.log("Attendance Submit Response:", result);

      if (response.ok) {
        alert("✅ Attendance submitted successfully!");
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
        <p>
          Year: {programYear} | Department: {department} | Section: {section} | Subject: {subject}
        </p>
        <div className="periodSelection">
          <label>Periods:</label>
          {[1, 2, 3, 4, 5, 6].map((period) => (
            <label key={period}>
              <input
                type="checkbox"
                value={period}
                checked={periods.includes(period)}
                disabled={markedPeriods.includes(period) && (!editingPeriod || parseInt(editingPeriod) !== period)}
                onChange={() => handlePeriodChange(period)}
              />
              {period}{" "}
              {markedPeriods.includes(period) && (!editingPeriod || parseInt(editingPeriod) !== period) && (
                <span style={{ color: "red", fontWeight: "bold" }}> (Already Marked)</span>
              )}
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
                    <input type="radio" checked={attendance[student.rollNumber] === "absent"} onChange={() => handleAttendanceChange(student.rollNumber, "absent")} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </>
  );
};

export default Marking;
