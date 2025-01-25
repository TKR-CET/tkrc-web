import React, { useState, useEffect } from "react"; import Header from "../../Components/Header/Header"; import NavBar from "../../Components/NavBar/NavBar"; import MobileNav from "../../Components/MobileNav/MobileNav"; import { useLocation, useNavigate } from "react-router-dom";

const Marking = () => { const navigate = useNavigate(); const location = useLocation(); const query = new URLSearchParams(location.search);

const date = query.get("date") || new Date().toISOString().split("T")[0]; const programYear = query.get("programYear"); const department = query.get("department"); const section = query.get("section"); const subject = query.get("subject"); const editPeriod = query.get("editPeriod");

const [studentsData, setStudentsData] = useState([]); const [topic, setTopic] = useState(""); const [remarks, setRemarks] = useState(""); const [attendance, setAttendance] = useState({}); const [periods, setPeriods] = useState([]); const [markedPeriods, setMarkedPeriods] = useState([]); const [isLoading, setIsLoading] = useState(true); const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => { fetchStudents(); fetchMarkedPeriods(); if (editPeriod) { fetchAttendanceRecord(); } }, []);

const fetchStudents = async () => { try { const response = await fetch( https://tkrcet-backend-g3zu.onrender.com/Section/${programYear}/${department}/${section}/students ); const result = await response.json(); if (result.students && Array.isArray(result.students)) { setStudentsData(result.students); setAttendance( result.students.reduce((acc, student) => { acc[student.rollNumber] = "present"; // Default to "present" return acc; }, {}) ); } else { throw new Error("Failed to fetch students."); } } catch (error) { alert(Error: ${error.message}); } finally { setIsLoading(false); } };

const fetchMarkedPeriods = async () => { try { const response = await fetch( https://tkrcet-backend-g3zu.onrender.com/Attendance/check?date=${date}&year=${programYear}&department=${department}&section=${section} ); const result = await response.json(); if (result.periods && Array.isArray(result.periods)) { setMarkedPeriods(result.periods); } else { throw new Error("Failed to fetch marked periods."); } } catch (error) { alert(Error: ${error.message}); } };

const fetchAttendanceRecord = async () => { try { const response = await fetch( https://tkrcet-backend-g3zu.onrender.com/Attendance/check?date=${date}&year=${programYear}&department=${department}&section=${section}&period=${editPeriod} ); const result = await response.json();

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

if (editing) { const invalidPeriods = periods.filter((p) => !markedPeriodNumbers.includes(p)); if (invalidPeriods.length > 0) { return res.status(400).json({ message: Invalid periods provided for editing: ${invalidPeriods.join(", ")}, }); } }

const handleAttendanceChange = (rollNumber, status) => { setAttendance((prev) => ({ ...prev, [rollNumber]: status, })); };

const handleSubmit = async () => { if (!subject.trim() || !topic.trim() || periods.length === 0) { alert("Please fill in all mandatory fields (Periods, Subject, Topic)."); return; }

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

return ( <> <style>{` .attendanceMain { padding: 20px; background-color: #fff; margin: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); }

.compulsoryText { color: red; font-weight: bold; }

.attendanceHeading { font-size: 19px; font-weight: bold; padding-top:5px; margin-top:4px; margin-bottom: 15px; text-align: center; }

.attendanceDetails { margin-bottom: 20px; }

.periodSelection { margin-bottom: 15px; }

.periodSelection label { font-size: 14px; margin-right: 10px; }

.periodSelection input[type="checkbox"] { margin-right: 6px; width: 18px; height: 18px; cursor: pointer; display: inline-block; }

.subjectTopicEntry label { font-size: 14px; margin-top: 8px; display: block; }

.subjectTopicEntry input, .subjectTopicEntry textarea { font-size: 14px; padding: 8px; margin-top: 6px; margin-bottom: 12px; border-radius: 4px; border: 1px solid #ccc; width: 100%; }

.subjectTopicEntry textarea { height: 80px; resize: vertical; }

#btn-submit { background-color: #FF5733; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; position: relative; top: 10px; left: 50%; transform: translateX(-50%); text-align: center; }

#btn-submit:hover { background-color: #ff704d; }

button:disabled { background-color: #dcdcdc; cursor: not-allowed; }

.attendanceList { width: 100%; border-collapse: collapse; margin-top: 20px; }

.attendanceList th, .attendanceList td { text-align: center; padding: 10px; border: 1.5px solid #ddd; }

.attendanceList th { background-color: #f7f7f7; font-weight: bold; }

.attendanceList td { background-color: #fff; }

.attendanceList input[type="radio"] { appearance: none; -webkit-appearance: none; /* Safari */ width: 20px; height: 20px; border: 2px solid #aaa; border-radius: 50%; cursor: pointer; background-color: white; }

.attendanceList input[type="radio"]:checked { background-color: #2ecc71; /* Green for Present */ border-color: #2ecc71; }

.attendanceList input[type="radio"].absentStatus:checked { background-color: #e74c3c; /* Red for Absent */ border-color: #e74c3c; }

@media (max-width: 768px) { .attendanceMain { margin: 15px; padding: 20px; } .periodSelection label{ margin-right:4px;

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

@media (max-width: 480px) { .attendanceList th, .attendanceList td { font-size: 11px; padding: 6px; }

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

} `}</style> <Header /> <div className="nav"> <NavBar /> </div> <div className="mob-nav"> <MobileNav /> </div> <div className="attendanceMain"> <h2>{editPeriod ? "Edit Attendance" : "Mark Attendance"}</h2> <p> Year: {programYear} | Department: {department} | Section: {section} | Subject: {subject} </p> <div className="periodSelection"> <label>Periods:</label> {[1, 2, 3, 4, 5, 6].map((period) => ( <label key={period}> <input type="checkbox" value={period} checked={periods.includes(period)} disabled={ editPeriod ? period !== parseInt(editPeriod) : markedPeriods.includes(period) } onChange={() => setPeriods((prev) => prev.includes(period) ? prev.filter((p) => p !== period) : [...prev, period] ) } /> {period} </label> ))} </div> <div className="subjectTopicEntry"> <label>Topic:</label> <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter topic" /> <label>Remarks:</label> <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Enter remarks" /> </div> {isLoading ? ( <p>Loading students...</p> ) : ( <table className="attendanceList"> <thead> <tr> <th>Roll Number</th> <th>Name</th> <th>Present</th> <th>Absent</th> </tr> </thead> <tbody> {studentsData.map((student) => ( <tr key={student.rollNumber}> <td>{student.rollNumber}</td> <td>{student.name}</td> <td> <input type="radio" checked={attendance[student.rollNumber] === "present"} onChange={() => handleAttendanceChange(student.rollNumber, "present") } /> </td> <td> <input type="radio" className="absentStatus" checked={attendance[student.rollNumber] === "absent"} onChange={() => handleAttendanceChange(student.rollNumber, "absent") } /> </td> </tr> ))} </tbody> </table> )} <button id="btn-submit" onClick={handleSubmit} disabled={isSubmitting}> {isSubmitting ? "Submitting..." : "Submit"} </button> </div> </> ); };

export default Marking;

