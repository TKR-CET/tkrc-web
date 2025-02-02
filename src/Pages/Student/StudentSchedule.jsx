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

  if (isLoading) return <div id="loading-message">Loading...</div>;
  if (!studentInfo) return <div id="error-message">Student details not found!</div>;

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
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
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
.student-container {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.student-title {
  font-size: 1.6em;
  color: #333;
  margin-bottom: 15px;
}

.student-table {
  width: 100%;
  border-collapse: collapse;
}
.timetable-day{
background-color:#f3f3f3;
}

.student-table th, .student-table td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

.student-table th {
  background-color: #6495ED !important;
  color: white;
}

#student-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid white;
}

/* Timetable Section */
.timetable-container {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.timetable-table {
  width: 100%;
  border-collapse: collapse;
}

.timetable-table th, .timetable-table td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
}

.timetable-table th {
  background-color: #6495ED;
  color: white;
}

.timetable-lunch {
  background-color: #ffcc00;
  font-weight: bold;
}

/* Responsive */
@media (max-width: 768px) {
  .student-table th, .student-table td, .timetable-table th, .timetable-table td {
    font-size: 1em !important;
    padding: 8px !important;
  }

  #student-photo {
    width: 100px !important;
    height: 100px !important;
  }
}


`}</style>


      {/* Student Info Section */}
      <div id="student-info-container" className="student-container">
        <h2 className="student-title">Student Profile</h2>
        <table id="student-info-table" className="student-table">
          <tbody>
            <tr>
              <th id="student-roll-label">Roll No.</th>
              <td id="student-roll-value">{studentInfo.rollNumber}</td>
              <td id="student-photo-container" rowSpan="4">
                <img src={studentInfo.image} alt="Student" id="student-photo" />
              </td>
            </tr>
            <tr>
              <th id="student-name-label">Name</th>
              <td id="student-name-value">{studentInfo.name}</td>
            </tr>
            <tr>
              <th id="student-father-label">Father's Name</th>
              <td id="student-father-value">{studentInfo.fatherName}</td>
            </tr>
            <tr>
              <th id="student-department-label">Department</th>
              <td id="student-department-value">{`${studentInfo.year} ${studentInfo.department} ${studentInfo.section}`}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Timetable Section */}
      <div id="timetable-container" className="timetable-container">
        <h1 id="timetable-title">Class Timetable</h1>
        <table id="timetable-table" className="timetable-table">
          <thead>
            <tr>
              <th id="timetable-day-header">Day</th>
              <th id="timetable-period-1">9:40-10:40</th>
              <th id="timetable-period-2">10:40-11:40</th>
              <th id="timetable-period-3">11:40-12:40</th>
              <th id="timetable-period-4">12:40-1:20</th>
              <th id="timetable-period-5">1:20-2:20</th>
              <th id="timetable-period-6">2:20-3:20</th>
              <th id="timetable-period-7">3:20-4:20</th>
            </tr>
          </thead>
          <tbody>
            {classSchedule.map((day) => (
              <tr key={day._id} id={`timetable-row-${day._id}`}>
                <td id={`timetable-day-${day._id}`} className="timetable-day">{day.day}</td>
                {formatSchedule(day.periods.slice(0, 3)).map((period, index) => (
                  <td key={index} id={`timetable-period-${index}`} className="timetable-period" colSpan={period.colSpan}>
                    {period.subject}
                  </td>
                ))}
                <td id="timetable-lunch-cell" className="timetable-lunch">LUNCH</td>
                {formatSchedule(day.periods.slice(3)).map((period, index) => (
                  <td key={index} id={`timetable-period-${index + 3}`} className="timetable-period" colSpan={period.colSpan}>
                    {period.subject}
                  </td>
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