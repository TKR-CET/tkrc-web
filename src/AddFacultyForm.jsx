import React, { useState } from "react";
import axios from "axios";

const AddFacultyForm = () => {
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
    role: "",
    designation: "",
    department: "",
    name: "",
    qualification: "",
    areaOfInterest: "",
    jntuId: "",
    yearsOfExperience: "",
  });

  const [image, setImage] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (image) data.append("image", image);

      const response = await axios.post(
        "https://tkrcet-backend-g3zu.onrender.com/faculty/addfacultyprofile",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setResponseMessage(response.data.message);
      setFormData({
        loginId: "",
        password: "",
        role: "",
        designation: "",
        department: "",
        name: "",
        qualification: "",
        areaOfInterest: "",
        jntuId: "",
        yearsOfExperience: "",
      });
      setImage(null);
    } catch (error) {
      setResponseMessage(error.response?.data?.message || "Error adding faculty profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Faculty Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Login ID:</label>
          <input type="text" name="loginId" value={formData.loginId} onChange={handleChange} required />
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
          <label>Designation:</label>
          <input type="text" name="designation" value={formData.designation} onChange={handleChange} required />
        </div>
        <div>
          <label>Department:</label>
          <input type="text" name="department" value={formData.department} onChange={handleChange} required />
        </div>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Qualification:</label>
          <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} required />
        </div>
        <div>
          <label>Area of Interest (comma-separated):</label>
          <input type="text" name="areaOfInterest" value={formData.areaOfInterest} onChange={handleChange} required />
        </div>
        <div>
          <label>JNTU ID:</label>
          <input type="text" name="jntuId" value={formData.jntuId} onChange={handleChange} required />
        </div>
        <div>
          <label>Years of Experience:</label>
          <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} required />
        </div>
        <div>
          <label>Profile Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Faculty"}</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default AddFacultyProfileForm;