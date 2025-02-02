import React, { useState, useEffect } from 'react';

const StudentTimetable = () => {
  const [student, setStudent] = useState(null);
  const [timetable, setTimetable] = useState([]);
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
              setTimetable(data.timetable);
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

  if (loading) return <div className="loading-message">Loading...</div>;
  if (!student) return <div className="loading-message">Student details not found!</div>;

  const processTimetableRow = (periods) => {
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
    <div className="student-timetable-container">
      <style>
        {`
          /* General Styling */
          .student-timetable-container {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1000px;
            margin: 30px auto;
            padding: 30px;
            background: #f7f7f7;
            border-radius: 10px;
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
          }

          /* Loading Message */
          .loading-message {
            font-size: 20px;
            color: #4a4a4a;
            text-align: center;
            margin-top: 50px;
          }

          /* Student Info Section */
          .student-info-section {
            background: #fff;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
          }

          .student-info-section h2 {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
            font-size: 24px;
            font-weight: bold;
          }

          .student-info-table {
            width: 100%;
            border-collapse: collapse;
          }

          .student-info-table th, .student-info-table td {
            padding: 15px;
            border-bottom: 1px solid #ddd;
            text-align: left;
            font-size: 16px;
          }

          .student-info-table th {
            background: #f4f6f9;
            color: #333;
          }

          .student-photo {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #ddd;
          }

          /* Timetable Section */
          .timetable-section {
            margin-top: 20px;
          }

          .timetable-heading {
            text-align: center;
            color: #2c3e50;
            font-size: 28px;
            margin-bottom: 20px;
            font-weight: 600;
          }

          .timetable-table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
          }

          .timetable-table th, .timetable-table td {
            padding: 18px;
            border: 1px solid #ddd;
            text-align: center;
            font-size: 16px;
            font-weight: 500;
          }

          .timetable-table th {
            background: #3498db;
            color: white;
            font-weight: bold;
          }

          .timetable-table td {
            background: #f9fafb;
            color: #2c3e50;
          }

          /* Timetable Row Styling */
          .timetable-table .period-cell {
            background: #eaf5ff;
          }

          .timetable-table .lunch-cell {
            font-weight: bold;
            background: #fff3e5;
            color: #f39c12;
          }

          /* Responsiveness */
          @media (max-width: 768px) {
            .student-timetable-container {
              padding: 20px;
            }

            .student-info-section {
              padding: 20px;
            }

            .student-photo {
              width: 70px;
              height: 70px;
            }

            .student-info-table th, .student-info-table td {
              font-size: 14px;
              padding: 10px;
            }

            .timetable-table th, .timetable-table td {
              font-size: 14px;
              padding: 12px;
            }
          }

          @media (max-width: 480px) {
            .student-info-section {
              padding: 15px;
            }

            .student-info-table th, .student-info-table td {
              font-size: 12px;
              padding: 8px;
            }

            .timetable-table th, .timetable-table td {
              font-size: 12px;
              padding: 10px;
            }

            .timetable-heading {
              font-size: 22px;
            }
          }
        `}
      </style>

      {/* Student Details Section */}
      <div className="student-info-section">
        <h2>Student Details</h2>
        <table className="student-info-table">
          <tbody>
            <tr>
              <th>Roll No.</th>
              <td>{student.rollNumber}</td>
              <td rowSpan="4">
                <img src={student.image} alt="Student" className="student-photo" />
              </td>
            </tr>
            <tr>
              <th>Student Name</th>
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
      <div className="timetable-section">
        <h1 className="timetable-heading">Timetable</h1>
        <table className="timetable-table">
          <thead>
            <tr>
              <th>DAY</th>
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
            {timetable.map((day) => (
              <tr key={day._id}>
                <td>{day.day}</td>
                {processTimetableRow(day.periods.slice(0, 3)).map((period, index) => (
                  <td key={index} className="period-cell" colSpan={period.colSpan}>{period.subject}</td>
                ))}
                <td className="lunch-cell">LUNCH</td>
                {processTimetableRow(day.periods.slice(3)).map((period, index) => (
                  <td key={index} className="period-cell" colSpan={period.colSpan}>{period.subject}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTimetable;