import React, { useState } from "react";
import axios from "axios";

const AddFacultyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    facultyId: "",
    role: "",
    department: "",
    password: "",
    timetable: "", // Store timetable as a raw JSON string
  });

  const [image, setImage] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [timetableError, setTimetableError] = useState("");

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
      // Validate and parse the timetable
      const parsedTimetable = JSON.parse(formData.timetable);
      if (!Array.isArray(parsedTimetable)) {
        setTimetableError("Timetable must be an array");
        return;
      }
      setTimetableError(""); // Reset error if valid

      // Prepare form data for submission
      const data = new FormData();
      data.append("name", formData.name);
      data.append("facultyId", formData.facultyId);
      data.append("role", formData.role);
      data.append("department", formData.department);
      data.append("password", formData.password);
      data.append("timetable", formData.timetable); // Send raw JSON string
      if (image) data.append("image", image);

      // Send data to the backend
      const response = await axios.post("https://tkrcet-backend.onrender.com/faculty/addfaculty", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponseMessage(response.data.message);
    } catch (error) {
      if (error instanceof SyntaxError) {
        setTimetableError("Invalid JSON format for timetable");
      } else {
        setResponseMessage(error.response?.data?.message || "Error adding faculty");
      }
    }
  };

  return (
    <div>
      <h2>Add Faculty</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Faculty ID:</label>
          <input type="text" name="facultyId" value={formData.facultyId} onChange={handleChange} required />
        </div>
        <div>
          <label>Role:</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} required />
        </div>
        <div>
          <label>Department:</label>
          <input type="text" name="department" value={formData.department} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Timetable:</label>
          <textarea
            name="timetable"
            value={formData.timetable}
            onChange={handleChange}
            placeholder='[{ "day": "Monday", "periods": [...] }, ...]'
            required
          />
          {timetableError && <p style={{ color: "red" }}>{timetableError}</p>}
        </div>
        <div>
          <label>Profile Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <button type="submit" disabled={timetableError}>Add Faculty</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default AddFacultyForm;
