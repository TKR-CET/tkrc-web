import React, { useState } from 'react';
import './Marking.css';
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
    const submitButton = document.getElementById('btn-submit');
    submitButton.innerHTML = 'Submitted';
    submitButton.style.backgroundColor = '#FFA500';
    submitButton.style.color = '#003366';
  };

  return (
    <div>
      <Header />
      <div class="nav">
      <NavBar />
      </div>
      <div class="mob-nav">
        <MobileNav/>
      </div>
      <div className="attendance-wrapper">
        <p className="text-mandatory">* You Must select Period and Write Topic Obligatory</p>
        <h2 className="title-attendance">Attendance on 06-11-2024</h2>

        <div className="attendance-form">
          <div className="form-period-section">
            <label>Period :</label>
            <input type="checkbox" id="chk-period1" name="period" value="1" /> <label htmlFor="chk-period1">1</label>
            <input type="checkbox" id="chk-period2" name="period" value="2" /> <label htmlFor="chk-period2">2</label>
            <input type="checkbox" id="chk-period3" name="period" value="3" /> <label htmlFor="chk-period3">3</label>
            <input type="checkbox" id="chk-period4" name="period" value="4" /> <label htmlFor="chk-period4">4</label>
            <input type="checkbox" id="chk-period5" name="period" value="5" /> <label htmlFor="chk-period5">5</label>
            <input type="checkbox" id="chk-period6" name="period" value="6" /> <label htmlFor="chk-period6">6</label>
          </div>

          <div className="form-subject-topic">
            <label htmlFor="input-subject">Sub :</label>
            <input type="text" id="input-subject" placeholder="Enter Subject" />

            <label htmlFor="textarea-topic">Topic :</label>
            <textarea id="textarea-topic" placeholder="Enter Topic"></textarea>

            <label htmlFor="textarea-remarks">Remarks :</label>
            <textarea id="textarea-remarks" placeholder="Enter Remarks"></textarea>
          </div>
        </div>

        <table className="table-attendance">
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
                    className={attendance[student.rollNumber] === 'present' ? 'radio-present' : ''}
                  />
                </td>
                <td>
                  <input
                    type="radio"
                    checked={attendance[student.rollNumber] === 'absent'}
                    onChange={() => handleAttendanceChange(student.rollNumber, 'absent')}
                    className={attendance[student.rollNumber] === 'absent' ? 'radio-absent' : ''}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button id="btn-submit" onClick={handleSubmit}>
          <Link to="/attendance">Submit</Link>
        </button>
      </div>
    </div>
  );
};

export default Marking;
