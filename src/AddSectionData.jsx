import React, { useState } from "react";
import axios from "axios";

const AddSectionData = () => {
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");

  // Student Data
  const [students, setStudents] = useState([{ 
    rollNumber: "", 
    name: "", 
    fatherName: "", 
    password: "", 
    role: "student", // Default role as student
    image: "" 
  }]);

  // Timetable Data (JSON input)
  const [timetableJson, setTimetableJson] = useState("");

  /** Handle Student Changes */
  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  /** Handle Timetable JSON Input */
  const handleTimetableJsonChange = (e) => {
    setTimetableJson(e.target.value);
  };

  /** Add New Student */
  const addStudent = () => {
    setStudents([...students, { 
      rollNumber: "", 
      name: "", 
      fatherName: "", 
      password: "", 
      role: "student", 
      image: "" 
    }]);
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
      const timetable = JSON.parse(timetableJson); // Parsing JSON from the textarea
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
          <input type="text" placeholder="Father's Name" value={student.fatherName} onChange={(e) => handleStudentChange(index, "fatherName", e.target.value)} />
          <input type="password" placeholder="Password" value={student.password} onChange={(e) => handleStudentChange(index, "password", e.target.value)} required />
          <select value={student.role} onChange={(e) => handleStudentChange(index, "role", e.target.value)}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
          </select>
          <input type="text" placeholder="Image URL (optional)" value={student.image} onChange={(e) => handleStudentChange(index, "image", e.target.value)} />
        </div>
      ))}
      <button type="button" onClick={addStudent}>+ Add Student</button>
      <button type="button" onClick={submitStudents}>Submit Students</button>

      {/* Timetable Form */}
      <h3>Timetable (JSON Format)</h3>
      <textarea
        rows="10"
        cols="50"
        placeholder='Enter timetable in JSON format, e.g. [{"day": "Monday", "periods": [{"periodNumber": 1, "subject": "Mathematics"}]}]'
        value={timetableJson}
        onChange={handleTimetableJsonChange}
      />
      <button type="button" onClick={submitTimetable}>Submit Timetable</button>
    </div>
  );
};

export default AddSectionData;