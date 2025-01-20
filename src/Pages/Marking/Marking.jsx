import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Marking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const date = query.get("date");
  const programYear = query.get("programYear");
  const department = query.get("department");
  const section = query.get("section");
  const subject = query.get("subject");
const period = query.get("period") ? query.get("period").split(",") : [];
const topic = query.get("topic") || "";
const remarks = query.get("remarks") || "";
const absentees = query.get("absentees") ? query.get("absentees").split(",") : [];

  const [studentsData, setStudentsData] = useState([]);
  const [topic, setTopic] = useState("");
  const [remarks, setRemarks] = useState("");
  const [attendance, setAttendance] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  if (date !== new Date().toISOString().split("T")[0]) {
    alert("Attendance can only be marked for today's date.");
    navigate("/attendance");
  } else {
    fetchStudents();
    fetchMarkedPeriods();

    // Pre-fill fields if editing an existing record
    if (period.length > 0) setPeriods(period.map((p) => parseInt(p, 10)));
    setTopic(topic);
    setRemarks(remarks);

    if (absentees.length > 0) {
      setAttendance((prev) =>
        absentees.reduce((acc, rollNumber) => {
          acc[rollNumber] = "absent";
          return acc;
        }, { ...prev })
      );
    }
  }
}, [date, navigate, period, topic, remarks, absentees]);

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(
        `https://tkrcet-backend.onrender.com/Attendance/period?date=${date}&year=${programYear}&department=${department}&section=${section}&period=${period}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.attendance) {
        setTopic(result.attendance.topic || "");
        setRemarks(result.attendance.remarks || "");
        setAttendance(
          result.attendance.attendance.reduce((acc, record) => {
            acc[record.rollNumber] = record.status;
            return acc;
          }, {})
        );
      }
    } catch (error) {
      alert(`Failed to fetch attendance data: ${error.message}`);
    }
  };

 const fetchStudents = async () => {
  try {
    const response = await fetch(
      https://tkrcet-backend.onrender.com/Section/${programYear}/${department}/${section}/students
    );
    if (!response.ok) {
      throw new Error(HTTP error! status: ${response.status});
    }

    const result = await response.json();

    if (result.students && Array.isArray(result.students)) {
      setStudentsData(result.students);
      setAttendance(
        result.students.reduce((acc, student) => {
          acc[student.rollNumber] = absentees.includes(student.rollNumber) ? "absent" : "present";
          return acc;
        }, {})
      );
    } else {
      throw new Error("Unexpected data format. 'students' property is missing or invalid.");
    }
  } catch (error) {
    alert(Failed to fetch students data: ${error.message});
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
    const trimmedTopic = topic.trim();
    const trimmedRemarks = remarks.trim();

    const attendanceData = {
      date,
      year: programYear,
      department,
      section,
      subject,
      topic: trimmedTopic,
      remarks: trimmedRemarks,
      period,
      attendance: studentsData.map((student) => ({
        rollNumber: student.rollNumber,
        name: student.name,
        status: attendance[student.rollNumber],
      })),
    };

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

      if (response.ok) {
        alert("Attendance updated successfully!");
        navigate("/attendance");
      } else {
        throw new Error("Failed to update attendance.");
      }
    } catch (error) {
      alert(error.message);
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
      <div>
        <h2>Edit Attendance</h2>
        <p>
          Year: {programYear} | Department: {department} | Section: {section} | Subject: {subject} | Period: {period}
        </p>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic"
        />
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter remarks"
        />
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
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Marking;
