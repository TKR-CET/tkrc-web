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

    // Fetch User Details (Faculty/Student)
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

                    // Constructing the API URL dynamically
                    const timetableUrl = `https://tkrcet-backend-g3zu.onrender.com/Section/${encodeURIComponent(year)}/${encodeURIComponent(department)}/${encodeURIComponent(section)}/timetable`;
                    console.log("Fetching timetable from:", timetableUrl);

                    response = await axios.get(timetableUrl);
                }

                if (response?.data?.timetable) {
                    console.log("Fetched Timetable Data:", response.data.timetable);
                    setTimetable(response.data.timetable);
                } else {
                    console.error("No timetable data received!");
                }
            } catch (error) {
                console.error("Error fetching timetable:", error);
            }
        };

        if (userDetails.role) {
            fetchTimetable();
        }
    }, [userDetails, facultyId]);

    // Handle User Image Error
    const handleImageError = (e) => {
        console.warn("Error loading user image. Using fallback image.");
        e.target.src = "./images/logo.png"; // Fallback image
    };

    // Merge consecutive identical periods
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
            <div className="nav">
                <NavBar facultyName={userDetails.name || userDetails.student?.name} />
            </div>
            <div className="mob-nav">
                <MobileNav />
            </div>

            {/* User Details Section */}
            <section className="user-details">
                <table>
                    <tbody>
                        <tr>
                            <td id="h3">Name</td>
                            <td>{userDetails.name || userDetails.student?.name || "N/A"}</td>
                            <td id="image" rowSpan={3}>
                                <img
                                    src={userDetails.image || userDetails.student?.image || "./images/logo.png"}
                                    alt={`${userDetails.name || "User"} Profile`}
                                    className="user-image"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        borderRadius: "50%",
                                    }}
                                    onError={handleImageError}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td id="h3">Department</td>
                            <td>{userDetails.department || userDetails.student?.department || "N/A"}</td>
                        </tr>
                        <tr>
                            <td id="h3">Role</td>
                            <td>{userDetails.role || "N/A"}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* Timetable Section */}
            <h2>Time Table - ODD Semester (2024-25)</h2>
            <section className="timetable">
                <table>
                    <thead>
                        <tr className="m4">
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
                        {timetable.map((dayData, index) => {
                            const periods = [...Array(7)].map((_, i) => {
                                return dayData.periods.find((p) => p.periodNumber === i + 1) || null;
                            });

                            const periodsBeforeLunch = periods.slice(0, 3);
                            const periodsAfterLunch = periods.slice(4);

                            const mergedBeforeLunch = processPeriods(periodsBeforeLunch);
                            const mergedAfterLunch = processPeriods(periodsAfterLunch);

                            return (
                                <tr key={index}>
                                    <td>{dayData.day || "N/A"}</td>

                                    {mergedBeforeLunch.map((merged, i) => (
                                        <td key={i} colSpan={merged.span}>
                                            {merged.period
                                                ? userDetails.role === "faculty"
                                                    ? `${merged.period.subject} (${merged.period.year}, ${merged.period.section}, ${merged.period.department || "N/A"})`
                                                    : merged.period.subject
                                                : ""}
                                        </td>
                                    ))}

                                    <td
                                        key="lunch"
                                        style={{ textAlign: "center", fontWeight: "bold" }}
                                    >
                                        LUNCH
                                    </td>

                                    {mergedAfterLunch.map((merged, i) => (
                                        <td key={i + 4} colSpan={merged.span}>
                                            {merged.period
                                                ? userDetails.role === "faculty"
                                                    ? `${merged.period.subject} (${merged.period.year}, ${merged.period.section}, ${merged.period.department || "N/A"})`
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