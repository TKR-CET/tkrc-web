import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Timetable.css";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Timetable = () => {
    const [timetable, setTimetable] = useState(null);
    const [facultyDetails, setFacultyDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const facultyId = localStorage.getItem("facultyId");
    const token = localStorage.getItem("token"); 

    useEffect(() => {
        const fetchFacultyDetails = async () => {
            try {
                if (facultyId) {
                    const loadingToast = toast.loading("Fetching faculty details...", { theme: "colored" });

                    const response = await axios.get(`https://tkrc-backend.vercel.app/faculty/${facultyId}`, {
                        headers: { Authorization: `Bearer ${token}` } 
                    });
                    setFacultyDetails(response.data);
                    toast.dismiss(loadingToast);
                }
            } catch (error) {
                toast.error("Error fetching faculty details!", { theme: "colored" });
            }
        };

        fetchFacultyDetails();
    }, [facultyId, token]);

    useEffect(() => {
        const fetchTimetable = async () => {
            if (!facultyDetails) return;

            try {
                const loadingToast = toast.loading("Fetching timetable...", { theme: "colored" });

                const response = await axios.get(`https://tkrc-backend.vercel.app/faculty/${facultyId}/timetable?t=${new Date().getTime()}`, {
                    headers: { Authorization: `Bearer ${token}` } 
                });

                setTimetable(response?.data?.timetable || []);
                setLoading(false);
                toast.dismiss(loadingToast);
            } catch (error) {
                toast.error("Error fetching timetable!", { theme: "colored" });
                setLoading(false);
            }
        };

        fetchTimetable();
    }, [facultyDetails, facultyId, token]);

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
                periods[i].department === periods[i + span].department && 
                periods[i].section === periods[i + span].section
            ) {
                span++;
            }
            mergedPeriods.push({ period: periods[i], span });
            i += span;
        }
        return mergedPeriods;
    };

    const currentYear = new Date().getFullYear();

    return (
        <>
            <ToastContainer position="top-right" autoClose={2000} />
            <Header />
            <div className="nav">
                <NavBar facultyName={facultyDetails?.name || "Faculty"} />
            </div>
            <div className="mob-nav">
                <MobileNav />
            </div>
            <div className="timetable-container">
                {loading ? null : (
                    <>
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
                                                onError={(e) => (e.target.src = "/images/logo.png")}
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

                        <h2 className="timetable-heading">Time Table - ODD Semester ({currentYear}-{currentYear + 1})</h2>

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
                                            
                                            // Extract DB Periods 1, 2, and 3 (Morning)
                                            const dbPeriodsBeforeLunch = [1, 2, 3].map(num => {
                                                const matches = dayData.periods.filter(p => p.periodNumber === num);
                                                return matches.length > 0 ? matches[matches.length - 1] : null;
                                            });

                                            // Extract DB Periods 4, 5, and 6 (Afternoon)
                                            const dbPeriodsAfterLunch = [4, 5, 6].map(num => {
                                                const matches = dayData.periods.filter(p => p.periodNumber === num);
                                                return matches.length > 0 ? matches[matches.length - 1] : null;
                                            });

                                            // Process the merging logic separately for morning and afternoon
                                            const periodsBeforeLunch = processPeriods(dbPeriodsBeforeLunch);
                                            const periodsAfterLunch = processPeriods(dbPeriodsAfterLunch);

                                            return (
                                                <tr key={index}>
                                                    <td className="day-cell">{dayData.day || "N/A"}</td>
                                                    
                                                    {/* Morning Blocks */}
                                                    {periodsBeforeLunch.map((merged, i) => (
                                                        <td key={`before-${i}`} colSpan={merged.span} className="period-cell">
                                                            {merged.period
                                                                ? `${merged.period.subject} (${merged.period.year || ""}, ${merged.period.department || ""}-${merged.period.section || ""})`
                                                                : ""}
                                                        </td>
                                                    ))}

                                                    {/* Hardcoded Lunch Block */}
                                                    <td className="lunch-cell" style={{ backgroundColor: "#ffefc1", fontWeight: "bold" }}>
                                                        LUNCH
                                                    </td>

                                                    {/* Afternoon Blocks */}
                                                    {periodsAfterLunch.map((merged, i) => (
                                                        <td key={`after-${i}`} colSpan={merged.span} className="period-cell">
                                                            {merged.period
                                                                ? `${merged.period.subject} (${merged.period.year || ""}, ${merged.period.department || ""}-${merged.period.section || ""})`
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
                    </>
                )}
            </div>
        </>
    );
};

export default Timetable;
