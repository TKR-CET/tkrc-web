import React, { useState } from "react";
import axios from "axios";
 
const AddFacultyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    facultyId: "",
    role: "",
    department: "",
    password: "",
    timetable: [],
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

    const data = new FormData();
    data.append("name", formData.name);
    data.append("facultyId", formData.facultyId);
    data.append("role", formData.role);
    data.append("department", formData.department);
    data.append("password", formData.password);
    data.append("timetable", JSON.stringify(formData.timetable));
    if (image) data.append("image", image);

    try {
      const response = await axios.post("http://localhost:5000/faculty/addfaculty", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponseMessage(response.data.message);
    } catch (error) {
      setResponseMessage(error.response?.data?.message || "Error adding faculty");
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
            onChange={(e) => setFormData({ ...formData, timetable: JSON.parse(e.target.value) })}
            placeholder='[{ "day": "Monday", "periods": [...] }, ...]'
          />
        </div>
        <div>
          <label>Profile Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <button type="submit">Add Faculty</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default AddFacultyForm;
