import React, { useState, useEffect } from 'react';

const StudentDashboard = () => {
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

  if (isLoading) return <div className="loading-message">Loading...</div>;
  if (!studentInfo) return <div className="error-message">Student details not found!</div>;

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
    <div className="dashboard-container">
      {/* Student Info Section */}
      <div className="student-card">
        <h2>Student Profile</h2>
        <table className="student-details">
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
      <div className="schedule-section">
        <h1>Class Timetable</h1>
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
                <td>{day.day}</td>
                {formatSchedule(day.periods.slice(0, 3)).map((period, index) => (
                  <td key={index} colSpan={period.colSpan} className="schedule-cell">{period.subject}</td>
                ))}
                <td className="lunch-break">LUNCH</td>
                {formatSchedule(day.periods.slice(3)).map((period, index) => (
                  <td key={index} colSpan={period.colSpan} className="schedule-cell">{period.subject}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDashboard;