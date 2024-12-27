import React, { useState } from 'react';
import Header from '../../Components/Header/Header';
import NavBar from '../../Components/NavBar/NavBar';
import MobileNav from '../../Components/MobileNav/MobileNav';
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
      <style>
        {`
        .attendanceMain {
          padding: 25px;
          background-color: #fff;
          margin: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .compulsoryText {
          color: red;
          font-weight: bold;
        }
        .attendanceHeading {
          font-size: 26px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
        }
        .attendanceDetails {
          margin-bottom: 20px;
        }
        .periodSelection {
          margin-bottom: 15px;
        }
        .periodSelection label {
          font-size: 18px;
          margin-right: 12px;
        }
        .periodSelection input[type="checkbox"] {
          margin-right: 7px;
        }
        .subjectTopicEntry label {
          font-size: 18px;
          margin-top: 12px;
          display: block;
        }
        .subjectTopicEntry input,
        .subjectTopicEntry textarea {
          width: 100%;
          padding: 12px;
          margin-top: 6px;
          margin-bottom: 12px;
          border-radius: 5px;
          border: 1px solid #dcdcdc;
        }
        .subjectTopicEntry textarea {
          height: 120px;
        }
        #btn-submit {
          background-color: #FF5733;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 18px;
          position: relative;
          top: 10px;
          left: 50%;
          text-align: center;
        }
        #btn-submit:hover {
          background-color: #ff704d;
        }
        button:disabled {
          background-color: #dcdcdc;
          cursor: not-allowed;
        }
        .attendanceList {
          width: 100%;
          border-collapse: collapse;
          margin-top: 22px;
        }
        .attendanceList th,
        .attendanceList td {
          text-align: center;
          padding: 14px;
          border: 1px solid #ddd;
        }
        .attendanceList th {
          background-color: #f7f7f7;
          font-weight: bold;
        }
        .attendanceList td {
          background-color: #fff;
        }
        .attendanceList input[type="radio"] {
          appearance: none;
          width: 26px;
          height: 26px;
          border: 2px solid #ddd;
          border-radius: 50%;
          cursor: pointer;
        }
        .attendanceList input[type="radio"]:checked {
          background-color: #2ecc71;
          border-color: #2ecc71;
        }
        .attendanceList input[type="radio"].presentStatus:checked {
          background-color: #2ecc71;
          border-color: #2ecc71;
        }
        .attendanceList input[type="radio"].absentStatus:checked {
          background-color: #e74c3c;
          border-color: #e74c3c;
        }
        .attendanceList input[type="radio"]:hover {
          border-color: #aaa;
        }
        @media (max-width: 768px) {
          .attendanceMain {
            margin: 15px;
            padding: 20px;
          }
          .attendanceList th,
          .attendanceList td {
            font-size: 14px;
            padding: 10px;
          }
          .subjectTopicEntry textarea {
            height: 100px;
          }
          .subjectTopicEntry input,
          .subjectTopicEntry textarea {
            font-size: 14px;
          }
          button {
            font-size: 16px;
          }
        }
        @media (max-width: 480px) {
          .attendanceList th,
          .attendanceList td {
            font-size: 12px;
            padding: 8px;
          }
          #btn-submit {
            font-size: 16px;
            width: 100%;
            left: 0;
            top: 0;
          }
        }
        `}
      </style>
      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mobNav">
        <MobileNav />
      </div>
      <div className="attendanceMain">
        <p className="compulsoryText">* You Must select Period and Write Topic Obligatory</p>
        <h2 className="attendanceHeading">Attendance on 06-11-2024</h2>
        <div className="attendanceDetails">
          <div className="periodSelection">
            <label>Period:</label>
            <input type="checkbox" id="chk-period1" name="period" value="1" /> <label htmlFor="chk-period1">1</label>
            <input type="checkbox" id="chk-period2" name="period" value="2" /> <label htmlFor="chk-period2">2</label>
            <input type="checkbox" id="chk-period3" name="period" value="3" /> <label htmlFor="chk-period3">3</label>
          </div>
          <div className="subjectTopicEntry">
            <label htmlFor="input-subject">Sub:</label>
            <input type="text" id="input-subject" placeholder="Enter Subject" />
            <label htmlFor="textarea-topic">Topic:</label>
            <textarea id="textarea-topic" placeholder="Enter Topic"></textarea>
          </div>
        </div>
        <table className="attendanceList">
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
                    className={attendance[student.rollNumber] === 'present' ? 'presentStatus' : ''}
                  />
                </td>
                <td>
                  <input
                    type="radio"
                    checked={attendance[student.rollNumber] === 'absent'}
                    onChange={() => handleAttendanceChange(student.rollNumber, 'absent')}
                    className={attendance[student.rollNumber] === 'absent' ? 'absentStatus' : ''}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/attendance">
          <button id="btn-submit" onClick={handleSubmit}>
            Submit
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Marking;
