import React, { useState, useEffect } from "react";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";
import { useLocation, useNavigate } from "react-router-dom";

const Marking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const date = query.get("date") || new Date().toISOString().split("T")[0];
  const selectedPeriods = query.get("periods")?.split(",").map(Number) || [];

  const studentsData = [
    { rollNumber: "23891A6XYZ", name: "Name 1" },
    { rollNumber: "23891A6XYZ2", name: "Name 2" },
    { rollNumber: "23891A6XYZ3", name: "Name 3" },
    { rollNumber: "23891A6XYZ4", name: "Name 4" },
  ];

  const [attendance, setAttendance] = useState(
    studentsData.reduce((acc, student) => {
      acc[student.rollNumber] = "present";
      return acc;
    }, {})
  );
  const [periods, setPeriods] = useState(selectedPeriods);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingData, setExistingData] = useState([]);

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const response = await fetch(
          `https://tkrcet-backend.onrender.com/attendance/check?date=${date}`
        );
        if (!response.ok) throw new Error("Failed to fetch existing data.");
        const data = await response.json();
        setExistingData(data.periods || []);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchExistingData();
  }, [date]);

  const isPeriodDisabled = (period) => existingData.includes(period);

  const handleAttendanceChange = (rollNumber, status) => {
    setAttendance((prev) => ({
      ...prev,
      [rollNumber]: status,
    }));
  };

  const handleSubmit = async () => {
    if (!subject || !topic || periods.length === 0) {
      alert("Please fill in all mandatory fields (Periods, Subject, Topic).");
      return;
    }

    setIsSubmitting(true);

    const attendanceData = {
      date,
      periods,
      subject,
      topic,
      remarks,
      attendance: studentsData.map((student) => ({
        rollNumber: student.rollNumber,
        name: student.name,
        status: attendance[student.rollNumber],
      })),
    };

    try {
      const response = await fetch(
        "https://tkrcet-backend.onrender.com/attendance/mark-attendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attendanceData),
        }
      );

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || "Failed to submit attendance.");
      }

      alert("Attendance submitted successfully!");
      navigate("/attendance"); // Redirect to Attendance.js
    } catch (error) {
      alert(error.message || "An error occurred while submitting attendance.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <style>{`
        // (Your existing styles here)
      `}</style>
      <Header />
      <NavBar />
      <MobileNav />
      <div className="attendanceMain">
        <h2>Mark Attendance for {date}</h2>
        <div className="periodSelection">
          <label>Periods:</label>
          {[1, 2, 3, 4, 5, 6].map((period) => (
            <label key={period}>
              <input
                type="checkbox"
                value={period}
                disabled={isPeriodDisabled(period)}
                checked={periods.includes(period)}
                onChange={() => {
                  setPeriods((prev) =>
                    prev.includes(period)
                      ? prev.filter((p) => p !== period)
                      : [...prev, period]
                  );
                }}
              />
              {period} {isPeriodDisabled(period) && "(Already marked)"}
            </label>
          ))}
        </div>
        <div className="subjectTopicEntry">
          <label htmlFor="input-subject">Subject:</label>
          <input
            type="text"
            id="input-subject"
            placeholder="Enter Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <label htmlFor="textarea-topic">Topic:</label>
          <textarea
            id="textarea-topic"
            placeholder="Enter Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <label htmlFor="textarea-remarks">Remarks:</label>
          <textarea
            id="textarea-remarks"
            placeholder="Enter Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        <table className="attendanceList">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
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
        <button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Marking;
