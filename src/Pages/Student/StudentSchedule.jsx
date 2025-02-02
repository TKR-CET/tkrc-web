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

  if (loading) return <div STYLE={{ TEXTALIGN: 'CENTER', FONTSIZE: '20PX', FONTWEIGHT: 'BOLD' }}>LOADING...</div>;
  if (!student) return <div STYLE={{ TEXTALIGN: 'CENTER', FONTSIZE: '20PX', FONTWEIGHT: 'BOLD', COLOR: 'RED' }}>STUDENT DETAILS NOT FOUND!</div>;

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
    <div STYLE={{
      FONTFAMILY: 'ARIAL, SANS-SERIF',
      MAXWIDTH: '90%',
      MARGIN: '30PX AUTO',
      BACKGROUND: '#F9F9F9',
      BORDERRADIUS: '10PX',
      PADDING: '20PX',
      BOXSHADOW: '0 4PX 10PX RGBA(0, 0, 0, 0.1)'
    }}>
      {/* Student Profile Section */}
      <div STYLE={{
        BACKGROUND: '#007BFF',
        COLOR: 'WHITE',
        PADDING: '15PX',
        BORDERRADIUS: '8PX',
        TEXTALIGN: 'CENTER',
        MARGINBOTTOM: '20PX'
      }}>
        <h2>STUDENT DETAILS</h2>
        <table STYLE={{
          WIDTH: '100%',
          BACKGROUND: 'WHITE',
          BORDERRADIUS: '8PX',
          OVERFLOW: 'HIDDEN',
          BORDERCOLLAPSE: 'COLLAPSE'
        }}>
          <tbody>
            <tr>
              <th STYLE={{ BACKGROUND: '#0056B3', COLOR: 'WHITE', PADDING: '10PX', TEXTALIGN: 'LEFT', FONTWEIGHT: 'BOLD' }}>ROLL NO.</th>
              <td STYLE={{ PADDING: '10PX', TEXTALIGN: 'LEFT', BORDERBOTTOM: '1PX SOLID #DDD' }}>{student.rollNumber}</td>
              <td ROWSPAN="4">
                <img SRC={student.image} ALT="STUDENT" STYLE={{ WIDTH: '100PX', HEIGHT: '100PX', BORDERRADIUS: '50%', OBJECTFIT: 'COVER', BORDER: '2PX SOLID #0056B3' }} />
              </td>
            </tr>
            <tr>
              <th STYLE={{ BACKGROUND: '#0056B3', COLOR: 'WHITE', PADDING: '10PX', TEXTALIGN: 'LEFT', FONTWEIGHT: 'BOLD' }}>STUDENT NAME</th>
              <td STYLE={{ PADDING: '10PX', TEXTALIGN: 'LEFT', BORDERBOTTOM: '1PX SOLID #DDD' }}>{student.name}</td>
            </tr>
            <tr>
              <th STYLE={{ BACKGROUND: '#0056B3', COLOR: 'WHITE', PADDING: '10PX', TEXTALIGN: 'LEFT', FONTWEIGHT: 'BOLD' }}>FATHER'S NAME</th>
              <td STYLE={{ PADDING: '10PX', TEXTALIGN: 'LEFT', BORDERBOTTOM: '1PX SOLID #DDD' }}>{student.fatherName}</td>
            </tr>
            <tr>
              <th STYLE={{ BACKGROUND: '#0056B3', COLOR: 'WHITE', PADDING: '10PX', TEXTALIGN: 'LEFT', FONTWEIGHT: 'BOLD' }}>DEPARTMENT</th>
              <td STYLE={{ PADDING: '10PX', TEXTALIGN: 'LEFT', BORDERBOTTOM: '1PX SOLID #DDD' }}>{`${student.year} ${student.department} ${student.section}`}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Schedule Section */}
      <div STYLE={{
        BACKGROUND: 'WHITE',
        BORDERRADIUS: '8PX',
        PADDING: '20PX',
        BOXSHAODW: '0 2PX 5PX RGBA(0, 0, 0, 0.1)'
      }}>
        <h1 STYLE={{ TEXTALIGN: 'CENTER', COLOR: '#333', FONTSIZE: '24PX', MARGINBOTTOM: '10PX' }}>TIMETABLE</h1>
        <table STYLE={{
          WIDTH: '100%',
          BORDERCOLLAPSE: 'COLLAPSE'
        }}>
          <thead>
            <tr>
              <th STYLE={{ BORDER: '1PX SOLID #DDD', PADDING: '12PX', BACKGROUND: '#007BFF', COLOR: 'WHITE', FONTWEIGHT: 'BOLD' }}>DAY</th>
              <th STYLE={{ BORDER: '1PX SOLID #DDD', PADDING: '12PX' }}>9:40-10:40</th>
              <th STYLE={{ BORDER: '1PX SOLID #DDD', PADDING: '12PX' }}>10:40-11:40</th>
              <th STYLE={{ BORDER: '1PX SOLID #DDD', PADDING: '12PX' }}>11:40-12:40</th>
              <th STYLE={{ BORDER: '1PX SOLID #DDD', PADDING: '12PX' }}>12:40-1:20</th>
              <th STYLE={{ BORDER: '1PX SOLID #DDD', PADDING: '12PX' }}>1:20-2:20</th>
              <th STYLE={{ BORDER: '1PX SOLID #DDD', PADDING: '12PX' }}>2:20-3:20</th>
              <th STYLE={{ BORDER: '1PX SOLID #DDD', PADDING: '12PX' }}>3:20-4:20</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((day) => (
              <tr KEY={day._id} STYLE={{ BACKGROUND: '#F9F9F9' }}>
                <td STYLE={{ BORDER: '1PX SOLID #DDD', PADDING: '12PX' }}>{day.day}</td>
                {processTimetableRow(day.periods.slice(0, 3)).map((period, index) => (
                  <td KEY={index} STYLE={{ BORDER: '1PX SOLID #DDD', PADDING: '12PX', BACKGROUND: '#F4F4F4' }}>{period.subject}</td>
                ))}
                <td STYLE={{ BORDER: '1PX SOLID #DDD', PADDING: '12PX', BACKGROUND: '#FFCC00', FONTWEIGHT: 'BOLD', COLOR: '#333' }}>LUNCH</td>
                {processTimetableRow(day.periods.slice(3)).map((period, index) => (
                  <td KEY={index} STYLE={{ BORDER: '1PX SOLID #DDD', PADDING: '12PX', BACKGROUND: '#F4F4F4' }}>{period.subject}</td>
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