import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
        const response = await fetch(`https://tkrcet-backend.onrender.com/attendance/check?date=${date}`);
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
      const response = await fetch("http://localhost:5000/attendance/mark-attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attendanceData),
      });

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
    <>
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
      <div>
        width: 100%;
      left: 0;
      transform: none;
      top: 0;
    }
  }
      `}</style>
      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>
      <div className="attendanceMain">
        <h2>Mark Attendance for {date}</h2>
        <div>
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
                    prev.includes(period) ? prev.filter((p) => p !== period) : [...prev, period]
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
    onChange={() => handleAttendanceChange(student.rollNumber, "present")}
  />
</td>
<td>
  <input
    type="radio"
    className={attendance[student.rollNumber] === "absent" ? "absentStatus" : ""}
    checked={attendance[student.rollNumber] === "absent"}
    onChange={() => handleAttendanceChange(student.rollNumber, "absent")}
  />
</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleSubmit} disabled={isSubmitting || periods.length === 0}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </>
  );
};

export default Marking;
