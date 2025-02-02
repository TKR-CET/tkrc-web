import React, { useState, useEffect } from 'react';

const StudentSchedule = () => {
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
<style>{`/* General Styles */
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

#dashboard-container {
  width: 95%;
  margin: 30px auto;
  max-width: 1200px;
}

h1, h2 {
  font-weight: bold;
  color: #333;
}

h1 {
  font-size: 1.8em;
  margin-bottom: 15px;
}

h2 {
  font-size: 1.6em;
  margin-bottom: 15px;
}

/* Student Info Section */
#student-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

#student-details {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

#student-details th, #student-details td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

#student-details th {
  background-color: #007bff;
  color: white;
}

#student-photo img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #007bff;
}

/* Timetable Section */
#schedule-section {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

#schedule-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

#schedule-table th, #schedule-table td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
}

#schedule-table th {
  background-color: #007bff;
  color: white;
}

.schedule-cell {
  background-color: #f9f9f9;
}

.schedule-period {
  background-color: #f4f4f4;
}

#lunch-cell {
  background-color: #ffcc00;
  color: #333;
  font-weight: bold;
}

#schedule-table td {
  font-size: 1em;
}

/* Responsive Styles */
@media (max-width: 1200px) {
  #dashboard-container {
    width: 95%;
    padding: 15px;
  }

  #student-card {
    padding: 15px;
  }

  #schedule-section {
    padding: 15px;
  }

  #schedule-table th, #schedule-table td {
    padding: 10px;
  }

  #student-photo img {
    width: 100px;
    height: 100px;
  }

  #schedule-table th {
    font-size: 1.2em;
  }
}

@media (max-width: 768px) {
  #schedule-table th, #schedule-table td {
    font-size: 0.9em;
    padding: 8px;
  }

  #student-card {
    padding: 10px;
  }

  #student-details {
    font-size: 0.9em;
  }

  #student-photo img {
    width: 90px;
    height: 90px;
  }

  #schedule-table {
    font-size: 0.9em;
  }

  #schedule-table td {
    padding: 8px;
  }
}

@media (max-width: 480px) {
  #dashboard-container {
    padding: 10px;
  }

  #student-card, #schedule-section {
    padding: 10px;
  }

  #student-details th, #student-details td {
    font-size: 0.8em;
    padding: 6px;
  }

  #schedule-table th, #schedule-table td {
    font-size: 0.8em;
    padding: 6px;
  }

  #student-photo img {
    width: 80px;
    height: 80px;
  }

  #schedule-table th {
    font-size: 1em;
  }

  #schedule-table {
    font-size: 0.9em;
  }
}`}</style>
    <div id="dashboard-container">
      {/* Student Info Section */}
      <div id="student-card">
        <h2>Student Profile</h2>
        <table id="student-details">
          <tbody>
            <tr>
              <th id="roll-no-label">Roll No.</th>
              <td id="roll-no-value">{studentInfo.rollNumber}</td>
              <td id="student-photo" rowSpan="4">
                <img src={studentInfo.image} alt="Student" id="profile-photo" />
              </td>
            </tr>
            <tr>
              <th id="name-label">Name</th>
              <td id="name-value">{studentInfo.name}</td>
            </tr>
            <tr>
              <th id="father-name-label">Father's Name</th>
              <td id="father-name-value">{studentInfo.fatherName}</td>
            </tr>
            <tr>
              <th id="department-label">Department</th>
              <td id="department-value">{`${studentInfo.year} ${studentInfo.department} ${studentInfo.section}`}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Timetable Section */}
      <div id="schedule-section">
        <h1 id="schedule-heading">Class Timetable</h1>
        <table id="schedule-table">
          <thead>
            <tr>
              <th id="day-header">Day</th>
              <th id="period-1">9:40-10:40</th>
              <th id="period-2">10:40-11:40</th>
              <th id="period-3">11:40-12:40</th>
              <th id="period-4">12:40-1:20</th>
              <th id="period-5">1:20-2:20</th>
              <th id="period-6">2:20-3:20</th>
              <th id="period-7">3:20-4:20</th>
            </tr>
          </thead>
          <tbody>
            {classSchedule.map((day) => (
              <tr key={day._id} id={`schedule-row-${day._id}`}>
                <td id={`day-${day._id}`} className="schedule-cell">{day.day}</td>
                {formatSchedule(day.periods.slice(0, 3)).map((period, index) => (
                  <td key={index} id={`period-${index}`} className="schedule-period" colSpan={period.colSpan}>
                    {period.subject}
                  </td>
                ))}
                <td id="lunch-cell" className="lunch-cell">LUNCH</td>
                {formatSchedule(day.periods.slice(3)).map((period, index) => (
                  <td key={index} id={`period-${index + 3}`} className="schedule-period" colSpan={period.colSpan}>
                    {period.subject}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentSchedule;