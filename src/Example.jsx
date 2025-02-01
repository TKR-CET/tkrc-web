import React, { useState, useEffect } from 'react';

const Example = () => {
  const [student, setStudent] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get studentId from localStorage
    const studentId = localStorage.getItem('studentId');
    if (studentId) {
      // Fetch student details based on studentId
      fetch(`https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`)
        .then((response) => response.json())
        .then((data) => {
          setStudent(data.student);

          // Extract year, department, and section from the student details
          const { year, department, section } = data.student;

          // Now fetch the timetable dynamically using student details
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!student) {
    return <div>Student details not found!</div>;
  }

  return (
    <div>
      <h1>Student Information</h1>
      <div>
        <img src={student.image} alt="Student" width={100} height={100} />
        <h3>{student.name}</h3>
        <p>Roll Number: {student.rollNumber}</p>
        <p>Father's Name: {student.fatherName}</p>
        <p>Year: {student.year}</p>
        <p>Department: {student.department}</p>
        <p>Section: {student.section}</p>
      </div>
      <h1>Timetable</h1>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Periods</th>
          </tr>
        </thead>
        <tbody>
          {timetable.map((day) => (
            <tr key={day._id}>
              <td>{day.day}</td>
              <td>
                <ul>
                  {day.periods.map((period) => (
                    <li key={period._id}>
                      Period {period.periodNumber}: {period.subject}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Example;