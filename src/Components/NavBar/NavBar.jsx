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
  const [providedFacultyId, setProvidedFacultyId] = useState(null);

  const navRef = useRef(null);
  const navigate = useNavigate();
  const mongoDbFacultyId = localStorage.getItem("facultyId");

  // Toggle Attendance Dropdown Menu
  const toggleAttendanceMenu = () => {
    setAttendanceMenuVisible(!attendanceMenuVisible);
  };

  // Toggle Account Dropdown Menu
  const toggleAccountMenu = () => {
    setAccountMenuVisible(!accountMenuVisible);
  };

  // Fetch faculty details using MongoDB _id
  const fetchProvidedFacultyId = async () => {
    try {
      const response = await axios.get(
        `https://tkrcet-backend-g3zu.onrender.com/faculty/${mongoDbFacultyId}`
      );
      setProvidedFacultyId(response.data); // Store full faculty object
    } catch (error) {
      console.error("Error fetching faculty-provided ID:", error);
    }
  };

  // Fetch today's timetable dynamically
  const fetchClassOptions = async () => {
    if (!providedFacultyId) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://tkrcet-backend-g3zu.onrender.com/faculty/${providedFacultyId.facultyId}/timetable-today`
      );
      console.log("API Response:", response.data); // Debugging

      let classes = response.data.classes || [];

      // Filter out empty periods and avoid skipping valid ones
      const uniqueClasses = classes
        .filter((period) => period.subject && period.subject.trim() !== "") // Ignore empty periods
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

      console.log("Filtered Classes:", uniqueClasses); // Debugging
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
    navigate("/"); // Redirect to login page
  };

  // Handle Class click: Show dynamic class dropdown, hide other items
  const handleClassClick = () => {
    setShowDynamicClasses(true);
  };

  // Handle redirection to the attendance page with selected class details
  const handleClassSelect = (option) => {
    const { programYear, department, section, subject } = option;
    const route = `/attendance?programYear=${programYear}&department=${department}&section=${section}&subject=${subject}`;
    navigate(route);
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setAttendanceMenuVisible(false);
        setAccountMenuVisible(false);
        setShowDynamicClasses(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Fetch faculty ID on component mount
  useEffect(() => {
    if (mongoDbFacultyId) {
      fetchProvidedFacultyId();
    }
  }, [mongoDbFacultyId]);

  // Fetch timetable once faculty ID is available
  useEffect(() => {
    if (providedFacultyId && providedFacultyId.facultyId) {
      fetchClassOptions();
    }
  }, [providedFacultyId]);

  return (
    <nav ref={navRef}>
      <div className="nav-left-section">
        <ul className="nav-menu-links">
          <Link to="/index">
            <li>Home</li>
          </Link>
          <Link to="/timetable">
            <li>Timetable</li>
          </Link>
          <li>
            <div className="menu-dropdown">
              <a onClick={toggleAttendanceMenu} id="attendance">
                Attendance
              </a>
              {attendanceMenuVisible && (
                <div
                  className="menu-drop-container"
                  onClick={(e) => e.stopPropagation()}
                >
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
                          <Link id="f" to="">
                            <li onClick={handleClassClick}>Class</li>
                          </Link>
                          <Link id="f" to="/register">
                            <li>Register</li>
                          </Link>
                          <Link id="f" to="/activity">
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
        <span>
          Welcome, {providedFacultyId?.name || "User"}
        </span>
        <div className="account-menu">
          <button className="account-menu-button" onClick={toggleAccountMenu}>
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