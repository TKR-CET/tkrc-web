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

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!student) return <div style={styles.error}>Student details not found!</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Student Information</h1>
      <table style={styles.table}>
        <tbody>
          <tr>
            <td rowSpan="6" style={styles.imageCell}>
              <img src={student.image} alt="Student" style={styles.image} />
            </td>
            <td><strong>Name:</strong> {student.name}</td>
          </tr>
          <tr><td><strong>Roll Number:</strong> {student.rollNumber}</td></tr>
          <tr><td><strong>Father's Name:</strong> {student.fatherName}</td></tr>
          <tr><td><strong>Year:</strong> {student.year}</td></tr>
          <tr><td><strong>Department:</strong> {student.department}</td></tr>
          <tr><td><strong>Section:</strong> {student.section}</td></tr>
        </tbody>
      </table>

      <h1 style={styles.title}>Timetable</h1>
      <div style={styles.tableContainer}>
        <table style={styles.timetable}>
          <thead>
            <tr>
              <th>Day</th>
              <th>9:40-10:40</th>
              <th>10:40-11:40</th>
              <th>11:40-12:40</th>
              <th>12:40-1:20</th> {/* Fixed Lunch Period */}
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
                <td style={styles.lunch}>LUNCH</td>
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

// Internal CSS Styles
const styles = {
  container: {
    width: '90%',
    maxWidth: '1200px',
    margin: '20px auto',
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
    fontSize: '24px',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#ff5733',
  },
  error: {
    textAlign: 'center',
    fontSize: '18px',
    color: 'red',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
    textAlign: 'left',
  },
  imageCell: {
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  image: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  timetable: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    textAlign: 'center',
  },
  lunch: {
    background: '#ffcccb',
    fontWeight: 'bold',
  },
  timetableThTd: {
    padding: '12px',
    border: '1px solid #ddd',
  },
  timetableTh: {
    background: '#333',
    color: 'white',
    fontWeight: 'bold',
  },
  timetableTd: {
    background: '#fafafa',
  },
  timetableRowHover: {
    backgroundColor: '#f1f1f1',
  },
  responsive: {
    '@media (max-width: 768px)': {
      table: {
        fontSize: '14px',
      },
      image: {
        width: '80px',
        height: '80px',
      },
      timetableThTd: {
        padding: '8px',
      },
    },
    '@media (max-width: 480px)': {
      container: {
        padding: '10px',
      },
      title: {
        fontSize: '20px',
      },
      tableTd: {
        display: 'block',
        textAlign: 'left',
        border: 'none',
      },
      image: {
        width: '100px',
        height: '100px',
      },
      timetable: {
        fontSize: '12px',
      },
    },
  },
};

export default Example;