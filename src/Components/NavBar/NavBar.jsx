import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./NavBar.css";

function NavBar() {
  const [attendanceMenuVisible, setAttendanceMenuVisible] = useState(false);
  const [classOptions, setClassOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [showDynamicClasses, setShowDynamicClasses] = useState(false);
  const [userData, setUserData] = useState(null); // Store user details

  const navRef = useRef(null);
  const navigate = useNavigate();
  const studentId = localStorage.getItem("studentId");
  const facultyId = localStorage.getItem("facultyId");

  // Fetch user details based on ID
  const fetchUserData = async () => {
    try {
      if (facultyId) {
        const response = await axios.get(
          `https://tkrc-backend.vercel.app/faculty/${facultyId}`
        );
        setUserData(response.data);
      } else if (studentId) {
        const response = await axios.get(
          `https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`
        );
        setUserData(response.data.student);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch today's timetable dynamically for faculty
  const fetchClassOptions = async () => {
    if (!userData || userData.role !== "faculty") return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://tkrc-backend.vercel.app/faculty/${userData.facultyId}/timetable-today`
      );

      let classes = response.data.classes || [];

      // Remove empty periods and duplicate classes
      const uniqueClasses = classes
        .filter((period) => period.subject && period.subject.trim() !== "")
        .filter((period, index, self) => {
          return (
            self.findIndex(
              (item) =>
                item.subject === period.subject &&
                item.programYear === period.programYear &&
                item.department === period.department &&
                item.section === period.section
            ) === index
          );
        });

      setClassOptions(uniqueClasses);
    } catch (error) {
      console.error("Error fetching class options:", error);
      setClassOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("facultyId");
    localStorage.removeItem("studentId");
    navigate("/"); // Redirect to login page
  };

  // Handle Attendance click (Student Redirects Only on Click)
  const handleAttendanceClick = () => {
    if (userData?.role === "student") {
      navigate("/student");
    } else {
      setAttendanceMenuVisible(!attendanceMenuVisible);
    }
  };

  // Handle class selection for faculty
  const handleClassSelect = (option) => {
    const { programYear, department, section, subject } = option;
    const route = `/attendance?programYear=${programYear}&department=${department}&section=${section}&subject=${subject}`;
    navigate(route);
  };

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch timetable once faculty data is available
  useEffect(() => {
    if (userData?.role === "faculty") {
      fetchClassOptions();
    }
  }, [userData]);

  return (
    <nav ref={navRef}>
      <div className="nav-left-section">
        <ul className="nav-menu-links">
          <Link to="/index">
            <li>Home</li>
          </Link>

          {/* Timetable Navigation based on Role */}
          <li id="time" onClick={() => navigate(studentId ? "/Schedule" : "/timetable")}>
            Timetable
          </li>

          <li>
            <div className="menu-dropdown">
              <a onClick={handleAttendanceClick} id="attendance">
                Attendance
              </a>
              {attendanceMenuVisible && userData?.role === "faculty" && (
                <div className="menu-drop-container">
                  <div className="menu-dropdown-content">
                    <ul>
                      {showDynamicClasses ? (
                        loading ? (
                          <li>Loading classes...</li>
                        ) : classOptions.length === 0 ? (
                          <li>No classes today</li>
                        ) : (
                          classOptions.map((option, index) => (
                            <li
                              key={index}
                              onClick={() => handleClassSelect(option)}
                            >
                              {`${option.programYear} ${option.department}-${option.section} - ${option.subject}`}
                            </li>
                          ))
                        )
                      ) : (
                        <>
                          <li id="g" onClick={() => setShowDynamicClasses(true)}>
                            Class
                          </li>
                          <Link id="g" to="/register">
                            <li>Register</li>
                          </Link>
                          <Link id="g"  to="/activity">
                            <li>Activity Diary</li>
                          </Link>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </li>

          <li>
            <a href="#notifications">Notifications</a>
          </li>
        </ul>
      </div>
      
      <div className="nav-user-profile">
        <span>Welcome, {userData?.name || "User"}</span>
        <div className="account-menu">
          <button
            className="account-menu-button"
            onClick={() => setAccountMenuVisible(!accountMenuVisible)}
          >
            Account
          </button>
          {accountMenuVisible && (
            <div className="account-menu-content">
              <ul>
                <li>Settings</li>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
