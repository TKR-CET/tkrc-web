import React, { useState } from "react";

const AddFacultyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    facultyId: "",
    role: "",
    department: "",
    password: "",
    timetable: [
      {
        day: "Monday",
        periods: [
          {
            periodNumber: 1,
            subject: "Database Systems",
            year: "First Year",
            department: "Computer Science",
            section: "A",
          },
        ],
      },
    ],
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle timetable input change
  const handleTimetableChange = (e, index, periodIndex) => {
    const { name, value } = e.target;
    const updatedTimetable = [...formData.timetable];
    updatedTimetable[index].periods[periodIndex][name] = value;
    setFormData({
      ...formData,
      timetable: updatedTimetable,
    });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to send form data and file
    const form = new FormData();
    form.append("name", formData.name);
    form.append("facultyId", formData.facultyId);
    form.append("role", formData.role);
    form.append("department", formData.department);
    form.append("password", formData.password);

    // Convert timetable to JSON before sending
    form.append("timetable", JSON.stringify(formData.timetable));
    if (image) form.append("image", image);  // Attach image if provided

    try {
      // Send the form data to the backend using fetch
      const response = await fetch("http://localhost:5000/faculty/addfaculty", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);  // Show success message
      } else {
        setMessage("Error adding faculty: " + data.message);  // Show error message
      }
    } catch (error) {
      setMessage("Error adding faculty");
    }
  };

  return (
    <div>
      <h2>Add Faculty</h2>
      {message && <p>{message}</p>} {/* Display message */}
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
        
        {/* Timetable Form Inputs */}
        {formData.timetable.map((timetableItem, index) => (
          <div key={index}>
            <h4>{timetableItem.day}</h4>
            {timetableItem.periods.map((period, periodIndex) => (
              <div key={periodIndex}>
                <label>Period Number:</label>
                <input
                  type="number"
                  name="periodNumber"
                  value={period.periodNumber}
                  onChange={(e) => handleTimetableChange(e, index, periodIndex)}
                  required
                />
                <label>Subject:</label>
                <input
                  type="text"
                  name="subject"
                  value={period.subject}
                  onChange={(e) => handleTimetableChange(e, index, periodIndex)}
                  required
                />
                <label>Year:</label>
                <input
                  type="text"
                  name="year"
                  value={period.year}
                  onChange={(e) => handleTimetableChange(e, index, periodIndex)}
                  required
                />
                <label>Department:</label>
                <input
                  type="text"
                  name="department"
                  value={period.department}
                  onChange={(e) => handleTimetableChange(e, index, periodIndex)}
                  required
                />
                <label>Section:</label>
                <input
                  type="text"
                  name="section"
                  value={period.section}
                  onChange={(e) => handleTimetableChange(e, index, periodIndex)}
                  required
                />
              </div>
            ))}
          </div>
        ))}

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
