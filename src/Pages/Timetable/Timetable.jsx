import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Timetable.css";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Timetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const facultyId = localStorage.getItem("facultyId");
    const studentId = localStorage.getItem("studentId");

    // Fetch User Details
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                let response;
                if (facultyId) {
                    response = await axios.get(`https://tkrcet-backend-g3zu.onrender.com/faculty/${facultyId}`);
                } else if (studentId) {
                    response = await axios.get(`https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`);
                }

                if (response?.data) {
                    console.log("User Details:", response.data);
                    setUserDetails(response.data);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, [facultyId, studentId]);

    // Fetch Timetable
    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                if (!userDetails || Object.keys(userDetails).length === 0) {
                    console.warn("User details not available yet.");
                    return;
                }

                let response;
                if (userDetails.role === "faculty") {
                    response = await axios.get(`https://tkrcet-backend-g3zu.onrender.com/faculty/${facultyId}/timetable`);
                } else if (userDetails.role === "student") {
                    const { year, department, section } = userDetails.student || {};

                    if (!year || !department || !section) {
                        console.error("Missing student details for timetable fetch");
                        return;
                    }

                    const timetableUrl = `https://tkrcet-backend-g3zu.onrender.com/Section/${encodeURIComponent(year)}/${encodeURIComponent(department)}/${encodeURIComponent(section)}/timetable`;
                    console.log("Fetching timetable from:", timetableUrl);

                    response = await axios.get(timetableUrl);
                }

                if (response?.data?.timetable) {
                    console.log("Fetched Timetable Data:", response.data.timetable);
                    
                    // 🔔 Alert the fetched timetable data
                    alert("Fetched Timetable:\n" + JSON.stringify(response.data.timetable, null, 2));

                    setTimetable(response.data.timetable);
                } else {
                    console.error("No timetable data received!");
                    alert("No timetable data found!");
                }
            } catch (error) {
                console.error("Error fetching timetable:", error);
                alert("Error fetching timetable! Check console.");
            }
        };

        if (userDetails.role) {
            fetchTimetable();
        }
    }, [userDetails, facultyId]);

    return (
        <div>
            <Header />
            <div className="nav">
                <NavBar facultyName={userDetails.name || userDetails.student?.name} />
            </div>
            <div className="mob-nav">
                <MobileNav />
            </div>

            <h2>Time Table - ODD Semester (2024-25)</h2>
            <section className="timetable">
                <table>
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
                        {timetable.length > 0 ? (
                            timetable.map((dayData, index) => (
                                <tr key={index}>
                                    <td>{dayData.day || "N/A"}</td>
                                    {dayData.periods.map((period, i) => (
                                        <td key={i}>
                                            {period ? period.subject : ""}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center", fontWeight: "bold" }}>
                                    No Timetable Available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default Timetable;