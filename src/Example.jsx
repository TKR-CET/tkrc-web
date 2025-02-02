import React, { useState, useEffect } from 'react';

const StudentTimetable = () => {
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

  if (loading) return <div className="loading-message">Loading...</div>;
  if (!student) return <div className="loading-message">Student details not found!</div>;

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
    <div className="timetable-container">
      <style>
        {`
          /* General Styling */
.timetable-container {
    font-family: "Arial", sans-serif;
    max-width: 900px;
    margin: 20px auto;
    padding: 20px;
}

/* Loading Message */
.loading-message {
    font-size: 18px;
    color: #555;
    text-align: center;
    margin-top: 50px;
}

/* Student Info Section */
.student-info {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.student-info h2 {
    text-align: center;
    margin-bottom: 15px;
    color: #333;
}

.student-table {
    width: 100%;
    border-collapse: collapse;
}

.student-table th, .student-table td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
    text-align: left;
}

.student-table th {
    background: #f4f4f4;
    color: #333;
}

.student-photo {
    max-width: 80px;
    border-radius: 50%;
    display: block;
    margin: auto;
}

/* Timetable Section */
.timetable-section {
    margin-top: 20px;
}

.timetable-section h1 {
    text-align: center;
    color: #333;
    margin-bottom: 15px;
}

.timetable-table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

.timetable-table th, .timetable-table td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: center;
}

.timetable-table th {
    background: #007bff;
    color: white;
    font-weight: bold;
}

.timetable-table td {
    background: #f2f2f2;
}

/* Timetable Row Styling */
.timetable-table .period-cell {
    background: #e8f4ff;
}

.timetable-table .lunch-cell {
    font-weight: bold;
    background: #ffefc1;
}

/* Responsiveness */
@media (max-width: 768px) {
    .timetable-container {
        padding: 10px;
    }

    .student-info {
        padding: 15px;
    }

    .student-photo {
        max-width: 60px;
    }

    .student-table th, .student-table td {
        font-size: 14px;
        padding: 8px;
    }

    .timetable-table th, .timetable-table td {
        font-size: 14px;
        padding: 10px;
    }
}

@media (max-width: 480px) {
    .student-info {
        padding: 10px;
    }

    .student-table th, .student-table td {
        font-size: 12px;
        padding: 6px;
    }

    .timetable-table th, .timetable-table td {
        font-size: 12px;
        padding: 8px;
    }

    .timetable-section h1 {
        font-size: 18px;
    }
}
        `}
      </style>

      {/* Student Details Section */}
      <div className="student-info">
        <h2>Student Details</h2>
        <table className="student-table">
          <tbody>
            <tr>
              <th>Roll No.</th>
              <td>{student.rollNumber}</td>
              <td rowSpan="4">
                <img src={student.image} alt="Student" className="student-photo" />
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
      <div className="timetable-section">
        <h1>Timetable</h1>
        <table className="timetable-table">
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

export default StudentTimetable;