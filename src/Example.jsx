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
        {/* Table Header */}
        <div style={styles.header}>
          <div style={styles.cell}>Day</div>
          <div style={styles.cell}>9:40-10:40</div>
          <div style={styles.cell}>10:40-11:40</div>
          <div style={styles.cell}>11:40-12:40</div>
          <div style={styles.cell}>12:40-1:20</div> {/* Fixed Lunch Period */}
          <div style={styles.cell}>1:20-2:20</div>
          <div style={styles.cell}>2:20-3:20</div>
          <div style={styles.cell}>3:20-4:20</div>
        </div>

        {/* Table Body */}
        {timetable.map((day) => (
          <div style={styles.row} key={day._id}>
            <div style={styles.cell}>{day.day}</div>
            {day.periods.slice(0, 3).map((period, index) => (
              <div style={styles.cell} key={index}>{period.subject}</div>
            ))}
            <div style={{ ...styles.cell, backgroundColor: '#f4f4f4', fontWeight: 'bold' }}>LUNCH</div>
            {day.periods.slice(3).map((period, index) => (
              <div style={styles.cell} key={index}>{period.subject}</div>
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
    textAlign: 'center',
  },
  timetable: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
  },
  header: {
    display: 'contents',
    fontWeight: 'bold',
    backgroundColor: '#f4f4f4',
  },
  row: {
    display: 'contents',
  },
  cell: {
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'center',
  },
};

export default Example;