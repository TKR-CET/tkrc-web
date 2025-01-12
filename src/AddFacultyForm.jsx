import React, { useState } from "react";

const AddFacultyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    facultyId: "",
    role: "",
    department: "",
    password: "",
    timetable: "",
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("facultyId", formData.facultyId);
    form.append("role", formData.role);
    form.append("department", formData.department);
    form.append("password", formData.password);
    form.append("timetable", formData.timetable);
    if (image) form.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/faculty/addfaculty ", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage("Error adding faculty: " + data.message);
      }
    } catch (error) {
      setMessage("Error adding faculty");
    }
  };

  return (
    <div>
      <h2>Add Faculty</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Faculty ID:</label>
          <input
            type="text"
            name="facultyId"
            value={formData.facultyId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Department:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Timetable:</label>
          <input
            type="text"
            name="timetable"
            value={formData.timetable}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Profile Image:</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Add Faculty</button>
      </form>
    </div>
  );
};

export default AddFacultyForm;
