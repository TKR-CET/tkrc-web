import React, { useState, useEffect } from "react";
import NavBar from "./Components/NavBar/NavBar";
import MobileNav from "./Components/MobileNav/MobileNav";
import Header from "./Components/Header/Header";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [error, setError] = useState("");
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    if (!studentId) {
      setError("Student ID not found in local storage.");
      setLoadingStudent(false);
      setLoadingAttendance(false);
      return;
    }

    // Fetch Student Details
    fetch(`https://tkrc-backend.vercel.app/Section/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.student) {
          setError("Failed to fetch student data.");
          return;
        }
        setStudent(data.student);
      })
      .catch(() => setError("Error fetching student details."))
      .finally(() => setLoadingStudent(false));

    // Fetch Attendance Details
    fetch(
      `https://tkrc-backend.vercel.app/Attendance/student-record?rollNumber=${studentId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.subjectSummary) {
          setError("Failed to fetch attendance data.");
          return;
        }
        setAttendance(data);
      })
      .catch(() => setError("Error fetching attendance data."))
      .finally(() => setLoadingAttendance(false));
  }, [studentId]);

  return (
    <div>
      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>

      {/* Show loading message only for student data */}
      {loadingStudent || loadingAttendance ? (
        <h2 className="loading-text">Loading...</h2>
      ) : error ? (
        <h2 className="loading-text">{error}</h2>
      ) : (
        <>
          {/* Student Details */}
          <div className="student-details">
            <h2>Student Details</h2>
            <table>
              <tbody>
                <tr>
                  <th>Roll No.</th>
                  <td>{student.rollNumber}</td>
                  <td rowSpan="4">
                    <img
                      src={student.image}
                      alt="Student"
                      className="student-image"
                    />
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

          {/* Attendance Summary */}
          <div className="attendance-summary">
            <h2>Attendance Summary</h2>
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Classes Conducted</th>
                  <th>Classes Attended</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {attendance.subjectSummary.map((subject, index) => (
                  <tr key={index}>
                    <td>{subject.subject}</td>
                    <td>{subject.classesConducted}</td>
                    <td>{subject.classesAttended}</td>
                    <td>{subject.percentage}%</td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <b>Total</b>
                  </td>
                  <td>
                    <b>
                      {attendance.subjectSummary.reduce(
                        (sum, sub) => sum + sub.classesConducted,
                        0
                      )}
                    </b>
                  </td>
                  <td>
                    <b>
                      {attendance.subjectSummary.reduce(
                        (sum, sub) => sum + sub.classesAttended,
                        0
                      )}
                    </b>
                  </td>
                  <td id="total">
                    <b>
                      {(
                        (attendance.subjectSummary.reduce(
                          (sum, sub) => sum + sub.classesAttended,
                          0
                        ) /
                          attendance.subjectSummary.reduce(
                            (sum, sub) => sum + sub.classesConducted,
                            0
                          )) *
                        100
                      ).toFixed(2)}
                      %
                    </b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Daily Attendance Summary */}
          <div className="daily-attendance">
            <h2>Daily Attendance</h2>
            <table className="t2">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>1</th>
                  <th>2</th>
                  <th>3</th>
                  <th>4</th>
                  <th>5</th>
                  <th>6</th>
                  <th>Total</th>
                  <th>Attended</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(attendance.dailySummary).map(
                  ([date, data], index) => (
                    <tr key={index}>
                      <td>{date}</td>
                      {[1, 2, 3, 4, 5, 6].map((period) => {
                        const periodData = data.periods[period];
                        return (
                          <td
                            key={period}
                            className={
                              periodData?.status === "present"
                                ? "present-cell"
                                : "absent-cell"
                            }
                          >
                            {periodData?.subject || "-"}
                          </td>
                        );
                      })}
                      <td>{data.total}</td>
                      <td>{data.attended}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Internal CSS */}      
  <style>      
    {`      
         .loading-text {        
    text-align: center;        
    font-size: 20px;        
    margin-top: 20px;        
  }

/* Green for present, Red for absent */
.present-cell {

color: green !important; /* Dark green */      
        font-weight: bold;      
      }      
  
      .absent-cell {      
             
        color: red !important; /* Dark red */      
        font-weight: bold;      
      }      
  
  .student-details, .attendance-summary, .daily-attendance {        
    margin-top: 20px;        
    padding: 25px;        
    background-color: #f9f9f9;        
    border-radius: 8px;        
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);        
  }        
  
  h2 {        
    text-align: center;        
    color: #333;        
  }        
         
  table {        
    width: 100%;        
    margin: 20px 0;        
    border-collapse: collapse;        
    background-color: #fff;        
    border-radius: 8px;        
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);        
  
  }        
  
  th, td {        
    padding: 12px;        
    text-align: center;        
    border-bottom: 1px solid #ddd;        
  }        
  
  th {        
     background-color: #6495ED;      
    color:white;        
    padding:3px 2px;      
  
  }

#total{
color:red;
}

td {
color: #555;
}

img.student-image {        
    width: 140px !important;        
    height: 140px !important;        
    object-fit: cover;        
    border-radius: 50%;        
    margin-left: 20px;        
  }        
  
         
  
  /* Responsive Styles */        
  @media (max-width: 1024px) {        
    table {        
      font-size: 14px;        
       padding:10px ;      
    }        
  
    th, td {        
      padding: 8px;        
    }        
  
    img.student-image {        
      width: 120px;        
      height: 120px;        
    }        
  }        
  
  @media (max-width: 768px) {        
    table {        
      font-size: 12px;        
    }        
  
    th, td {        
      padding: 10px ;        
    }        
  
    img.student-image {        
      width: 70px;        
      height: 70px;        
    }        
  
    .student-details table, .attendance-summary table, .daily-attendance table {        
      font-size: 10px;        
           
    }

.student-details{
padding:5px !important;
}

@media (max-width: 480px) {        
    table {        
      font-size: 10px;        
    }        
  
    th, td {        
      padding: 4px;        
    }        
  
    img.student-image {        
      width: 70px !important;        
      height: 70px !important;        
    }        
  }        
  
  
  
            
  
            
    `}      
  </style>      
    </div>
  );
};

export default StudentDashboard;
