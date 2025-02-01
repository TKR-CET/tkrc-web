import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Timetable.css";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Timetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const facultyId = localStorage.getItem("facultyId");
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (facultyId) {
          const response = await axios.get(
            `https://tkrcet-backend-g3zu.onrender.com/faculty/${facultyId}`
          );
          setUserDetails(response.data);
        } else if (studentId) {
          const response = await axios.get(
            `https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`
          );
          setUserDetails(response.data.student);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [facultyId, studentId]);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        if (!userDetails) return;

        let url = "";
        if (facultyId) {
          url = `https://tkrcet-backend-g3zu.onrender.com/faculty/${facultyId}/timetable`;
        } else if (studentId) {
          const { programYear, department, section } = userDetails;
          url = `https://tkrcet-backend-g3zu.onrender.com/Section/${programYear}/${department}/${section}/timetable`;
        }

        const response = await axios.get(url);
        setTimetable(response.data.timetable);
      } catch (error) {
        console.error("Error fetching timetable:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userDetails) {
      fetchTimetable();
    }
  }, [userDetails]);

  const handleImageError = (e) => {
    e.target.src = "./images/logo.png"; // Default fallback image
  };

  return (
    <div>

      <Header />
            <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>

      {loading ? (
        <p>Loading timetable...</p>
      ) : (
        <div>
          {/* User Details */}
          {userDetails && (
            <section className="user-details">
              <table>
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{userDetails.name || "N/A"}</td>
                    <td rowSpan={3}>
                      <img
                        src={userDetails.image || "./images/logo.png"}
                        alt="Profile"
                        className="profile-image"
                        onError={handleImageError}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Department</td>
                    <td>{userDetails.department || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Role</td>
                    <td>{facultyId ? "Faculty" : "Student"}</td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}

          {/* Timetable */}
          <h2>Timetable</h2>
          <section className="timetable">
            <table>
              <thead>
                <tr>
                  <th>DAY</th>
                  <th>9:40-10:40</th>
                  <th>10:40-11:40</th>
                  <th>11:40-12:40</th>
                  <th>12:40-1:20</th>
                  <th>1:20-2:20</th>
                  <th>2:20-3:20</th>
                  <th>3:20-4:20</th>
                </tr>
              </thead>
              <tbody>
                {timetable.map((dayData, index) => (
                  <tr key={index}>
                    <td>{dayData.day || "N/A"}</td>
                    {dayData.periods.map((period, i) => (
                      <td key={i}>{period?.subject || "Free"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      )}
    </div>
  );
};

export default Timetable;