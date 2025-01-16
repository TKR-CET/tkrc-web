import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Timetable.css";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Timetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [facultyDetails, setFacultyDetails] = useState({});
    const facultyId = localStorage.getItem("facultyId"); // Using MongoDB _id from localStorage

    // Fetch timetable
    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/faculty/${facultyId}/timetable`
                );
                setTimetable(response.data.timetable);
            } catch (error) {
                alert("Error fetching timetable: " + error.message);
                console.error("Error fetching timetable:", error);
            }
        };

        if (facultyId) {
            fetchTimetable();
        } else {
            alert("Faculty ID is missing!");
            console.error("Faculty ID is missing!");
        }
    }, [facultyId]);

    // Fetch faculty details
    useEffect(() => {
        const fetchFacultyDetails = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/faculty/${facultyId}`
                );
                setFacultyDetails(response.data);
            } catch (error) {
                alert("Error fetching faculty details: " + error.message);
                console.error("Error fetching faculty details:", error);
            }
        };

        if (facultyId) {
            fetchFacultyDetails();
        }
    }, [facultyId]);

    const handleImageError = (e) => {
        console.warn("Error loading faculty image. Using fallback image.");
        e.target.src = "./images/logo.png"; // Fallback to default image
    };

    const processPeriods = (periods) => {
        const mergedPeriods = [];
        let i = 0;

        while (i < periods.length) {
            let span = 1;
            while (
                i + span < periods.length &&
                periods[i] &&
                periods[i + span] &&
                periods[i].subject === periods[i + span].subject &&
                periods[i].year === periods[i + span].year &&
                periods[i].section === periods[i + span].section
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
                <NavBar facultyName={facultyDetails.name} />
            </div>
            <div className="mob-nav">
                <MobileNav />
            </div>

            {/* Staff Details */}
            <section className="staff-details">
                <table>
                    <tbody>
                        <tr>
                            <td>Name</td>
                            <td>{facultyDetails.name || "N/A"}</td>
                            <td rowSpan={3}>
                                <img
                                    src={facultyDetails.image || "./images/logo.png"} // Use image from separate fetch
                                    alt={`${facultyDetails.name || "Faculty"} Profile`}
                                    className="faculty-image"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        borderRadius: "50%",
                                    }}
                                    onError={handleImageError} // Handle image error fallback
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Department</td>
                            <td>{facultyDetails.department || "N/A"}</td>
                        </tr>
                        <tr>
                            <td>Designation</td>
                            <td>{facultyDetails.role || "N/A"}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* Timetable */}
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
                        {timetable.map((dayData, index) => {
                            const periods = [...Array(7)].map((_, i) => {
                                return dayData.periods.find(
                                    (p) => p.periodNumber === i + 1
                                ) || null;
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
                                                ? `${merged.period.subject} (${merged.period.year}, ${merged.period.section}, ${merged.period.department || "N/A"})`
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
                                                ? `${merged.period.subject} (${merged.period.year}, ${merged.period.section}, ${merged.period.department || "N/A"})`
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
