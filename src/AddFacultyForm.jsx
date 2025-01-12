import React, { useState } from "react";

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
  const [message, setMessage] = useState("");

  // Handle general input fields (Name, Faculty ID, etc.)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input for image upload
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle timetable data changes
  const handleTimetableChange = (index, e) => {
    const { name, value } = e.target;
    const newTimetable = [...formData.timetable];
    newTimetable[index] = { ...newTimetable[index], [name]: value };
    setFormData({ ...formData, timetable: newTimetable });
  };

  // Add a new timetable entry
  const addTimetableEntry = () => {
    setFormData({
      ...formData,
      timetable: [
        ...formData.timetable,
        { day: "", periods: [{ periodNumber: "", subject: "", year: "", department: "", section: "" }] },
      ],
    });
  };

  // Remove a timetable entry
  const removeTimetableEntry = (index) => {
    const newTimetable = formData.timetable.filter((_, i) => i !== index);
    setFormData({ ...formData, timetable: newTimetable });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("facultyId", formData.facultyId);
    form.append("role", formData.role);
    form.append("department", formData.department);
    form.append("password", formData.password);
    form.append("timetable", JSON.stringify(formData.timetable)); // Timetable data as JSON
    if (image) form.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/faculty/addfaculty", {
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

        {/* Timetable Inputs */}
        <div>
          <h3>Timetable</h3>
          {formData.timetable.map((timetableEntry, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <label>Day:</label>
              <input
                type="text"
                name="day"
                value={timetableEntry.day}
                onChange={(e) => handleTimetableChange(index, e)}
                placeholder="e.g., Monday"
                required
              />

              {/* Periods */}
              <h4>Periods</h4>
              {timetableEntry.periods.map((period, periodIndex) => (
                <div key={periodIndex}>
                  <label>Period Number:</label>
                  <input
                    type="number"
                    name="periodNumber"
                    value={period.periodNumber}
                    onChange={(e) => handleTimetableChange(index, e)}
                    required
                  />
                  <label>Subject:</label>
                  <input
                    type="text"
                    name="subject"
                    value={period.subject}
                    onChange={(e) => handleTimetableChange(index, e)}
                    required
                  />
                  <label>Year:</label>
                  <input
                    type="text"
                    name="year"
                    value={period.year}
                    onChange={(e) => handleTimetableChange(index, e)}
                    required
                  />
                  <label>Department:</label>
                  <input
                    type="text"
                    name="department"
                    value={period.department}
                    onChange={(e) => handleTimetableChange(index, e)}
                    required
                  />
                  <label>Section:</label>
                  <input
                    type="text"
                    name="section"
                    value={period.section}
                    onChange={(e) => handleTimetableChange(index, e)}
                    required
                  />
                </div>
              ))}
              {/* Button to remove timetable entry */}
              <button type="button" onClick={() => removeTimetableEntry(index)}>
                Remove Timetable Entry
              </button>
            </div>
          ))}
          {/* Button to add a new timetable entry */}
          <button type="button" onClick={addTimetableEntry}>
            Add Timetable Entry
          </button>
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
