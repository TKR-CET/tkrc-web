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
      {/* Student Details Section (FULL WIDTH) */}
      <div className="student-details">
        <h1 className="title">Student Details</h1>
        <div className="student-card">
          <img src={student.image} alt="Student" className="student-image" />
          <div className="student-info">
            <p><strong>Roll No:</strong> {student.rollNumber}</p>
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Father's Name:</strong> {student.fatherName}</p>
            <p><strong>Department:</strong> {student.department} | {student.section}</p>
          </div>
        </div>
      </div>

      {/* Timetable Section (BELOW Student Details) */}
      <div className="timetable-section">
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
      </div>

      {/* Internal CSS Styles */}
      <style>
        {`
          .container {
            width: 90%;
            max-width: 1000px;
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
          .student-details {
            margin-bottom: 30px;
            text-align: center;
          }
          .student-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          .student-image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 10px;
          }
          .student-info p {
            margin: 5px 0;
            font-size: 18px;
            color: #444;
          }
          .timetable-section {
            margin-top: 40px;
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
            .student-card {
              padding: 15px;
            }
            .student-image {
              width: 100px;
              height: 100px;
            }
            .student-info p {
              font-size: 16px;
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
            .student-card {
              padding: 10px;
            }
            .student-image {
              width: 80px;
              height: 80px;
            }
            .student-info p {
              font-size: 14px;
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