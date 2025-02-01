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

  if (loading) return <div>Loading...</div>;
  if (!student) return <div>Student details not found!</div>;

  return (
    <div>
      {/* Student Details Section */}
      <div style={{ marginBottom: '20px' }}>
        <h1>Student Details</h1>
        <div style={{ border: '1px solid #000', padding: '10px', width: 'fit-content' }}>
          <div>
            <strong>Roll No.</strong>
            <div>{student.rollNumber}</div>
          </div>
          <div>
            <strong>Student Name</strong>
            <div>{student.name}</div>
          </div>
          <div>
            <strong>Father's Name</strong>
            <div>{student.fatherName}</div>
          </div>
          <div>
            <strong>Department</strong>
            <div>{student.department} | {student.section}</div>
          </div>
        </div>
      </div>

      {/* Timetable Section */}
      <div>
        <h1>Timetable</h1>
        <table border="1">
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
                {day.periods.slice(0, 3).map((period, index) => (
                  <td key={index}>{period.subject}</td>
                ))}
                <td>LUNCH</td>
                {day.periods.slice(3).map((period, index) => (
                  <td key={index}>{period.subject}</td>
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