import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Timetable.css";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Timetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [facultyDetails, setFacultyDetails] = useState(null);
    const facultyId = localStorage.getItem("facultyId");

    // Show loading toast
    const showLoadingToast = () => toast.info("Fetching timetable...", { autoClose: false, toastId: "loadingToast" });

    // Dismiss loading toast
    const dismissLoadingToast = () => toast.dismiss("loadingToast");

    useEffect(() => {
        const fetchFacultyDetails = async () => {
            try {
                if (facultyId) {
                    showLoadingToast();
                    const response = await axios.get(`https://tkrcet-backend-g3zu.onrender.com/faculty/${facultyId}`);
                    setFacultyDetails(response.data);
                }
            } catch (error) {
                toast.error("Error fetching faculty details.");
            } finally {
                dismissLoadingToast();
            }
        };

        fetchFacultyDetails();
    }, [facultyId]);

    useEffect(() => {
        const fetchTimetable = async () => {
            if (!facultyDetails) return;
            
            try {
                showLoadingToast();
                const response = await axios.get(`https://tkrcet-backend-g3zu.onrender.com/faculty/${facultyId}/timetable`);
                setTimetable(response?.data?.timetable || []);
            } catch (error) {
                toast.error("Error fetching timetable.");
            } finally {
                dismissLoadingToast();
            }
        };

        fetchTimetable();
    }, [facultyDetails]);

    return (
        <>
            <Header />
            <div className="nav">
                <NavBar facultyName={facultyDetails?.name || "Faculty"} />
            </div>
            <div className="mob-nav">
                <MobileNav />
            </div>
            <div className="timetable-container">
                {/* Faculty Details Section */}
                <section className="faculty-profile">
                    <table className="profile-table">
                        <tbody>
                            <tr>
                                <td className="label">Name</td>
                                <td>{facultyDetails?.name || "N/A"}</td>
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
                <h2 className="timetable-heading">Time Table</h2>
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
                                {timetable.map((dayData, index) => (
                                    <tr key={index}>
                                        <td className="day-cell">{dayData.day || "N/A"}</td>
                                        {dayData.periods.map((period, i) => (
                                            <td key={i} className="period-cell">
                                                {period ? `${period.subject} (${period.year}, ${period.section})` : ""}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </div>
        </>
    );
};

export default Timetable;