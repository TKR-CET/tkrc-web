import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const [attendanceMenuVisible, setAttendanceMenuVisible] = useState(false);
  const [accountMenuVisible, setAccountMenuVisible] = useState(false); // Track Account menu visibility
  const [subMenu, setSubMenu] = useState(null); // Tracks the current submenu (class, department, etc.)
  const [branchesVisible, setBranchesVisible] = useState(false);

  const navRef = useRef(null);
  const navigate = useNavigate();

  const toggleAttendanceMenu = () => {
    setAttendanceMenuVisible(!attendanceMenuVisible);
    setSubMenu(null);
    setBranchesVisible(false);
  };

  const toggleAccountMenu = () => {
    setAccountMenuVisible(!accountMenuVisible);
  };

  const handleClassClick = (e) => {
    e.stopPropagation(); // Prevent closing the menu
    setSubMenu("class");
  };

  const handleYearClick = (e) => {
    e.stopPropagation(); // Prevent closing the menu
    setSubMenu("department");
  };

  const handleDepartmentClick = (e) => {
    e.stopPropagation(); // Prevent closing the menu
    setBranchesVisible(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setAttendanceMenuVisible(false);
        setSubMenu(null);
        setBranchesVisible(false);
        setAccountMenuVisible(false); // Close account menu when clicking outside
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav ref={navRef}>
      <div className="nav-left-section">
        <ul className="nav-menu-links">
          <Link to="/index">
            <li>Home</li>
          </Link>
          <Link  to="/timetable">
            <li>Timetable</li>
          </Link>
          <li>
            <div className="menu-dropdown">
              <a onClick={toggleAttendanceMenu} id="attendance">
                Attendance
              </a>
              {attendanceMenuVisible && (
                <div className="menu-drop-container" onClick={(e) => e.stopPropagation()}>
                  <div className="menu-dropdown-content">
                    {subMenu === null && (
                      <>
                        <ul>
                          <li onClick={handleClassClick}>Class</li>
                          <li>Register</li>
                        <Link id="j" to="/activity" > <li>Activity Diary</li></Link>
                        </ul>
                      </>
                    )}
                    {subMenu === "class" && (
                      <>
                        <ul>
                          <li onClick={handleYearClick}>Year-1</li>
                          <li onClick={handleYearClick}>Year-2</li>
                        </ul>
                      </>
                    )}
                    {subMenu === "department" && (
                      <>
                        <ul>
                          <li onClick={handleDepartmentClick}>Department</li>
                        </ul>
                      </>
                    )}
                    {branchesVisible && (
                      <>
                        <ul>
                         <Link id="j" to="/attendance"><li onClick={() => navigate("/ece-a")}>ECE-A</li></Link>
                         <Link id="j" to="/attendance"><li onClick={() => navigate("/cse-b")}>CSE-B</li></Link>
                         <Link id="j" to="/attendance">   <li onClick={() => navigate("/csd-a")}>CSD-A</li></Link>
                        </ul>
                      </>
                    )}
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
        <span>Welcome, User</span>
        <div className="account-menu">
          <button className="account-menu-button" onClick={toggleAccountMenu}>
            Account
          </button>
          {accountMenuVisible && (
            <div className="account-menu-content">
              <ul>
                <li>Settings</li>
                <li>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;