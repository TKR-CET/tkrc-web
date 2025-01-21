import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav.jsx";
import "./Activitydiary.css";

const ActivityDiary = () => {
  const [combinations, setCombinations] = useState([]);
  const [providedFacultyId, setProvidedFacultyId] = useState(null); // Faculty object
  const mongoDbFacultyId = localStorage.getItem("facultyId"); // Retrieve MongoDB _id from local storage

  useEffect(() => {
    // Fetch faculty-provided ID using MongoDB _id
    const fetchProvidedFacultyId = async () => {
      try {
        const response = await axios.get(
          `https://tkrcet-backend-g3zu.onrender.com/faculty/${mongoDbFacultyId}`
        );
        setProvidedFacultyId(response.data); // Store the faculty object
      } catch (error) {
        console.error("Error fetching faculty-provided ID:", error);
      }
    };

    if (mongoDbFacultyId) {
      fetchProvidedFacultyId();
    }
  }, [mongoDbFacultyId]);

  useEffect(() => {
    // Fetch unique combinations using facultyId
    const fetchUniqueCombinations = async () => {
      if (!providedFacultyId) return;

      try {
        const response = await axios.get(
          `https://tkrcet-backend-g3zu.onrender.com/${providedFacultyId.facultyId}/unique`
        );
        setCombinations(response.data.uniqueCombinations || []);
      } catch (error) {
        console.error("Error fetching unique combinations:", error);
      }
    };

    if (providedFacultyId) {
      fetchUniqueCombinations();
    }
  }, [providedFacultyId]);

  return (
    <div>
      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>
      <div className="activity-container">
        {/* Sidebar */}
        <div className="activity-sidebar">
          <select id="section-dropdown">
            <option value="">Select Section</option>
            {combinations.map((combo, index) => (
              <option
                key={index}
                value={`${combo.year}-${combo.department}-${combo.section}-${combo.subject}`}
              >
                {combo.year} {combo.department}-{combo.section} ({combo.subject})
              </option>
            ))}
          </select>
          <a href="#" id="lab-link-btn">
            CAD / CAM Lab
          </a>
        </div>

        {/* Main Content */}
        <div className="activity-content">
          <h2 id="activity-title">
            Activity Diary Section: CAD / CAM Lab
          </h2>
          <table id="activity-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date</th>
                <th>Period</th>
                <th>Topic</th>
                <th>Remark</th>
                <th>Absentees</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>28-10-2024</td>
                <td>4</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>2</td>
                <td>28-10-2024</td>
                <td>5</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>3</td>
                <td>28-10-2024</td>
                <td>6</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityDiary;
