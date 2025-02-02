import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Timetable.css";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";

const Timetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const facultyId = localStorage.getItem("facultyId");
    const studentId = localStorage.getItem("studentId");

    // Fetch user details (faculty or student)
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!facultyId && !studentId) {
                console.error("No facultyId or studentId found in localStorage");
                setLoading(false);
                return;
            }

            try {
                let response;
                if (facultyId) {
                    response = await axios.get(`https://tkrcet-backend-g3zu.onrender.com/faculty/${facultyId}`);
                } else if (studentId) {
                    response = await axios.get(`https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`);
                }

                console.log("User details fetched:", response.data);
                setUserDetails(response.data);
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [facultyId, studentId]);

    // Fetch timetable after userDetails are set
    useEffect(() => {
        const fetchTimetable = async () => {
            if (!userDetails) return;
            if (!userDetails.role) {
                console.error("User details do not contain role information.");
                return;
            }

            try {
                let response;
                if (userDetails.role === "faculty") {
                    response = await axios.get(`https://tkrcet-backend-g3zu.onrender.com/faculty/${facultyId}/timetable`);
                } else if (userDetails.role === "student" && userDetails.student) {
                    const { year, department, section } = userDetails.student;

                    if (!year || !department || !section) {
                        console.error("Missing student details for timetable fetch:", userDetails.student);
                        return;
                    }

                    const timetableUrl = `https://tkrcet-backend-g3zu.onrender.com/Section/${year}/${department}/${section}/timetable`;
                    console.log("Fetching timetable from:", timetableUrl);

                    response = await axios.get(timetableUrl);
                }

                console.log("Timetable data fetched:", response?.data?.timetable);
                setTimetable(response?.data?.timetable || []);
            } catch (error) {
                console.error("Error fetching timetable:", error);
            }
        };

        if (userDetails) {
            fetchTimetable();
        }
    }, [userDetails]);

    if (loading) return <p>Loading...</p>;
    if (!userDetails) return <p>No user details found!</p>;

    return (
        <div>
            <Header />
            <div className="nav">
                <NavBar facultyName={userDetails?.name || userDetails?.student?.name || "User"} />
            </div>
            <div className="mob-nav">
                <MobileNav />
            </div>

            <h2>Timetable</h2>
            <section className="timetable">
                {timetable.length === 0 ? (
                    <p>No timetable data available.</p>
                ) : (
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
                            {timetable.map((day, index) => (
                                <tr key={index}>
                                    <td>{day.day}</td>
                                    {day.periods.map((period, i) => (
                                        <td key={i}>{period.subject || ""}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
};

export default Timetable;