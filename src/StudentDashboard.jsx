import React, { useState, useEffect } from "react";
import NavBar from "./Components/NavBar/NavBar";
import MobileNav from "./Components/MobileNav/MobileNav";
import Header from "./Components/Header/Header";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);  // Added loading state
  const [error, setError] = useState(""); // Added error state
  const studentId = localStorage.getItem("studentId"); // Get student ID from local storage

  useEffect(() => {
    if (!studentId) {
      setError("Student ID not found in local storage.");
      setLoading(false);
      return;
    }

    // Log the studentId to verify
    console.log("Student ID from Local Storage:", studentId);

    // Fetch student details
    fetch(`https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Student API Response:", data); // Debugging log

        if (!data || !data.student) {
          console.error("Student data is missing:", data);
          setError("Failed to fetch student data.");
          setLoading(false);
          return;
        }
        setStudent(data.student);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching student details:", err);
        setError("Error fetching student details.");
        setLoading(false);
      });
  }, [studentId]);

  // Loading state before data is fetched
  if (loading) {
    return <h2 className="loading-text">Loading...</h2>;
  }

  // Error handling if no student data is available
  if (error) {
    return <h2 className="loading-text">{error}</h2>;
  }

  if (!student) {
    return <h2 className="loading-text">Error loading student data. Please try again.</h2>;
  }

  return (
    <div>
      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>

      {/* Student Details */}
      <div className="student-details">
        <h2>Student Details</h2>
        <table>
          <tbody>
            <tr>
              <th>Roll No.</th>
              <td>{student.rollNumber}</td>
              <td rowSpan="4">
                <img src={student.image} alt="Student" />
              </td>
            </tr>
            <tr>
              <th>Student Name</th>
              <td>{student.name}</td>
            </tr>
            <tr>
              <th>Father's Name</th>
              <td>{student.fatherName}</td>
            </tr>
            <tr>
              <th>Department</th>
              <td>{`${student.year} ${student.department} ${student.section}`}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDashboard;