import React, { useState, useEffect } from 'react';

const StudentSchedule = () => {
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

  if (loading) return <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>Loading...</div>;
  if (!student) return <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: 'red' }}>Student details not found!</div>;

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
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '90%',
      margin: '30px auto',
      background: '#f9f9f9',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Student Profile Section */}
      <div style={{
        background: '#007bff',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h2>Student Details</h2>
        <table style={{
          width: '100%',
          background: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          borderCollapse: 'collapse'
        }}>
          <tbody>
            <tr>
              <th style={{ background: '#0056b3', color: 'white', padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Roll No.</th>
              <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{student.rollNumber}</td>
              <td rowSpan="4">
                <img src={student.image} alt="Student" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0056b3' }} />
              </td>
            </tr>
            <tr>
              <th style={{ background: '#0056b3', color: 'white', padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Student Name</th>
              <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{student.name}</td>
            </tr>
            <tr>
              <th style={{ background: '#0056b3', color: 'white', padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Father's Name</th>
              <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{student.fatherName}</td>
            </tr>
            <tr>
              <th style={{ background: '#0056b3', color: 'white', padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Department</th>
              <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{`${student.year} ${student.department} ${student.section}`}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Schedule Section */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ textAlign: 'center', color: '#333', fontSize: '24px', marginBottom: '10px' }}>Timetable</h1>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '12px', background: '#007bff', color: 'white', fontWeight: 'bold' }}>DAY</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>9:40-10:40</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>10:40-11:40</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>11:40-12:40</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>12:40-1:20</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>1:20-2:20</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>2:20-3:20</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>3:20-4:20</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((day) => (
              <tr key={day._id} style={{ background: '#f9f9f9' }}>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{day.day}</td>
                {processTimetableRow(day.periods.slice(0, 3)).map((period, index) => (
                  <td key={index} style={{ border: '1px solid #ddd', padding: '12px', background: '#f4f4f4' }}>{period.subject}</td>
                ))}
                <td style={{ border: '1px solid #ddd', padding: '12px', background: '#ffcc00', fontWeight: 'bold', color: '#333' }}>LUNCH</td>
                {processTimetableRow(day.periods.slice(3)).map((period, index) => (
                  <td key={index} style={{ border: '1px solid #ddd', padding: '12px', background: '#f4f4f4' }}>{period.subject}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentSchedule;