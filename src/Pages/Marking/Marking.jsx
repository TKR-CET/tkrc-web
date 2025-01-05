import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Marking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const date = query.get("date") || new Date().toISOString().split("T")[0];

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
  const [periods, setPeriods] = useState([]);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAttendanceChange = (rollNumber, status) => {
    setAttendance((prev) => ({
      ...prev,
      [rollNumber]: status,
    }));
  };

  const handlePeriodChange = (period) => {
    setPeriods((prev) =>
      prev.includes(period) ? prev.filter((p) => p !== period) : [...prev, period]
    );
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
      const response = await fetch("https://tkrcet-backend.onrender.com/attendance/mark-attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attendanceData),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || "Failed to submit attendance");
      }

      alert("Attendance submitted successfully!");
      navigate("/attendance");
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("An error occurred while submitting attendance.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
            <style>{`
    .attendanceMain {
    padding: 20px;
    background-color: #fff;
    margin: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .compulsoryText {
    color: red;
    font-weight: bold;
  }

  .attendanceHeading {
    font-size: 19px;
    font-weight: bold;
    padding-top:5px;
    margin-top:4px;
    margin-bottom: 15px;
    text-align: center;
  }

  .attendanceDetails {
    margin-bottom: 20px;
  }

  .periodSelection {
    margin-bottom: 15px;
  }

  .periodSelection label {
    font-size: 14px;
    margin-right: 10px;
  }

  .periodSelection input[type="checkbox"] {
    margin-right: 6px;
    width: 18px;
    height: 18px;
    cursor: pointer;
    display: inline-block;
  }

  .subjectTopicEntry label {
    font-size: 14px;
    margin-top: 8px;
    display: block;
  }

  .subjectTopicEntry input,
  .subjectTopicEntry textarea {
    font-size: 14px;
    padding: 8px;
    margin-top: 6px;
    margin-bottom: 12px;
    border-radius: 4px;
    border: 1px solid #ccc;
    width: 100%;
  }

  .subjectTopicEntry textarea {
    height: 80px;
    resize: vertical;
  }

  #btn-submit {
    background-color: #FF5733;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    position: relative;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }

  #btn-submit:hover {
    background-color: #ff704d;
  }

  button:disabled {
    background-color: #dcdcdc;
    cursor: not-allowed;
  }

  .attendanceList {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  .attendanceList th,
  .attendanceList td {
    text-align: center;
    padding: 10px;
    border: 1.5px solid #ddd;
  }

  .attendanceList th {
    background-color: #f7f7f7;
    font-weight: bold;
  }

  .attendanceList td {
    background-color: #fff;
  }

.attendanceList input[type="radio"] {
  appearance: none;
  -webkit-appearance: none; /* Safari */
  width: 20px;
  height: 20px;
  border: 2px solid #aaa;
  border-radius: 50%;
  cursor: pointer;
  background-color: white;
}

.attendanceList input[type="radio"]:checked {
  background-color: #2ecc71; /* Green for Present */
  border-color: #2ecc71;
}

.attendanceList input[type="radio"].absentStatus:checked {
  background-color: #e74c3c; /* Red for Absent */
  border-color: #e74c3c;
}

  @media (max-width: 768px) {
    .attendanceMain {
      margin: 15px;
      padding: 20px;
    }
        .periodSelection label{
        margin-right:4px;

    .periodSelection input[type="checkbox"] {
      margin-right: 0px !important;
    }

    .attendanceList th,
    .attendanceList td {
      font-size: 12px;
      padding: 8px;
    }

    .subjectTopicEntry textarea {
      height: 70px;
    }

    .subjectTopicEntry input,
    .subjectTopicEntry textarea {
      font-size: 12px;
    }

    #btn-submit {
      font-size: 14px;
      position:relative;
      padding-top:5px !important;
    }
        .attendanceList input[type="radio"] {
      width: 25px !important;
      height: 25px !important;
    }
  }

  @media (max-width: 480px) {
    .attendanceList th,
    .attendanceList td {
      font-size: 11px;
      padding: 6px;
    }

    .attendanceList input[type="radio"] {
      width: 20px;
      height: 20px;
    }

    .subjectTopicEntry textarea {
      height: 60px;
    }

    #btn-submit {
      font-size: 14px;
      padding: 8px;
      width: 100%;
      left: 0;
      transform: none;
      top: 0;
    }
  }
      `}</style>
      
      <Header />
      <NavBar />
      <MobileNav />
      <div className="attendanceMain">
        <h2>Attendance on {date}</h2>
        <div>
          <label>Periods:</label>
          {[1, 2, 3, 4, 5, 6].map((period) => (
            <label key={period}>
              <input
                type="checkbox"
                value={period}
                checked={periods.includes(period)}
                onChange={() => handlePeriodChange(period)}
              />
              {period}
            </label>
          ))}
        </div>
        <div>
          <label>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div>
          <label>Topic:</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div>
          <label>Remarks:</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        <table>
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
                    checked={attendance[student.rollNumber] === "absent"}
                    onChange={() => handleAttendanceChange(student.rollNumber, "absent")}
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
