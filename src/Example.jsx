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
  if (!student) return <div className="loading">Student details not found!</div>;

  // Function to process timetable and apply column spans for repeated subjects
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
    <div className="container">
      <style>
        {`
          .container {
            font-family: 'Arial, sans-serif';
            padding: 20px;
            max-width: 900px;
            margin: auto;
          }
          .loading {
            font-size: 18px;
            color: #555;
            text-align: center;
            margin-top: 50px;
          }
          .student-details {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
          }
          .student-details h2 {
            text-align: center;
            margin-bottom: 15px;
            color: #333;
          }
          .student-details table {
            width: 100%;
            border-collapse: collapse;
          }
          .student-details th, .student-details td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
            text-align: left;
          }
          .student-image {
            max-width: 80px;
            border-radius: 50%;
            display: block;
            margin: auto;
          }
          .timetable {
            margin-top: 20px;
          }
          .timetable h1 {
            text-align: center;
            color: #333;
          }
          .timetable table {
            width: 100%;
            border-collapse: collapse;
          }
          .timetable th, .timetable td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: center;
          }
          .timetable th {
            background: #4CAF50;
            color: white;
            font-weight: bold;
          }
          .timetable td {
            background: #f2f2f2;
          }
        `}
      </style>

      {/* Student Details Section */}
      <div className="student-details">
        <h2>Student Details</h2>
        <table>
          <tbody>
            <tr>
              <th>Roll No.</th>
              <td>{student.rollNumber}</td>
              <td rowSpan="4">
                <img src={student.image} alt="Student" className="student-image" />
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
      <div className="timetable">
        <h1>Timetable</h1>
        <table>
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
                  <td key={index} colSpan={period.colSpan}>{period.subject}</td>
                ))}
                <td>LUNCH</td>
                {processTimetableRow(day.periods.slice(3)).map((period, index) => (
                  <td key={index} colSpan={period.colSpan}>{period.subject}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Example;