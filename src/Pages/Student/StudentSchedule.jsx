import React, { useState, useEffect } from 'react';
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const StudentTimetable = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [classSchedule, setClassSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (studentId) {
      fetch(`https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`)
        .then((response) => response.json())
        .then((data) => {
          setStudentInfo(data.student);
          const { year, department, section } = data.student;
          fetch(`https://tkrcet-backend-g3zu.onrender.com/Section/${year}/${department}/${section}/timetable`)
            .then((response) => response.json())
            .then((data) => {
              setClassSchedule(data.timetable);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error('Error fetching timetable:', error);
              setIsLoading(false);
            });
        })
        .catch((error) => {
          console.error('Error fetching student details:', error);
          setIsLoading(false);
        });
    } else {
      console.error('No studentId found in localStorage');
      setIsLoading(false);
    }
  }, []);

  if (isLoading) return <div className="loading-text">Loading...</div>;
  if (!studentInfo) return <div className="error-text">Student details not found!</div>;

  const formatSchedule = (periods) => {
    let mergedPeriods = [];
    let i = 0;

    while (i < periods.length) {
      let spanCount = 1;
      while (i + spanCount < periods.length && periods[i].subject === periods[i + spanCount].subject) {
        spanCount++;
      }
      mergedPeriods.push({ subject: periods[i].subject, colSpan: spanCount });
      i += spanCount;
    }

    return mergedPeriods;
  };

  return (
    <>
      <Header />
      <div className="navbar-container">
        <NavBar />
      </div>
      <div className="mobile-nav-container">
        <MobileNav />
      </div>

      <style>{`
        /* General Styles */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f9;
          color: #333;
        }

        /* Student Info Section */
        .profile-container {
          background-color: #fff;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }

        .profile-title {
          font-size: 1.6em;
          color: #333;
          margin-bottom: 15px;
        }

        .profile-table {
          width: 100%;
          border-collapse: collapse;
        }

        .profile-table th, .profile-table td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
        }

        .profile-table th {
          background-color: #6495ED;
          color: white;
        }

        .profile-photo {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 2px solid white;
        }

        /* Timetable Section */
        .schedule-container {
          background-color: #fff;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow-x: auto;
        }

        .schedule-title {
          font-size: 1.4em;
          margin-bottom: 15px;
          color: #333;
        }

        .schedule-table {
          width: 100%;
          border-collapse: collapse;
        }

        .schedule-table th, .schedule-table td {
          padding: 12px;
          text-align: center;
          border: 1px solid #ddd;
        }

        .schedule-table th {
          background-color: #6495ED;
          color: white;
        }

        .lunch-break {
          background-color: #ffefc1;
          font-weight: bold;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .profile-table th, .profile-table td, 
          .schedule-table th, .schedule-table td {
            font-size: 0.8em;
            padding: 6px;
          }

          .profile-photo {
            width: 80px;
            height: 80px;
          }

          .schedule-table {
            font-size: 0.8em;
          }

          .schedule-container {
            padding: 10px;
          }

          .schedule-title {
            font-size: 1.2em;
          }
        }

        @media (max-width: 480px) {
          .profile-photo {
            width: 70px;
            height: 70px;
          }

          .profile-title, .schedule-title {
            font-size: 1em;
          }

          .schedule-table th, .schedule-table td {
            font-size: 0.7em;
            padding: 5px;
          }
        }

      `}</style>

      {/* Student Info Section */}
      <div className="profile-container">
        <h2 className="profile-title">Student Profile</h2>
        <table className="profile-table">
          <tbody>
            <tr>
              <th>Roll No.</th>
              <td>{studentInfo.rollNumber}</td>
              <td rowSpan="4">
                <img src={studentInfo.image} alt="Student" className="profile-photo" />
              </td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{studentInfo.name}</td>
            </tr>
            <tr>
              <th>Father's Name</th>
              <td>{studentInfo.fatherName}</td>
            </tr>
            <tr>
              <th>Department</th>
              <td>{`${studentInfo.year} ${studentInfo.department} ${studentInfo.section}`}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Timetable Section */}
      <div className="schedule-container">
        <h1 className="schedule-title">Class Timetable</h1>
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>9:40-10:40</th>
              <th>10:40-11:40</th>
              <th>11:40-12:40</th>
              <th>12:40-1:20</th>
              <th>1:20-2:20</th>
              <th>2:20-3:20</th>
              <th>3:20-4:20</th>
            </tr>
          </thead>
          <tbody>
            {classSchedule.map((day) => (
              <tr key={day._id}>
                <td className="day-column">{day.day}</td>
                {formatSchedule(day.periods.slice(0, 3)).map((period, index) => (
                  <td key={index} colSpan={period.colSpan}>{period.subject}</td>
                ))}
                <td className="lunch-break">LUNCH</td>
                {formatSchedule(day.periods.slice(3)).map((period, index) => (
                  <td key={index + 3} colSpan={period.colSpan}>{period.subject}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StudentTimetable;