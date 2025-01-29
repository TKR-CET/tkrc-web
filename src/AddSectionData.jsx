import React, { useState } from "react";
import axios from "axios";

const AddSectionData = () => {
  // Default options for dropdowns
  const yearOptions = ["B.Tech I", "B.Tech II"];
  const departmentOptions = ["CSD", "CSE"];
  const sectionOptions = ["A", "B", "C"];

  // State for selected values
  const [year, setYear] = useState(yearOptions[0]);
  const [department, setDepartment] = useState(departmentOptions[0]);
  const [section, setSection] = useState(sectionOptions[0]);

  // Student Data
  const [students, setStudents] = useState([{ 
    rollNumber: "", 
    name: "", 
    fatherName: "", 
    password: "", 
    role: "student", // Default role
    image: null 
  }]);

  /** Handle Student Input Changes */
  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  /** Handle Image File Input */
  const handleImageChange = (index, e) => {
    const updatedStudents = [...students];
    updatedStudents[index].image = e.target.files[0];
    setStudents(updatedStudents);
  };

  /** Add New Student */
  const addStudent = () => {
    setStudents([...students, { 
      rollNumber: "", 
      name: "", 
      fatherName: "", 
      password: "", 
      role: "student", 
      image: null 
    }]);
  };

  /** Submit Student Data */
  const submitStudents = async () => {
    try {
      const formData = new FormData();
      
      students.forEach((student, index) => {
        formData.append(`students[${index}][rollNumber]`, student.rollNumber);
        formData.append(`students[${index}][name]`, student.name);
        formData.append(`students[${index}][fatherName]`, student.fatherName);
        formData.append(`students[${index}][password]`, student.password);
        formData.append(`students[${index}][role]`, student.role);
        if (student.image) {
          formData.append(`students[${index}][image]`, student.image);
        }
      });

      const response = await axios.post(
        `https://tkrcet-backend-g3zu.onrender.com/Section/${year}/${department}/${section}/students`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Students added successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error adding students:", error.response?.data || error.message);
      alert("Failed to add students.");
    }
  };

  return (
    <div>
      <h2>Add Students</h2>

      {/* Year Dropdown */}
      <label>Year:</label>
      <select value={year} onChange={(e) => setYear(e.target.value)}>
        {yearOptions.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      {/* Department Dropdown */}
      <label>Department:</label>
      <select value={department} onChange={(e) => setDepartment(e.target.value)}>
        {departmentOptions.map((dept) => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>

      {/* Section Dropdown */}
      <label>Section:</label>
      <select value={section} onChange={(e) => setSection(e.target.value)}>
        {sectionOptions.map((sec) => (
          <option key={sec} value={sec}>{sec}</option>
        ))}
      </select>

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

          {/* Image File Input */}
          <input type="file" accept="image/*" onChange={(e) => handleImageChange(index, e)} />
        </div>
      ))}
      <button type="button" onClick={addStudent}>+ Add Student</button>
      <button type="button" onClick={submitStudents}>Submit Students</button>
    </div>
  );
};

export default AddSectionData;