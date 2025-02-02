import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Timetable.css";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Timetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [facultyDetails, setFacultyDetails] = useState(null);
    const facultyId = localStorage.getItem("facultyId");

    // Fetch faculty details
    useEffect(() => {
        const fetchFacultyDetails = async () => {
            try {
                if (facultyId) {
                    const response = await axios.get(`https://tkrcet-backend-g3zu.onrender.com/faculty/${facultyId}`);
                    console.log("Faculty details fetched:", response.data);
                    setFacultyDetails(response.data);
                }
            } catch (error) {
                console.error("Error fetching faculty details:", error);
            }
        };

        fetchFacultyDetails();
    }, [facultyId]);

    // Fetch faculty timetable
    useEffect(() => {
        const fetchTimetable = async () => {
            if (!facultyDetails) return;

            try {
                const response = await axios.get(`https://tkrcet-backend-g3zu.onrender.com/faculty/${facultyId}/timetable`);
                console.log("Timetable data fetched:", response?.data?.timetable);
                setTimetable(response?.data?.timetable || []);
            } catch (error) {
                console.error("Error fetching timetable:", error);
            }
        };

        fetchTimetable();
    }, [facultyDetails]);

    // Handle image loading errors
    const handleImageError = (e) => {
        console.warn("Error loading user image. Using fallback image.");
        e.target.src = "/images/logo.png";
    };

    // Merge consecutive periods with the same subject
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
        <div className="timetable-container">
            <Header />
            <div className="nav">
                <NavBar facultyName={facultyDetails?.name || "Faculty"} />
            </div>
            <div className="mob-nav">
                <MobileNav />
            </div>

            {/* Faculty Details Section */}
            <section className="faculty-profile">
                <table className="profile-table">
                    <tbody>
                        <tr>
                            <td className="label">Name</td>
                            <td>{facultyDetails?.name || "N/A"}</td>
                            <td className="profile-image-cell" rowSpan={3}>
                                <img
                                    src={facultyDetails?.image || "/images/logo.png"}
                                    alt={`${facultyDetails?.name || "Faculty"} Profile`}
                                    className="profile-image"
                                    onError={handleImageError}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="label">Department</td>
                            <td>{facultyDetails?.department || "N/A"}</td>
                        </tr>
                        <tr>
                            <td className="label">Designation</td>
                            <td>{facultyDetails?.designation || "N/A"}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* Timetable Section */}
            <h2 className="timetable-heading">Time Table - ODD Semester (2024-25)</h2>
            <section className="timetable-content">
                {timetable.length === 0 ? (
                    <p className="no-data">No timetable data available.</p>
                ) : (
                    <table className="timetable-table">
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
                                const periods = [...Array(7)].map((_, i) =>
                                    dayData.periods.find((p) => p.periodNumber === i + 1) || null
                                );

                                const periodsBeforeLunch = processPeriods(periods.slice(0, 3));
                                const periodsAfterLunch = processPeriods(periods.slice(4));

                                return (
                                    <tr key={index}>
                                        <td className="day-cell">{dayData.day || "N/A"}</td>

                                        {periodsBeforeLunch.map((merged, i) => (
                                            <td key={i} colSpan={merged.span} className="period-cell">
                                                {merged.period
                                                    ? `${merged.period.subject} (${merged.period.year}, ${merged.period.section}, ${merged.period.department || "N/A"})`
                                                    : ""}
                                            </td>
                                        ))}

                                        <td className="lunch-cell">LUNCH</td>

                                        {periodsAfterLunch.map((merged, i) => (
                                            <td key={i + 4} colSpan={merged.span} className="period-cell">
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
                )}
            </section>
        </div>
    );
};

export default Timetable;