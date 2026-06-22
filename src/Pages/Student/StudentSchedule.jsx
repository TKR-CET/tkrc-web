import React, { useState, useEffect } from "react";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const StudentTimetable = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [classSchedule, setClassSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const timeSlots = [
    "9:40-10:40",
    "10:40-11:40",
    "11:40-12:40",
    "12:40-1:20", // LUNCH SLOT
    "1:20-2:20",
    "2:20-3:20",
    "3:20-4:20",
  ];

  useEffect(() => {
    const rawStudentId = localStorage.getItem("studentId");
    const token = localStorage.getItem("token"); // Retrieve JWT

    if (rawStudentId) {
      const studentId = rawStudentId.trim(); 

      // Fetch Student Details first
      fetch(`https://tkrc-backend.vercel.app/Section/${encodeURIComponent(studentId)}`, {
        headers: { Authorization: `Bearer ${token}` } 
      })
        .then(async (response) => {
          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || "Failed to fetch student data.");
          }
          return response.json();
        })
        .then((data) => {
          if (!data || !data.student) {
            throw new Error("Student details not found!");
          }

          setStudentInfo(data.student);
          const { year, department, section } = data.student;

          // Now fetch the timetable for their specific section
          return fetch(
            `https://tkrc-backend.vercel.app/Section/${year}/${department}/${section}/timetable`, {
              headers: { Authorization: `Bearer ${token}` } 
            }
          );
        })
        .then(async (response) => {
          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || "Failed to fetch timetable.");
          }
          return response.json();
        })
        .then((data) => {
          setClassSchedule(data.timetable || []);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrorMsg(error.message);
          setIsLoading(false);
        });
    } else {
      console.error("No studentId found in localStorage");
      setErrorMsg("Student ID missing. Please log in again.");
      setIsLoading(false);
    }
  }, []);

  // Groups consecutive identical subjects so they merge nicely in the table
  const processPeriods = (periods) => {
    const mergedPeriods = [];
    let i = 0;
    while (i < periods.length) {
      let span = 1;
      while (
        i + span < periods.length &&
        periods[i].subject !== "-" &&
        periods[i].subject !== "LUNCH" &&
        periods[i].subject === periods[i + span].subject
      ) {
        span++;
      }
      mergedPeriods.push({ period: periods[i], span });
      i += span;
    }
    return mergedPeriods;
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Arial', sans-serif; background-color: #f4f4f9; color: #333; }
        .nav, .mob-nav { margin-bottom: 20px; }
        .profile-container { background-color: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin-bottom: 30px; }
        .profile-title { font-size: 1.6em; color: #333; margin-bottom: 15px; }
        .profile-table { width: 100%; border-collapse: collapse; }
        .profile-table th, .profile-table td { padding: 12px; border-bottom: 1px solid #ddd; }
        .profile-table th { background-color: #6495ED; color: white; }
        .profile-photo { width: 100px; height: 100px; border-radius: 50%; border: 2px solid white; object-fit: cover; }
        
        .schedule-container { background-color: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow-x: auto; }
        .schedule-title { font-size: 1.4em; margin-bottom: 15px; color: #333; }
        .schedule-table { width: 100%; border-collapse: collapse; min-width: 800px; }
        .schedule-table th, .schedule-table td { padding: 12px; text-align: center; border: 1px solid #ddd; vertical-align: middle; }
        .schedule-table th { background-color: #6495ED; color: white; font-size: 0.9em; }
        .lunch-break { background-color: #ffefc1 !important; font-weight: bold; color: #d35400; font-size: 1.1em; letter-spacing: 2px; }
        .day-column { font-weight: bold; background-color: #f3f3f3; font-size: 1.1em; }
        
        .loading-text, .error-text { text-align: center; font-size: 1.2em; color: #333; margin-top: 20px; }
        .error-text { color: red; }
        
        @media (max-width: 768px) { 
          .profile-table th, .profile-table td, .schedule-table th, .schedule-table td { font-size: 0.8em; padding: 6px; } 
          .profile-photo { width: 80px; height: 80px; } 
          .schedule-container { padding: 10px; } 
          .schedule-title { font-size: 1.2em; } 
        }
        @media (max-width: 480px) { 
          .profile-photo { width: 70px; height: 70px; } 
          .profile-title, .schedule-title { font-size: 1em; } 
          .schedule-table th, .schedule-table td { font-size: 0.7em; padding: 5px; } 
        }
      `}</style>

      <Header />
      <div className="nav">
        <NavBar />
      </div>
      <div className="mob-nav">
        <MobileNav />
      </div>

      {isLoading ? (
        <div className="loading-text">Loading...</div>
      ) : errorMsg ? (
        <div className="error-text">{errorMsg}</div>
      ) : !studentInfo ? (
        <div className="error-text">Student details not found!</div>
      ) : (
        <>
          {/* PROFILE SECTION */}
          <div className="profile-container">
            <h2 className="profile-title">Student Profile</h2>
            <table className="profile-table">
              <tbody>
                <tr>
                  <th>Roll No.</th>
                  <td>{studentInfo.rollNumber}</td>
                  <td rowSpan="4" style={{ textAlign: "center" }}>
                    <img src={studentInfo.image || "/images/logo.png"} alt="Student" className="profile-photo" />
                  </td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{studentInfo.name}</td>
                </tr>
                <tr>
                  <th>Father's Name</th>
                  <td>{studentInfo.fatherName}</td>
                </tr>
                <tr>
                  <th>Department</th>
                  <td>{`${studentInfo.year} ${studentInfo.department} ${studentInfo.section}`}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TIMETABLE SECTION */}
          <div className="schedule-container">
            <h1 className="schedule-title">Class Timetable</h1>
            {classSchedule.length === 0 ? (
              <p className="loading-text" style={{ fontSize: "1rem" }}>No timetable configured for this section yet.</p>
            ) : (
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>DAY</th>
                    {timeSlots.map((slot, index) => (
                      <th key={index}>{slot}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {classSchedule.map((day) => {
                    // Create the 7 UI slots perfectly matched with the database
                    const uiPeriods = [];
                    for (let i = 0; i < 7; i++) {
                      if (i === 3) {
                        // Slot 4 is always Lunch
                        uiPeriods.push({ subject: "LUNCH", isLunch: true });
                      } else {
                        // Map Slot 0,1,2 -> DB 1,2,3 AND Slot 4,5,6 -> DB 4,5,6
                        const dbPeriodNumber = i < 3 ? i + 1 : i;
                        const period = day.periods.find((p) => p.periodNumber === dbPeriodNumber);
                        
                        if (period) {
                          uiPeriods.push({ ...period, isLunch: false });
                        } else {
                          uiPeriods.push({ subject: "-", isLunch: false });
                        }
                      }
                    }

                    // Group identical consecutive subjects automatically
                    const mergedPeriods = processPeriods(uiPeriods);

                    return (
                      <tr key={day._id || day.day}>
                        <td className="day-column">{day.day}</td>
                        {mergedPeriods.map((merged, index) => (
                          <td
                            key={index}
                            colSpan={merged.span}
                            className={merged.period.isLunch ? "lunch-break" : ""}
                          >
                            {merged.period.isLunch ? (
                              "LUNCH"
                            ) : merged.period.subject === "-" ? (
                              <span style={{ color: "#ccc" }}>-</span>
                            ) : (
                              <div style={{ lineHeight: "1.4" }}>
                                <strong>{merged.period.subject}</strong>
                                {merged.period.facultyName && merged.period.facultyName !== "Unknown" && (
                                  <>
                                    <br />
                                    <span style={{ fontSize: "0.85em", color: "#333", fontWeight: "600" }}>
                                      {merged.period.facultyName}
                                    </span>
                                    {merged.period.phoneNumber && merged.period.phoneNumber !== "N/A" && (
                                      <>
                                        <br />
                                        <span style={{ fontSize: "0.75em", color: "#666" }}>
                                          📞 {merged.period.phoneNumber}
                                        </span>
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default StudentTimetable;
 