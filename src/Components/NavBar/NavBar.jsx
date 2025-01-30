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
  const [userDetails, setUserDetails] = useState(null);

  const navRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user details from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserDetails(JSON.parse(storedUser));
    }
  }, []);

  // Fetch faculty timetable if the user is a faculty member
  const fetchClassOptions = async () => {
    if (!userDetails || userDetails.role !== "faculty") return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://tkrcet-backend-g3zu.onrender.com/faculty/${userDetails.facultyId}/timetable-today`
      );

      let classes = response.data.classes || [];
      const uniqueClasses = classes
        .filter((period) => period.subject && period.subject.trim() !== "")
        .filter((period, index, self) => {
          return (
            self.findIndex(
              (item) =>
                item.subject === period.subject &&
                item.year === period.year &&
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

  useEffect(() => {
    if (userDetails && userDetails.role === "faculty") {
      fetchClassOptions();
    }
  }, [userDetails]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleAttendanceClick = () => {
    if (userDetails?.role === "student") {
      navigate("/student");
    } else {
      setAttendanceMenuVisible(!attendanceMenuVisible);
    }
  };

  const handleClassClick = () => {
    setShowDynamicClasses(true);
  };

  const handleClassSelect = (option) => {
    const { year, department, section, subject } = option;
    navigate(`/attendance?year=${year}&department=${department}&section=${section}&subject=${subject}`);
  };

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
              <a onClick={handleAttendanceClick} id="attendance">
                Attendance
              </a>
              {userDetails?.role === "faculty" && attendanceMenuVisible && (
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
                              {`${option.year} ${option.department}-${option.section} - ${option.subject}`}
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
          Welcome, {userDetails?.name || "User"}
        </span>
        <div className="account-menu">
          <button className="account-menu-button" onClick={() => setAccountMenuVisible(!accountMenuVisible)}>
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