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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!student) {
    return <div>Student details not found!</div>;
  }

  return (
    <div style={styles.container}>
      <h1>Student Information</h1>
      <div style={styles.studentInfo}>
        <img src={student.image} alt="Student" width={100} height={100} />
        <h3>{student.name}</h3>
        <p>Roll Number: {student.rollNumber}</p>
        <p>Father's Name: {student.fatherName}</p>
        <p>Year: {student.year}</p>
        <p>Department: {student.department}</p>
        <p>Section: {student.section}</p>
      </div>
      <h1>Timetable</h1>
      <div style={styles.timetable}>
        <div style={styles.header}>
          <div>Day</div>
          <div>9:40-10:40</div>
          <div>10:40-11:40</div>
          <div>11:40-12:40</div>
          <div>12:40-1:20</div>
          <div>1:20-2:20</div>
          <div>2:20-3:20</div>
          <div>3:20-4:20</div>
        </div>
        {timetable.map((day) => (
          <div style={styles.row} key={day._id}>
            <div>{day.day}</div>
            {day.periods.map((period) => (
              <div key={period._id}>{period.subject}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  studentInfo: {
    marginBottom: '20px',
  },
  timetable: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gap: '1px',
    backgroundColor: '#ddd',
  },
  header: {
    display: 'contents',
  },
  row: {
    display: 'contents',
  },
  headerDiv: {
    padding: '10px',
    backgroundColor: '#fff',
    textAlign: 'center',
    border: '1px solid #ddd',
    fontWeight: 'bold',
    backgroundColor: '#f4f4f4',
  },
  rowDiv: {
    padding: '10px',
    backgroundColor: '#fff',
    textAlign: 'center',
    border: '1px solid #ddd',
  },
};

export default Example;