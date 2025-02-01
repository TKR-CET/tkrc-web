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

  // Internal CSS styles
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
    },
    loading: {
      fontSize: '18px',
      color: '#555',
    },
    studentDetails: {
      marginBottom: '20px',
    },
    studentDetailsBox: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      width: 'fit-content',
      backgroundColor: '#f9f9f9',
    },
    detailItem: {
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
    },
    detailLabel: {
      fontWeight: 'bold',
      color: '#333',
      width: '120px',
    },
    detailValue: {
      color: '#555',
    },
    timetable: {
      marginTop: '20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHeader: {
      backgroundColor: '#f2f2f2',
      fontWeight: 'bold',
      padding: '10px',
      border: '1px solid #ddd',
      textAlign: 'left',
    },
    tableCell: {
      padding: '10px',
      border: '1px solid #ddd',
      textAlign: 'left',
    },
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!student) return <div style={styles.loading}>Student details not found!</div>;

  return (
    <div style={styles.container}>
      {/* Student Details Section */}
      <div style={styles.studentDetails}>
        <h1>Student Details</h1>
        <div style={styles.studentDetailsBox}>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Roll No.</span>
            <span style={styles.detailValue}>{student.rollNumber}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Student Name</span>
            <span style={styles.detailValue}>{student.name}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Father's Name</span>
            <span style={styles.detailValue}>{student.fatherName}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Department</span>
            <span style={styles.detailValue}>{student.department} | {student.section}</span>
          </div>
        </div>
      </div>

      {/* Timetable Section */}
      <div style={styles.timetable}>
        <h1>Timetable</h1>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>DAY</th>
              <th style={styles.tableHeader}>9:40-10:40</th>
              <th style={styles.tableHeader}>10:40-11:40</th>
              <th style={styles.tableHeader}>11:40-12:40</th>
              <th style={styles.tableHeader}>12:40-1:20</th>
              <th style={styles.tableHeader}>1:20-2:20</th>
              <th style={styles.tableHeader}>2:20-3:20</th>
              <th style={styles.tableHeader}>3:20-4:20</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((day) => (
              <tr key={day._id}>
                <td style={styles.tableCell}>{day.day}</td>
                {day.periods.slice(0, 3).map((period, index) => (
                  <td style={styles.tableCell} key={index}>{period.subject}</td>
                ))}
                <td style={styles.tableCell}>LUNCH</td>
                {day.periods.slice(3).map((period, index) => (
                  <td style={styles.tableCell} key={index}>{period.subject}</td>
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