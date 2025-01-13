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

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/faculty/${facultyId}/timetable`
                );
                setTimetable(response.data.timetable);
                setFacultyDetails(response.data.facultyDetails);
            } catch (error) {
                console.error("Error fetching timetable:", error);
            }
        };

        if (facultyId) {
            fetchTimetable();
        } else {
            console.error("Faculty ID is missing!");
        }
    }, [facultyId]);

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
                <NavBar />
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

                      {facultyDetails.image && (
    <img
        src={`http://localhost:5000/uploads/${facultyDetails.image}`}
        alt={`${facultyDetails.name || "Faculty"} Profile`}
        className="faculty-image"
        style={{ width: '100px', height: '100px', borderRadius: '50%' }}
        onError={(e) => {
            e.target.src = "./images/tkrcet-chairman.webp"; // Fallback to default image
        }}
    />
)}                   
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

                            // Split periods into two groups: before and after LUNCH
                            const periodsBeforeLunch = periods.slice(0, 3);
                            const periodsAfterLunch = periods.slice(4);

                            // Process merging for each group
                            const mergedBeforeLunch = processPeriods(periodsBeforeLunch);
                            const mergedAfterLunch = processPeriods(periodsAfterLunch);

                            return (
                                <tr key={index}>
                                    <td>{dayData.day || "N/A"}</td>

                                    {/* Render periods before LUNCH */}
                                    {mergedBeforeLunch.map((merged, i) => (
                                        <td key={i} colSpan={merged.span}>
                                            {merged.period
                                                ? `${merged.period.subject} (${merged.period.year}, ${merged.period.section}, ${merged.period.department || "N/A"})`
                                                : ""}
                                        </td>
                                    ))}

                                    {/* Render LUNCH */}
                                    <td
                                        key="lunch"
                                        style={{ textAlign: "center", fontWeight: "bold" }}
                                    >
                                        LUNCH
                                    </td>

                                    {/* Render periods after LUNCH */}
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
                
