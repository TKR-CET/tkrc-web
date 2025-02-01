import React, { useState, useEffect } from 'react';

const Example = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch timetable data from the given URL
    fetch('https://tkrcet-backend-g3zu.onrender.com/Section/B.Tech%20I/CSD/A/timetable')
      .then((response) => response.json())
      .then((data) => {
        setTimetable(data.timetable);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching timetable:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
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