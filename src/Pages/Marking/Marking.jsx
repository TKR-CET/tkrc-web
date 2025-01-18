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
  const [topic, setTopic] = useState("");
  const [remarks, setRemarks] = useState("");
  const [attendance, setAttendance] = useState({});
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMarked, setIsMarked] = useState(false); // Check if attendance is already marked

  useEffect(() => {
    fetchStudents();
    checkExistingAttendance();
  }, []);

  const checkExistingAttendance = async () => {
    try {
      const response = await fetch(
        `https://tkrcet-backend.onrender.com/Attendance/check?date=${date}&year=${programYear}&department=${department}&section=${section}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const periodsWithSubject = result.periods || [];
      if (periodsWithSubject.includes(subject)) {
        setIsMarked(true); // Mark the attendance as already existing
      }
    } catch (error) {
      alert(`Failed to check attendance: ${error.message}`);
    }
  };

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
        setAttendance(
          result.students.reduce((acc, student) => {
            acc[student.rollNumber] = "present";
            return acc;
          }, {})
        );
      } else {
        throw new Error("Unexpected data format. 'students' property is missing or invalid.");
      }
    } catch (error) {
      alert(`Failed to fetch data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttendanceChange = (rollNumber, status) => {
    setAttendance((prev) => ({
      ...prev,
      [rollNumber]: status,
    }));
  };

  const handleSubmit = async () => {
    if (isMarked) {
      alert("Attendance for this subject is already marked.");
      return;
    }

    const trimmedSubject = subject.trim();
    const trimmedTopic = topic.trim();
    const trimmedRemarks = remarks.trim();

    if (!trimmedSubject || !trimmedTopic || periods.length === 0 || !programYear || !department || !section || !date) {
      alert("Please fill in all mandatory fields (Periods, Subject, Topic, Year, Department, Section, Date).");
      return;
    }

    const attendanceData = {
      date,
      year: programYear,
      department,
      section,
      subject: trimmedSubject,
      topic: trimmedTopic,
      remarks: trimmedRemarks,
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
          headers: {
            "Content-Type": "application/json",
          },
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
                disabled={isMarked} // Only disable checkboxes if attendance is already marked
                checked={periods.includes(period)}
                onChange={() =>
                  setPeriods((prev) =>
                    prev.includes(period) ? prev.filter((p) => p !== period) : [...prev, period]
                  )
                }
              />
              {period}
            </label>
          ))}
        </div>
        <div className="subjectTopicEntry">
          <label htmlFor="input-topic">Topic:</label>
          <textarea
            id="input-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter Topic"
          />
          <label htmlFor="input-remarks">Remarks:</label>
          <textarea
            id="input-remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter Remarks"
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
                      onChange={() => handleAttendanceChange(student.rollNumber, "present")}
                    />
                  </td>
                  <td>
                    <input
                      type="radio"
                      className="absentStatus"
                      checked={attendance[student.rollNumber] === "absent"}
                      onChange={() => handleAttendanceChange(student.rollNumber, "absent")}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button id="btn-submit" onClick={handleSubmit} disabled={isMarked || isSubmitting}>
          {isSubmitting ? "Submitting..." : isMarked ? "Attendance Already Marked" : "Submit"}
        </button>
      </div>
    </>
  );
};

export default Marking;
