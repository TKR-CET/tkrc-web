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

  if (loading) return <div id="BIG_LOADING_MESSAGE">Loading...</div>;
  if (!student) return <div id="BIG_NO_STUDENT_MESSAGE">Student details not found!</div>;

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
    <>
      <style>
        {`
        #BIG_STUDENT_SCHEDULE_CONTAINER {
  font-family: 'Arial', sans-serif !important;
  max-width: 90% !important;
  margin: 30px auto !important;
  background: #f9f9f9 !important;
  border-radius: 10px !important;
  padding: 20px !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1) !important;
}

#BIG_STUDENT_PROFILE_SECTION {
  background: #007bff !important;
  color: white !important;
  padding: 15px !important;
  border-radius: 8px !important;
  text-align: center !important;
  margin-bottom: 20px !important;
}

#BIG_PROFILE_TABLE {
  width: 100% !important;
  background: white !important;
  border-radius: 8px !important;
  overflow: hidden !important;
  border-collapse: collapse !important;
}

.BIG_PROFILE_LABEL {
  background: #0056b3 !important;
  color: white !important;
  padding: 10px !important;
  text-align: left !important;
  font-weight: bold !important;
}

.BIG_PROFILE_VALUE {
  padding: 10px !important;
  text-align: left !important;
  border-bottom: 1px solid #ddd !important;
}

#BIG_PROFILE_IMAGE {
  width: 100px !important;
  height: 100px !important;
  border-radius: 50% !important;
  object-fit: cover !important;
  border: 2px solid #0056b3 !important;
}

#BIG_SCHEDULE_SECTION {
  background: white !important;
  border-radius: 8px !important;
  padding: 20px !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) !important;
}

#BIG_SCHEDULE_HEADING {
  text-align: center !important;
  color: #333 !important;
  font-size: 24px !important;
  margin-bottom: 10px !important;
}

#BIG_SCHEDULE_TABLE {
  width: 100% !important;
  border-collapse: collapse !important;
}

#BIG_SCHEDULE_TABLE th,
#BIG_SCHEDULE_TABLE td {
  border: 1px solid #ddd !important;
  padding: 12px !important;
  text-align: center !important;
  font-size: 16px !important;
}

#BIG_SCHEDULE_TABLE th {
  background: #007bff !important;
  color: white !important;
  font-weight: bold !important;
}

.BIG_SCHEDULE_LUNCH_CELL {
  background: #ffcc00 !important;
  font-weight: bold !important;
  color: #333 !important;
}

.BIG_SCHEDULE_PERIOD {
  background: #f4f4f4 !important;
  transition: background 0.3s ease-in-out !important;
}

.BIG_SCHEDULE_PERIOD:hover {
  background: #ddd !important;
}

.BIG_SCHEDULE_ROW:nth-child(even) {
  background: #f9f9f9 !important;
}

@media (max-width: 768px) {
  #BIG_STUDENT_SCHEDULE_CONTAINER {
    max-width: 100% !important;
    padding: 10px !important;
  }

  #BIG_SCHEDULE_TABLE th,
  #BIG_SCHEDULE_TABLE td {
    padding: 8px !important;
    font-size: 14px !important;
  }

  #BIG_PROFILE_IMAGE {
    width: 80px !important;
    height: 80px !important;
  }
}
        `}
      </style>

      <div id="BIG_STUDENT_SCHEDULE_CONTAINER">
        {/* Student Profile Section */}
        <div id="BIG_STUDENT_PROFILE_SECTION">
          <h2 id="BIG_STUDENT_PROFILE_HEADING">Student Details</h2>
          <table id="BIG_PROFILE_TABLE">
            <tbody>
              <tr>
                <th className="BIG_PROFILE_LABEL">Roll No.</th>
                <td className="BIG_PROFILE_VALUE">{student.rollNumber}</td>
                <td rowSpan="4">
                  <img src={student.image} alt="Student" id="BIG_PROFILE_IMAGE" />
                </td>
              </tr>
              <tr>
                <th className="BIG_PROFILE_LABEL">Student Name</th>
                <td className="BIG_PROFILE_VALUE">{student.name}</td>
              </tr>
              <tr>
                <th className="BIG_PROFILE_LABEL">Father's Name</th>
                <td className="BIG_PROFILE_VALUE">{student.fatherName}</td>
              </tr>
              <tr>
                <th className="BIG_PROFILE_LABEL">Department</th>
                <td className="BIG_PROFILE_VALUE">{`${student.year} ${student.department} ${student.section}`}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Schedule Section */}
        <div id="BIG_SCHEDULE_SECTION">
          <h1 id="BIG_SCHEDULE_HEADING">Timetable</h1>
          <table id="BIG_SCHEDULE_TABLE">
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
                <tr key={day._id} className="BIG_SCHEDULE_ROW">
                  <td>{day.day}</td>
                  {processTimetableRow(day.periods.slice(0, 3)).map((period, index) => (
                    <td key={index} className="BIG_SCHEDULE_PERIOD" colSpan={period.colSpan}>{period.subject}</td>
                  ))}
                  <td className="BIG_SCHEDULE_LUNCH_CELL">LUNCH</td>
                  {processTimetableRow(day.periods.slice(3)).map((period, index) => (
                    <td key={index} className="BIG_SCHEDULE_PERIOD" colSpan={period.colSpan}>{period.subject}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StudentSchedule;