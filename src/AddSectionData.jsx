import React, { useState } from "react";
import axios from "axios";

const AddSectionData = () => {
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");

  // Student Data
  const [students, setStudents] = useState([{ rollNumber: "", name: "", password: "" }]);

  // Timetable Data
  const [timetable, setTimetable] = useState([{ day: "", periods: [{ periodNumber: 1, subject: "" }] }]);

  /** Handle Student Changes */
  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  /** Handle Timetable Changes */
  const handleTimetableChange = (index, field, value) => {
    const updatedTimetable = [...timetable];
    updatedTimetable[index][field] = value;
    setTimetable(updatedTimetable);
  };

  /** Add New Student */
  const addStudent = () => {
    setStudents([...students, { rollNumber: "", name: "", password: "" }]);
  };

  /** Add New Timetable Entry */
  const addTimetableRow = () => {
    setTimetable([...timetable, { day: "", periods: [{ periodNumber: 1, subject: "" }] }]);
  };

  /** Submit Student Data */
  const submitStudents = async () => {
    try {
      const response = await axios.post(
        `https://tkrcet-backend-g3zu.onrender.com/Section/${year}/${department}/${section}/students`,
        { students }
      );
      alert("Students added successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error adding students:", error.response?.data || error.message);
      alert("Failed to add students.");
    }
  };

  /** Submit Timetable Data */
  const submitTimetable = async () => {
    try {
      const response = await axios.post(
        `https://tkrcet-backend-g3zu.onrender.com/Section/${year}/${department}/${section}/timetable`,
        { timetable }
      );
      alert("Timetable added successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error adding timetable:", error.response?.data || error.message);
      alert("Failed to add timetable.");
    }
  };

  return (
    <div>
      <h2>Add Section Data</h2>
      <input type="text" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} required />
      <input type="text" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
      <input type="text" placeholder="Section" value={section} onChange={(e) => setSection(e.target.value)} required />

      {/* Student Form */}
      <h3>Students</h3>
      {students.map((student, index) => (
        <div key={index}>
          <input type="text" placeholder="Roll Number" value={student.rollNumber} onChange={(e) => handleStudentChange(index, "rollNumber", e.target.value)} required />
          <input type="text" placeholder="Name" value={student.name} onChange={(e) => handleStudentChange(index, "name", e.target.value)} required />
          <input type="password" placeholder="Password" value={student.password} onChange={(e) => handleStudentChange(index, "password", e.target.value)} required />
        </div>
      ))}
      <button type="button" onClick={addStudent}>+ Add Student</button>
      <button type="button" onClick={submitStudents}>Submit Students</button>

      {/* Timetable Form */}
      <h3>Timetable</h3>
      {timetable.map((entry, index) => (
        <div key={index}>
          <input type="text" placeholder="Day" value={entry.day} onChange={(e) => handleTimetableChange(index, "day", e.target.value)} required />
          <input type="text" placeholder="Subject" value={entry.periods[0].subject} onChange={(e) => handleTimetableChange(index, "subject", e.target.value)} required />
        </div>
      ))}
      <button type="button" onClick={addTimetableRow}>+ Add Timetable</button>
      <button type="button" onClick={submitTimetable}>Submit Timetable</button>
    </div>
  );
};

export default AddSectionData;