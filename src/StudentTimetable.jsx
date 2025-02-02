import React, { useState, useEffect } from 'react';

const StudentSchedule = () => {
  const [student, setStudent] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (studentId) {
      fetch(`https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`)
        .then((response) => response.json())
        .then((data) => {
          setStudent(data.student);
          const { year, department, section } = data.student;
          fetch(`https://tkrcet-backend-g3zu.onrender.com/Section/${year}/${department}/${section}/timetable`)
            .then((response) => response.json())
            .then((data) => {
              setSchedule(data.timetable);
              setLoading(false);
            })
            .catch((error) => {
              console.error('Error fetching timetable:', error);
              setLoading(false);
            });
        })
        .catch((error) => {
          console.error('Error fetching student details:', error);
          setLoading(false);
        });
    } else {
      console.error('No studentId found in localStorage');
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="loading-text">Loading...</div>;
  if (!student) return <div className="loading-text">Student details not found!</div>;

  const processScheduleRow = (periods) => {
    let spannedPeriods = [];
    let i = 0;

    while (i < periods.length) {
      let spanCount = 1;
      while (i + spanCount < periods.length && periods[i].subject === periods[i + spanCount].subject) {
        spanCount++;
      }
      spannedPeriods.push({ subject: periods[i].subject, colSpan: spanCount });
      i += spanCount;
    }

    return spannedPeriods;
  };

  return (
    <div className="schedule-container">
      {/* Student Information Section */}
      <div className="student-info">
        <h2>Student Profile</h2>
        <table className="student-table">
          <tbody>
            <tr>
              <th>Roll No.</th>
              <td>{student.rollNumber}</td>
              <td rowSpan="4">
                <img src={student.image} alt="Student" className="student-photo" />
              </td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{student.name}</td>
            </tr>
            <tr>
              <th>Father's Name</th>
              <td>{student.fatherName}</td>
            </tr>
            <tr>
              <th>Department</th>
              <td>{`${student.year} ${student.department} ${student.section}`}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Timetable Section */}
      <div className="schedule-section">
        <h1 className="schedule-heading">Weekly Schedule</h1>
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
            {schedule.map((day) => (
              <tr key={day._id}>
                <td>{day.day}</td>
                {processScheduleRow(day.periods.slice(0, 3)).map((period, index) => (
                  <td key={index} className="schedule-cell" colSpan={period.colSpan}>{period.subject}</td>
                ))}
                <td className="lunch-cell">LUNCH</td>
                {processScheduleRow(day.periods.slice(3)).map((period, index) => (
                  <td key={index} className="schedule-cell" colSpan={period.colSpan}>{period.subject}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Styles */}
      <style>
        {`
          .schedule-container {
            width: 90%;
            margin: 20px auto;
            font-family: Arial, sans-serif;
          }

          .student-info {
            text-align: center;
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
          }

          .student-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          .student-table th, .student-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }

          .student-photo {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #007bff;
          }

          .schedule-section {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          }

          .schedule-heading {
            text-align: center;
            margin-bottom: 15px;
            font-size: 24px;
            color: #333;
          }

          .schedule-table {
            width: 100%;
            border-collapse: collapse;
            text-align: center;
          }

          .schedule-table th, .schedule-table td {
            border: 1px solid #ddd;
            padding: 12px;
          }

          .schedule-table th {
            background-color: #007bff;
            color: white;
          }

          .schedule-cell {
            background-color: #e9f5ff;
          }

          .lunch-cell {
            background-color: #ffebcc;
            font-weight: bold;
          }

          @media (max-width: 768px) {
            .schedule-container {
              width: 100%;
              padding: 10px;
            }

            .student-photo {
              width: 80px;
              height: 80px;
            }

            .schedule-table th, .schedule-table td {
              padding: 8px;
              font-size: 12px;
            }

            .schedule-heading {
              font-size: 20px;
            }
          }

          @media (max-width: 480px) {
            .schedule-table th, .schedule-table td {
              padding: 6px;
              font-size: 10px;
            }

            .student-photo {
              width: 60px;
              height: 60px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default StudentSchedule;