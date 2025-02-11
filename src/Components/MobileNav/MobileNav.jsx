import React, { useState, useEffect } from "react";
import "./MobileNav.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const MenuItem = ({ label, onClick, active }) => (
  <div
    className={`menu-item ${active ? "active" : ""}`}
    onClick={onClick}
    role="button"
    tabIndex="0"
    aria-pressed={active}
  >
    {label}
  </div>
);

const Dropdown = ({ children, isOpen }) => (
  <div className={`dropdown ${isOpen ? "open" : ""}`}>{children}</div>
);

const MobileNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showDynamicClasses, setShowDynamicClasses] = useState(false);
  const [classOptions, setClassOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [facultyData, setFacultyData] = useState(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const facultyIdFromStorage = localStorage.getItem("facultyId");
  const navigate = useNavigate();

  // Fetch faculty details using stored facultyId
  const fetchFacultyData = async () => {
    if (!facultyIdFromStorage) return;

    try {
      const response = await axios.get(
        `https://tkrcet-backend-g3zu.onrender.com/faculty/${facultyIdFromStorage}`
      );
      setFacultyData(response.data);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    }
  };

  // Fetch today's timetable dynamically
  const fetchClassOptions = async () => {
    if (!facultyData) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://tkrcet-backend-g3zu.onrender.com/faculty/${facultyData.facultyId}/timetable-today`
      );
      const classes = response.data.classes || [];

      // Filter out duplicates and exclude empty periods
      const uniqueClasses = classes.filter((period, index, self) => {
        return (
          period.subject && // Exclude empty periods
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
    navigate("/"); // Redirect to login page
  };

  // Toggle main menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setActiveMenu(null);
    setShowDynamicClasses(false);
    setAccountMenuOpen(false);
  };

  // Handle navigation to attendance page
  const handleClassSelect = (option) => {
    const { programYear, department, section, subject } = option;
    navigate(
      `/attendance?programYear=${programYear}&department=${department}&section=${section}&subject=${subject}`
    );
  };

  // Fetch faculty data on component mount
  useEffect(() => {
    if (facultyIdFromStorage) {
      fetchFacultyData();
    }
  }, [facultyIdFromStorage]);

  // Fetch timetable data once faculty data is available
  useEffect(() => {
    if (facultyData) {
      fetchClassOptions();
    }
  }, [facultyData]);

  return (
    <div className="mobile-nav-container">
      <div className="header">
        <span className="logo">TKRCET</span>
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="menu">
          <Link to="/index">
            <MenuItem label="Home" />
          </Link>
          <Link to="/timetable">
            <MenuItem label="Timetable" />
          </Link>
          <MenuItem label="Notifications" />

          {/* Attendance Dropdown */}
          <MenuItem
            label="Attendance"
            onClick={() => setActiveMenu(activeMenu === "attendance" ? null : "attendance")}
            active={activeMenu === "attendance"}
          />

          {activeMenu === "attendance" && (
            <Dropdown isOpen>
              <MenuItem
                label="Class"
                onClick={() => setShowDynamicClasses(!showDynamicClasses)}
                active={showDynamicClasses}
              />
              {showDynamicClasses && (
                <Dropdown isOpen>
                  {loading ? (
                    <MenuItem label="Loading..." />
                  ) : classOptions.length === 0 ? (
                    <MenuItem label="No Classes Today" />
                  ) : (
                    classOptions.map((option, index) => (
                      <MenuItem
                        key={index}
                        label={`${option.programYear} ${option.department}-${option.section} - ${option.subject}`}
                        onClick={() => handleClassSelect(option)}
                      />
                    ))
                  )}
                </Dropdown>
              )}
              <Link to="/register">
                <MenuItem label="Register" />
              </Link>
              <Link to="/activity">
                <MenuItem label="Activity Diary" />
              </Link>
            </Dropdown>
          )}

          {/* Account Dropdown */}
          <MenuItem
            label="Account"
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            active={accountMenuOpen}
          />
          {accountMenuOpen && (
            <Dropdown isOpen>
              <MenuItem label="Settings" />
              <MenuItem label="Logout" onClick={handleLogout} />
            </Dropdown>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileNav;