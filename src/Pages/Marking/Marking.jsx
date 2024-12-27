import React, { useState } from 'react';
import '/New.css';
import Header from '../../Components/Header/Header';
import NavBar from '../../Components/NavBar/NavBar';
import MobileNav from "../../Components/MobileNav/MobileNav.jsx"
import { Link } from 'react-router-dom';

const Marking = () => {
  const studentsData = [
    { rollNumber: '23891A6XYZ', name: 'Name 1' },
    { rollNumber: '23891A6XYZ2', name: 'Name 2' },
    { rollNumber: '23891A6XYZ3', name: 'Name 3' },
    { rollNumber: '23891A6XYZ4', name: 'Name 4' },
  ];

  const initialAttendance = studentsData.reduce((acc, student) => {
    acc[student.rollNumber] = 'present';
    return acc;
  }, {});

  const [attendance, setAttendance] = useState(initialAttendance);

  const handleAttendanceChange = (rollNumber, status) => {
    setAttendance((prevState) => ({
      ...prevState,
      [rollNumber]: status,
    }));
  };

  const handleSubmit = () => {
    const submitButton = document.getElementById('submit-btn');
    submitButton.innerHTML = 'Submitted';
    submitButton.style.backgroundColor = '#FFA500';
    submitButton.style.color = '#003366';
  };

  return (
    <div>
      <Header />
      <div className="navbar-container">
        <NavBar />
      </div>
      <div className="mobile-navbar">
        <MobileNav/>
      </div>
      <div className="attendance-container">
        <p className="mandatory-text">* You Must select Period and Write Topic Obligatory</p>
        <h2 className="attendance-title">Attendance on 06-11-2024</h2>

        <div className="attendance-form">
          <div className="period-section">
            <label>Period :</label>
            <input type="checkbox" id="period1" name="period" value="1" /> <label htmlFor="period1">1</label>
            <input type="checkbox" id="period2" name="period" value="2" /> <label htmlFor="period2">2</label>
            <input type="checkbox" id="period3" name="period" value="3" /> <label htmlFor="period3">3</label>
            <input type="checkbox" id="period4" name="period" value="4" /> <label htmlFor="period4">4</label>
            <input type="checkbox" id="period5" name="period" value="5" /> <label htmlFor="period5">5</label>
            <input type="checkbox" id="period6" name="period" value="6" /> <label htmlFor="period6">6</label>
          </div>

          <div className="subject-topic-section">
            <label htmlFor="subject-input">Sub :</label>
            <input type="text" id="subject-input" placeholder="Enter Subject" />

            <label htmlFor="topic-textarea">Topic :</label>
            <textarea id="topic-textarea" placeholder="Enter Topic"></textarea>

            <label htmlFor="remarks-textarea">Remarks :</label>
            <textarea id="remarks-textarea" placeholder="Enter Remarks"></textarea>
          </div>
        </div>

        <table className="attendance-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Present</th>
              <th>Absent</th>
            </tr>
          </thead>
          <tbody>
            {studentsData.map((student) => (
              <tr key={student.rollNumber}>
                <td>{student.rollNumber}</td>
                <td>{student.name}</td>
                <td>
                  <input
                    type="radio"
                    checked={attendance[student.rollNumber] === 'present'}
                    onChange={() => handleAttendanceChange(student.rollNumber, 'present')}
                    className={attendance[student.rollNumber] === 'present' ? 'present-radio' : ''}
                  />
                </td>
                <td>
                  <input
                    type="radio"
                    checked={attendance[student.rollNumber] === 'absent'}
                    onChange={() => handleAttendanceChange(student.rollNumber, 'absent')}
                    className={attendance[student.rollNumber] === 'absent' ? 'absent-radio' : ''}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button id="submit-btn" onClick={handleSubmit}>
          <Link to="/attendance">Submit</Link>
        </button>
      </div>
    </div>
  );
};

export default Marking;
