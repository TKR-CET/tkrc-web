import React, { useState } from "react";
import axios from "axios";

const AddStudentForm = () => {
  const [formData, setFormData] = useState({
    rollNumber: "",
    name: "",
    fatherName: "",
    password: "",
    role: "student",
    year: "B.Tech I",
    department: "CSD",
    section: "A",
  });

  const [image, setImage] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Prepare FormData object
    const data = new FormData();
    data.append("rollNumber", formData.rollNumber);
    data.append("name", formData.name);
    data.append("fatherName", formData.fatherName);
    data.append("password", formData.password);
    data.append("role", formData.role);

    if (image) data.append("image", image);

    const apiUrl = `https://tkrcet-backend-g3zu.onrender.com/Section/${formData.year}/${formData.department}/${formData.section}/students`;

    console.log("Sending FormData:", data); // Debugging

    const response = await axios.post(apiUrl, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Success: " + response.data.message);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    alert("Error: " + (error.response?.data?.message || "Failed to add student"));
  }
};

  return (
    <div>
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Year:</label>
          <select name="year" value={formData.year} onChange={handleChange}>
            <option value="B.Tech I">B.Tech I</option>
            <option value="B.Tech II">B.Tech II</option>
          </select>
        </div>
        <div>
          <label>Department:</label>
          <select name="department" value={formData.department} onChange={handleChange}>
            <option value="CSD">CSD</option>
            <option value="CSE">CSE</option>
          </select>
        </div>
        <div>
          <label>Section:</label>
          <select name="section" value={formData.section} onChange={handleChange}>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>
        <div>
          <label>Roll Number:</label>
          <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} required />
        </div>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Father Name:</label>
          <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Role:</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} required />
        </div>
        <div>
          <label>Profile Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <button type="submit">Add Student</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default AddStudentForm;