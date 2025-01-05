import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";


const Marking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const date = query.get("date") || new Date().toISOString().split("T")[0];
  const editMode = query.get("edit") === "true";

  const [studentsData] = useState([
    { rollNumber: "23891A6XYZ", name: "Name 1" },
    { rollNumber: "23891A6XYZ2", name: "Name 2" },
    { rollNumber: "23891A6XYZ3", name: "Name 3" },
    { rollNumber: "23891A6XYZ4", name: "Name 4" },
  ]);

  const [attendance, setAttendance] = useState({});
  const [periods, setPeriods] = useState([false, false, false, false, false, false]);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editMode) {
      fetchExistingAttendance();
    } else {
      setAttendance(
        studentsData.reduce((acc, student) => {
          acc[student.rollNumber] = "present";
          return acc;
        }, {})
      );
    }
  }, [editMode]);

  const fetchExistingAttendance = async () => {
    try {
      const response = await fetch(
        `https://tkrcet-backend.onrender.com/attendance/fetch-attendance?date=${date}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch existing attendance.");
      }

      const data = await response.json();
      const existingRecord = data[0];

      if (existingRecord) {
        setPeriods(existingRecord.periods || []);
        setSubject(existingRecord.subject || "");
        setTopic(existingRecord.topic || "");
        setRemarks(existingRecord.remarks || "");
        setAttendance(
          existingRecord.attendance.reduce((acc, att) => {
            acc[att.rollNumber] = att.status;
            return acc;
          }, {})
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAttendanceChange = (rollNumber, status) => {
    setAttendance((prev) => ({ ...prev, [rollNumber]: status }));
  };

  const handlePeriodChange = (periodIndex) => {
    setPeriods((prevPeriods) => {
      const updatedPeriods = [...prevPeriods];
      updatedPeriods[periodIndex] = !updatedPeriods[periodIndex];
      return updatedPeriods;
    });
  };

  const handleSubmit = async () => {
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
      const endpoint = editMode
        ? "update-attendance"
        : "mark-attendance";
      const response = await fetch(
        `https://tkrcet-backend.onrender.com/attendance/${endpoint}`,
        {
          method: editMode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(attendanceData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit attendance.");
      }

      alert(editMode ? "Attendance updated successfully!" : "Attendance submitted successfully!");
      navigate("/attendance");
    } catch (error) {
      alert(error.message || "An error occurred.");
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
        <h2>{editMode ? "Edit" : "Mark"} Attendance for {date}</h2>
        <div className="marking-form">
          <div className="input-group">
             <div className="periods">
            <h3>Periods:</h3>
            <div className="periods-checkboxes">
              {[1, 2, 3, 4, 5, 6].map((period, index) => (
                <div key={period} className="period">
                  <input
                    type="checkbox"
                    id={`period-${period}`}
                    checked={periods[index] || false}
                    onChange={() => handlePeriodChange(index)}
                  />
                  <label htmlFor={`period-${period}`}> {period}</label>
                </div>
              ))}
            </div>
          </div>
          
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter Subject"
            />
          </div>

          <div className="input-group">
            <label htmlFor="topic">Topic:</label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter Topic"
            />
          </div>

          <div className="input-group">
            <label htmlFor="remarks">Remarks:</label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter any remarks"
            ></textarea>
          </div>

       

          <div className="students-attendance">
            <h3>Mark Attendance</h3>
            {studentsData.map((student) => (
              <div key={student.rollNumber} className="student-attendance">
                <label>{student.name} ({student.rollNumber})</label>
                <select
                  value={attendance[student.rollNumber] || "present"}
                  onChange={(e) =>
                    handleAttendanceChange(student.rollNumber, e.target.value)
                  }
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>
            ))}
          </div>

          <div className="submit-section">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="submit-btn"
            >
              {isSubmitting ? "Submitting..." : editMode ? "Update Attendance" : "Submit Attendance"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marking;
