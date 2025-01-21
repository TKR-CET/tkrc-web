import React, { useState, useEffect } from 'react';
import './MobileNav.css';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const MenuItem = ({ label, onClick, active }) => (
  <div
    className={`menu-item ${active ? 'active' : ''}`}
    onClick={onClick}
    role="button"
    tabIndex="0"
    aria-pressed={active}
  >
    {label}
  </div>
);

const Dropdown = ({ children, isOpen }) => (
  <div className={`dropdown ${isOpen ? 'open' : ''}`}>
    {children}
  </div>
);

const MobileNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [classOptions, setClassOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [facultyId, setFacultyId] = useState(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const mongoDbId = localStorage.getItem("facultyId");
  const navigate = useNavigate();

  // Fetch facultyId based on mongoDbId
  const fetchFacultyId = async () => {
    if (!mongoDbId) return;

    try {
      const response = await axios.get(`https://tkrcet-backend-g3zu.onrender.com/faculty/${mongoDbId}`);
      setFacultyId(response.data.facultyId);
    } catch (error) {
      console.error("Error fetching facultyId:", error);
    }
  };

  // Fetch today's timetable dynamically
  const fetchClassOptions = async () => {
    if (!facultyId) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://tkrcet-backend-g3zu.onrender.com/faculty/${facultyId}/timetable-today`
      );
      const classes = response.data.classes || [];

      // Filter out duplicates and exclude 4th period (Lunch)
      const uniqueClasses = classes.filter((period, index, self) => {
        if (index === 3) return false; // Exclude 4th period (lunch)
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
    localStorage.removeItem("facultyId"); // Remove facultyId from localStorage
    navigate("/"); // Redirect to login page
  };

  // Toggle Menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setActiveMenu(null);
    setActiveSubmenu(null);
    setAccountMenuOpen(false); // Close account menu when toggling main menu
  };

  // Toggle Account Dropdown Menu
  const toggleAccountMenu = () => {
    setAccountMenuOpen(!accountMenuOpen);
  };

  // Fetch facultyId and timetable data on component load
  useEffect(() => {
    fetchFacultyId();
  }, [mongoDbId]);

  useEffect(() => {
    if (facultyId) {
      fetchClassOptions(); // Fetch timetable once facultyId is available
    }
  }, [facultyId]);

  return (
    <div className="mobile-nav-container">
      <div className="header">
        <span className="logo">TKRCET</span>
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? '×' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="menu">
          <Link id="link" to="/index">
            <MenuItem label="Home" onClick={() => setActiveMenu('home')} active={activeMenu === 'home'} />
          </Link>
          <Link id="link" to="/timetable">
            <MenuItem label="Timetable" onClick={() => setActiveMenu('timetable')} active={activeMenu === 'timetable'} />
          </Link>
          <MenuItem label="Notifications" onClick={() => setActiveMenu('notifications')} active={activeMenu === 'notifications'} />

          {/* Attendance Dropdown in the Main Menu */}
          <MenuItem label="Attendance" onClick={() => setActiveMenu('attendance')} active={activeMenu === 'attendance'} />
          
          {activeMenu === 'attendance' && (
            <Dropdown isOpen={activeMenu === 'attendance'}>
              {/* Class Dropdown */}
              <MenuItem label="Class" onClick={() => setActiveSubmenu('class')} active={activeSubmenu === 'class'} />
              {activeSubmenu === 'class' && (
                <Dropdown isOpen={activeSubmenu === 'class'}>
                  {loading ? (
                    <MenuItem label="Loading..." />
                  ) : classOptions.length === 0 ? (
                    <MenuItem label="No Classes Today" />
                  ) : (
                    classOptions.map((option, index) => (
                      <MenuItem
                        key={index}
                        label={`${option.programYear} ${option.department}-${option.section} - ${option.subject}`}
                        onClick={() =>
                          navigate(
                            `/attendance?programYear=${option.programYear}&department=${option.department}&section=${option.section}&subject=${option.subject}`
                          )
                        }
                      />
                    ))
                  )}
                </Dropdown>
              )}

              {/* Register and Activity Diary */}
              {activeSubmenu !== 'class' && (
                <>
                  <MenuItem label="Register" onClick={() => setActiveSubmenu('register')} active={activeSubmenu === 'register'} />
                  <Link id="link" to="/activity">
                    <MenuItem label="Activity Diary" onClick={() => setActiveSubmenu('activityDiary')} active={activeSubmenu === 'activityDiary'} />
                  </Link>
                </>
              )}
            </Dropdown>
          )}

          {/* Account Menu */}
          <MenuItem label="Account" onClick={toggleAccountMenu} active={accountMenuOpen} />
          {accountMenuOpen && (
            <Dropdown isOpen={accountMenuOpen}>
              <MenuItem label="Settings"  />
              <MenuItem label="Logout" onClick={handleLogout} />
            </Dropdown>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileNav;
