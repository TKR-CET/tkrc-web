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
  const editPeriod = query.get("editPeriod");

  const [studentsData, setStudentsData] = useState([]);
  const [topic, setTopic] = useState("");
  const [remarks, setRemarks] = useState("");
  const [attendance, setAttendance] = useState({});
  const [periods, setPeriods] = useState([]);
  const [markedSubjects, setMarkedSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchMarkedSubjects();
    if (editPeriod) {
      fetchAttendanceRecord();
    }
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `https://tkrcet-backend-g3zu.onrender.com/Section/${programYear}/${department}/${section}/students`
      );
      const result = await response.json();
      if (result.students && Array.isArray(result.students)) {
        setStudentsData(result.students);
        setAttendance(
          result.students.reduce((acc, student) => {
            acc[student.rollNumber] = "present"; // Default to "present"
            return acc;
          }, {})
        );
      } else {
        throw new Error("Failed to fetch students.");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMarkedSubjects = async () => {
    try {
      const response = await fetch(
        `https://tkrcet-backend-g3zu.onrender.com/Attendance/marked-subjects?date=${date}&year=${programYear}&department=${department}&section=${section}`
      );
      const result = await response.json();
      if (result.data && Array.isArray(result.data)) {
        setMarkedSubjects(result.data);
      } else {
        throw new Error("Failed to fetch marked subjects.");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchAttendanceRecord = async () => {
    try {
      const response = await fetch(
        `https://tkrcet-backend-g3zu.onrender.com/Attendance/check?date=${date}&year=${programYear}&department=${department}&section=${section}&period=${editPeriod}`
      );
      const result = await response.json();
      if (result && result.records && result.records.length > 0) {
        const record = result.records[0];
        setTopic(record.topic || "");
        setRemarks(record.remarks || "");
        setAttendance(
          record.attendance.reduce((acc, student) => {
            acc[student.rollNumber] = student.status;
            return acc;
          }, {})
        );
        setPeriods([parseInt(editPeriod)]);
      } else {
        throw new Error("No attendance record found for the selected period.");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleAttendanceChange = (rollNumber, status) => {
    setAttendance((prev) => ({
      ...prev,
      [rollNumber]: status,
    }));
  };

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
      subject,
      topic,
      remarks,
      periods,
      attendance: studentsData.map((student) => ({
        rollNumber: student.rollNumber,
        name: student.name,
        status: attendance[student.rollNumber],
      })),
      editing: !!editPeriod, // Add editing flag
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://tkrcet-backend-g3zu.onrender.com/Attendance/mark-attendance",
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
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMarkedSubject = (period) => {
    const marked = markedSubjects.find((item) => item.period === period);
    return marked ? marked.subject : null;
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
        <h2>{editPeriod ? `Editing Attendance for Period ${editPeriod}` : "Mark Attendance"}</h2>
        <p>
          Year: {programYear} | Department: {department} | Section: {section} |
          Subject: {subject}
        </p>
        <div className="periodSelection">
          <label>Periods:</label>
          {[1, 2, 3, 4, 5, 6].map((period) => (
            <label key={period} style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                value={period}
                checked={periods.includes(period)}
                disabled={
                  editPeriod
                    ? period !== parseInt(editPeriod)
                    : !!getMarkedSubject(period)
                }
                onChange={() =>
                  setPeriods((prev) =>
                    prev.includes(period)
                      ? prev.filter((p) => p !== period)
                      : [...prev, period]
                  )
                }
              />
              {period}
              {getMarkedSubject(period) && (
                <span style={{ color: "red", marginLeft: "5px" }}>
                  ({getMarkedSubject(period)})
                </span>
              )}
            </label>
          ))}
        </div>
        <div className="subjectTopicEntry">
          <label>Topic:</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic"
          />
          <label>Remarks:</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter remarks"
          />
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
                    <input
                      type="radio"
                      checked={attendance[student.rollNumber] === "present"}
                      onChange={() =>
                        handleAttendanceChange(student.rollNumber, "present")
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="radio"
                      className="absentStatus"
                      checked={attendance[student.rollNumber] === "absent"}
                      onChange={() =>
                        handleAttendanceChange(student.rollNumber, "absent")
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button id="btn-submit" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </>
  );
};

export default Marking;