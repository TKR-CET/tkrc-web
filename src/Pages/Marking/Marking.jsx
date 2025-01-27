import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const [markedSubjects, setMarkedSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facultyId, setFacultyId] = useState(null);

  const mongoDbFacultyId = localStorage.getItem("facultyId");

  // Fetch facultyId from MongoDB ID
  useEffect(() => {
    if (!mongoDbFacultyId) return;

    const fetchFacultyId = async () => {
      try {
        const response = await axios.get(
          `https://tkrcet-backend-g3zu.onrender.com/faculty/${mongoDbFacultyId}`
        );
        setFacultyId(response.data.facultyId);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };

    fetchFacultyId();
  }, [mongoDbFacultyId]);

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
        setMarkedSubjects(result.data); // Store marked subjects with periods
      } else {
        throw new Error("Failed to fetch marked subjects.");
      }
    } catch (error) {
      console.log(error.message);
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
    if (!subject.trim() || !topic.trim() || !studentsData.length) {
      alert("Please fill in all mandatory fields (Topic, Subject).");
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
          padding-top: 5px;
          margin-top: 4px;
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
          background-color: #ff5733;
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
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border: 2px solid #aaa;
          border-radius: 50%;
          cursor: pointer;
          background-color: white;
        }

        .attendanceList input[type="radio"]:checked {
          background-color: #2ecc71;
          border-color: #2ecc71;
        }

        .attendanceList input[type="radio"].absentStatus:checked {
          background-color: #e74c3c;
          border-color: #e74c3c;
        }

        @media (max-width: 768px) {
          .attendanceMain {
            margin: 15px;
            padding: 20px;
          }

          .periodSelection label {
            margin-right: 4px;
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
            position: relative;
            padding-top: 5px !important;
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
        <div className="submitSection">
          <button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : editPeriod ? "Update Attendance" : "Submit Attendance"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Marking;