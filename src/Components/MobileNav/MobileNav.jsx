import React, { useState } from 'react';
import './MobileNav.css';
import {Link} from "react-router-dom";

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
  const [activeYear, setActiveYear] = useState(null);
  const [showDepartments, setShowDepartments] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setActiveMenu(null);
    setActiveSubmenu(null);
    setActiveYear(null);
    setShowDepartments(false);
  };

  const resetState = () => {
    setActiveSubmenu(null);
    setActiveYear(null);
    setShowDepartments(false);
  };

  const handleSubmenuSelect = (submenu) => {
    if (activeSubmenu === submenu) {
      setActiveSubmenu(null); // Reset if the same submenu is clicked again
    } else {
      setActiveSubmenu(submenu);
      if (submenu === 'class') {
        setActiveYear(null); // Reset year when switching to "Class"
        setShowDepartments(false);
      }
    }
  };

  const handleYearSelect = (year) => {
    if (activeYear === year) {
      setActiveYear(null); // Reset if the same year is clicked again
    } else {
      setActiveYear(year);
      setShowDepartments(false); // Reset department visibility when switching years
    }
  };

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
         <Link id="link" to="/index" ><MenuItem label="Home" onClick={() => setActiveMenu('home')} active={activeMenu === 'home'} /></Link>
       <Link id="link" to="/timetable" > <MenuItem label="Timetable" onClick={() => setActiveMenu('timetable')} active={activeMenu === 'timetable'} /></Link> 
          <MenuItem label="Notifications" onClick={() => setActiveMenu('notifications')} active={activeMenu === 'notifications'} />
          
          {/* Attendance Dropdown in the Main Menu */}
        <MenuItem label="Attendance" onClick={() => setActiveMenu('attendance')} active={activeMenu === 'attendance'} />
          
          {/* Attendance Submenu */}
          {activeMenu === 'attendance' && (
            <Dropdown isOpen={activeMenu === 'attendance'}>
         <MenuItem label="Class" onClick={() => handleSubmenuSelect('class')} active={activeSubmenu === 'class'} />
              
              {/* Only show Register and Activity Diary if Class is not selected */}
              {activeSubmenu !== 'class' && (
                <>
                  <MenuItem label="Register" onClick={() => handleSubmenuSelect('register')} active={activeSubmenu === 'register'} />
              <Link id="link" to="/activity"  ><MenuItem label="Activity Diary" onClick={() => handleSubmenuSelect('activityDiary')} active={activeSubmenu === 'activityDiary'} /></Link> 
                </>
              )}
              
              {/* Class Submenu */}
              {activeSubmenu === 'class' && (
                <Dropdown isOpen={activeSubmenu === 'class'}>
                  {/* Show Year 1 only if Year 2 or Year 3 is not selected */}
                  {activeYear !== 'year2' && activeYear !== 'year3' && (
                    <MenuItem label="Year 1" onClick={() => handleYearSelect('year1')} active={activeYear === 'year1'} />
                  )}

                  {/* Show Year 2 only if Year 1 or Year 3 is not selected */}
                  {activeYear !== 'year1' && activeYear !== 'year3' && (
                    <MenuItem label="Year 2" onClick={() => handleYearSelect('year2')} active={activeYear === 'year2'} />
                  )}

                  {/* Show Year 3 only if Year 1 or Year 2 is not selected */}
                  {activeYear !== 'year1' && activeYear !== 'year2' && (
                    <MenuItem label="Year 3" onClick={() => handleYearSelect('year3')} active={activeYear === 'year3'} />
                  )}

                  {/* Year-based Department Selection */}
                  {(activeYear === 'year1' || activeYear === 'year2' || activeYear === 'year3') && (
                    <Dropdown isOpen={true}>
                      <MenuItem label="Department" onClick={() => setShowDepartments(true)} active={showDepartments} />
                      {showDepartments && (
                        <Dropdown isOpen={showDepartments}>
                       <Link id="link" to="/attendance" > <MenuItem label="CSE" /></Link> 
                        <Link id="link" to="/attendance" >    <MenuItem label="ECE" /></Link>
                      <Link id="link" to="/attendance" >     <MenuItem label="EEE" /></Link>
                       <Link id="link" to="/attendance" >    <MenuItem label="Mechanical" /></Link>
                        </Dropdown>
                      )}
                    </Dropdown>
                  )}
                </Dropdown>
              )}
            </Dropdown>
          )}

          {/* Account Menu Item */}
          <MenuItem label="Account" onClick={() => setActiveMenu('account')} active={activeMenu === 'account'} />
        </div>
      )}
    </div>
  );
};

export default MobileNav;