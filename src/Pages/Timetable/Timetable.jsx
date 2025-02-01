import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Timetable.css";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Timetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
    
    const facultyId = localStorage.getItem("facultyId");
    const studentId = localStorage.getItem("studentId");

    // Fetch user details based on role
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                let response;
                if (facultyId) {
                    response = await axios.get(`https://tkrcet-backend-g3zu.onrender.com/faculty/${facultyId}`);
                } else if (studentId) {
                    response = await axios.get(`https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`);
                }
                setUserDetails(response.data);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, [facultyId, studentId]);

    // Fetch timetable based on role
    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                let response;
                if (userDetails?.role === "faculty") {
                    response = await axios.get(`https://tkrcet-backend-g3zu.onrender.com/faculty/${facultyId}/timetable`);
                } else if (userDetails?.role === "student") {
                    const { programYear, department, section } = userDetails.student;
                    response = await axios.get(`https://tkrcet-backend-g3zu.onrender.com/Section/${programYear}/${department}/${section}/timetable`);
                }
                setTimetable(response.data.timetable);
            } catch (error) {
                console.error("Error fetching timetable:", error);
            }
        };

        if (userDetails) fetchTimetable();
    }, [userDetails, facultyId]);

    // Function to merge consecutive periods
    const processPeriods = (periods) => {
        const mergedPeriods = [];
        let i = 0;

        while (i < periods.length) {
            let span = 1;
            while (
                i + span < periods.length &&
                periods[i] &&
                periods[i + span] &&
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
        <div>
            <Header />
            <NavBar />
            <MobileNav />

            <h2>Time Table - ODD Semester (2024-25)</h2>

            {/* Faculty Details Section */}
            {userDetails?.role === "faculty" && (
                <section className="staff-details">
                    <table>
                        <tbody>
                            <tr>
                                <td id="h3">Name</td>
                                <td>{userDetails.name || "N/A"}</td>
                                <td id="image" rowSpan={3}>
                                    <img
                                        src={userDetails.image || "./images/logo.png"}
                                        alt={`${userDetails.name || "Faculty"} Profile`}
                                        className="faculty-image"
                                        onError={(e) => (e.target.src = "./images/logo.png")}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td id="h3">Department</td>
                                <td>{userDetails.department || "N/A"}</td>
                            </tr>
                            <tr>
                                <td id="h3">Designation</td>
                                <td>{userDetails.role || "N/A"}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            )}

            {/* Timetable */}
            <section className="timetable">
                <table>
                    <thead>
                        <tr className="m4">
                            <th>DAY</th>
                            <th>9:40-10:40</th>
                            <th>10:40-11:40</th>
                            <th>11:40-12:40</th>
                            <th>12:40-1:20</th> {/* Lunch */}
                            <th>1:20-2:20</th>
                            <th>2:20-3:20</th>
                            <th>3:20-4:20</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timetable.map((dayData, index) => {
                            const periods = [...Array(7)].map((_, i) => 
                                dayData.periods.find((p) => p.periodNumber === i + 1) || null
                            );

                            const periodsBeforeLunch = periods.slice(0, 3);
                            const periodsAfterLunch = periods.slice(4);

                            const mergedBeforeLunch = processPeriods(periodsBeforeLunch);
                            const mergedAfterLunch = processPeriods(periodsAfterLunch);

                            return (
                                <tr key={index}>
                                    <td>{dayData.day || "N/A"}</td>

                                    {/* Before Lunch */}
                                    {mergedBeforeLunch.map((merged, i) => (
                                        <td key={i} colSpan={merged.span}>
                                            {merged.period
                                                ? userDetails?.role === "faculty"
                                                    ? `${merged.period.subject} (${merged.period.year}, ${merged.period.section}, ${merged.period.department})`
                                                    : merged.period.subject
                                                : ""}
                                        </td>
                                    ))}

                                    {/* Lunch Break */}
                                    <td key="lunch" style={{ textAlign: "center", fontWeight: "bold" }}>
                                        LUNCH
                                    </td>

                                    {/* After Lunch */}
                                    {mergedAfterLunch.map((merged, i) => (
                                        <td key={i + 4} colSpan={merged.span}>
                                            {merged.period
                                                ? userDetails?.role === "faculty"
                                                    ? `${merged.period.subject} (${merged.period.year}, ${merged.period.section}, ${merged.period.department})`
                                                    : merged.period.subject
                                                : ""}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default Timetable;