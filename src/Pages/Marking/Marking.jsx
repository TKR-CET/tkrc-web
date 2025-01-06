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
  const selectedPeriods = query.get("periods")?.split(",") || [];

  const studentsData = [
    { rollNumber: "23891A6XYZ", name: "Name 1" },
    { rollNumber: "23891A6XYZ2", name: "Name 2" },
    { rollNumber: "23891A6XYZ3", name: "Name 3" },
    { rollNumber: "23891A6XYZ4", name: "Name 4" },
  ];

  const initialAttendance = studentsData.reduce((acc, student) => {
    acc[student.rollNumber] = "present";
    return acc;
  }, {});

  const [attendance, setAttendance] = useState(initialAttendance);
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
        if (!response.ok) throw new Error("Failed to fetch existing attendance data.");
        const data = await response.json();
        setExistingData(data.periods || []);
      } catch (error) {
        console.error("Error fetching existing data:", error.message);
      }
    };

    fetchExistingData();
  }, [date]);

  const isPeriodDisabled = (period) => {
  // Disable periods only if they are in existingData and not in selectedPeriods
  return existingData.includes(period) && !selectedPeriods.includes(period);
};

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
      navigate("/attendance");
    } catch (error) {
      alert(error.message || "An error occurred while submitting attendance.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <style>{`
        .attendanceMain {
          padding: 20px;
          background-color: #fff;
          margin: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .attendanceHeading {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
        }
        .subjectTopicEntry label {
          display: block;
          margin: 8px 0 5px;
          font-weight: 600;
        }
        .subjectTopicEntry input,
        .subjectTopicEntry textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        .attendanceList {
          width: 100%;
          margin-top: 20px;
          border-collapse: collapse;
        }
        .attendanceList th,
        .attendanceList td {
          padding: 10px;
          text-align: center;
          border: 1px solid #ddd;
        }
        .attendanceList th {
          background-color: #f4f4f4;
        }
        .attendanceList input[type="radio"] {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid #aaa;
          border-radius: 50%;
        }
        .attendanceList input[type="radio"]:checked {
          background-color: #2ecc71;
          border-color: #2ecc71;
        }
        .attendanceList input[type="radio"].absentStatus:checked {
          background-color: #e74c3c;
          border-color: #e74c3c;
        }
        #btn-submit {
          background-color: #007bff;
          color: #fff;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 20px;
        }
        #btn-submit:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        @media (max-width: 768px) {
          .attendanceMain {
            margin: 10px;
          }
          .attendanceList th,
          .attendanceList td {
            padding: 8px;
            font-size: 12px;
          }
        }
      `}</style>
      <div class="nav">
      <NavBar />
        </div>
      <div class="mob-nav">
      <MobileNav />
        </div>
      <div className="attendanceMain">
        <h2 className="attendanceHeading">Mark Attendance for {date}</h2>
        <div>
          <label>Periods:</label>
          {[1, 2, 3, 4, 5, 6].map((period) => (
            <label key={period}>
              <input
                type="checkbox"
                value={period}
                disabled={isPeriodDisabled(period)}
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
          <label htmlFor="input-subject">Subject:</label>
          <input
            id="input-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter Subject"
          />
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
        <button
          id="btn-submit"
          onClick={handleSubmit}
          disabled={isSubmitting || periods.length === 0}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </>
  );
};

export default Marking;
