import React, { useState, useEffect } from 'react';

const Example = () => {
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

  if (loading) return <div className="loading">Loading...</div>;
  if (!student) return <div className="error">Student details not found!</div>;

  return (
    <div className="container">
      <h1 className="title">Student Details</h1>
      <table className="student-table">
        <tbody>
          <tr>
            <td className="image-cell" rowSpan="4">
              <img src={student.image} alt="Student" className="student-image" />
            </td>
            <td><strong>Roll No.</strong></td>
            <td>{student.rollNumber}</td>
          </tr>
          <tr>
            <td><strong>Student Name</strong></td>
            <td>{student.name}</td>
          </tr>
          <tr>
            <td><strong>Father's Name</strong></td>
            <td>{student.fatherName}</td>
          </tr>
          <tr>
            <td><strong>Department</strong></td>
            <td>{student.department} | {student.section}</td>
          </tr>
        </tbody>
      </table>

      <h1 className="title">Timetable</h1>
      <div className="table-container">
        <table className="timetable">
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
                <td className="day-cell">{day.day}</td>
                {day.periods.slice(0, 3).map((period, index) => (
                  <td key={index}>{period.subject}</td>
                ))}
                <td className="lunch">LUNCH</td>
                {day.periods.slice(3).map((period, index) => (
                  <td key={index}>{period.subject}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>
        {`
          .container {
            width: 90%;
            max-width: 1200px;
            margin: 20px auto;
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            font-family: Arial, sans-serif;
          }
          .title {
            text-align: center;
            color: #333;
            margin-bottom: 20px;
            font-size: 24px;
          }
          .loading, .error {
            text-align: center;
            font-size: 18px;
            color: red;
          }
          .student-table {
            width: 100%;
            border-collapse: collapse;
            background: #f9f9f9;
            border-radius: 8px;
            overflow: hidden;
          }
          .student-table td {
            padding: 12px;
            border: 1px solid #ddd;
          }
          .image-cell {
            text-align: center;
            vertical-align: middle;
            width: 150px;
          }
          .student-image {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
          }
          .table-container {
            overflow-x: auto;
          }
          .timetable {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            text-align: center;
          }
          .timetable th, .timetable td {
            padding: 12px;
            border: 1px solid #ddd;
          }
          .timetable th {
            background: #333;
            color: white;
          }
          .lunch {
            background: #ffcccb;
            font-weight: bold;
          }
          .day-cell {
            font-weight: bold;
            color: #d9534f;
          }
          @media (max-width: 768px) {
            .student-table td {
              padding: 8px;
            }
            .student-image {
              width: 80px;
              height: 80px;
            }
            .timetable th, .timetable td {
              padding: 8px;
              font-size: 14px;
            }
          }
          @media (max-width: 480px) {
            .container {
              padding: 10px;
            }
            .title {
              font-size: 20px;
            }
            .student-table td {
              display: block;
              text-align: left;
              border: none;
            }
            .student-image {
              width: 80px;
              height: 80px;
            }
            .timetable {
              font-size: 12px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Example;