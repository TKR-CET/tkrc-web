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
              <th className="BIG_SCHEDULE_DAY">DAY</th>
              <th className="BIG_SCHEDULE_TIME">9:40-10:40</th>
              <th className="BIG_SCHEDULE_TIME">10:40-11:40</th>
              <th className="BIG_SCHEDULE_TIME">11:40-12:40</th>
              <th className="BIG_SCHEDULE_LUNCH">12:40-1:20</th>
              <th className="BIG_SCHEDULE_TIME">1:20-2:20</th>
              <th className="BIG_SCHEDULE_TIME">2:20-3:20</th>
              <th className="BIG_SCHEDULE_TIME">3:20-4:20</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((day) => (
              <tr key={day._id} className="BIG_SCHEDULE_ROW">
                <td className="BIG_SCHEDULE_DAY">{day.day}</td>
                {processTimetableRow(day.periods.slice(0, 3)).map((period, index) => (
                  <td key={index} className="BIG_SCHEDULE_PERIOD" colSpan={period.colSpan}>
                    {period.subject}
                  </td>
                ))}
                <td className="BIG_SCHEDULE_LUNCH_CELL">LUNCH</td>
                {processTimetableRow(day.periods.slice(3)).map((period, index) => (
                  <td key={index} className="BIG_SCHEDULE_PERIOD" colSpan={period.colSpan}>
                    {period.subject}
                  </td>
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