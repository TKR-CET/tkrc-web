import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Attendance.css";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav.jsx";

const Attendance = () => {
    const [date, setDate] = useState("2024-11-06");
    const [batch, setBatch] = useState("ALL");
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAttendanceData(batch, date);
    }, [batch, date]);

    const fetchAttendanceData = async (selectedBatch, selectedDate) => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                http:http://127.0.0.1:8000/api/attendance/?batch=${selectedBatch}&date=${selectedDate}
            );
            
            if (!response.ok) {
                throw new Error("Failed to fetch attendance data");
            }

            const data = await response.json();
            setAttendanceData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (row) => {
        alert(Edit functionality for class ${row.class} is not yet implemented.);
        // Future: Implement editing logic to send data to the backend
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
            <div className="content">
                <div className="title-bar">
                    <div className="batch-date-selectors">
                        <label htmlFor="batch">Batch: </label>
                        <select
                            id="batch"
                            className="batch-selector"
                            value={batch}
                            onChange={(e) => setBatch(e.target.value)}
                        >
                            <option value="ALL">ALL</option>
                            <option value="Batch1">Batch 1</option>
                            <option value="Batch2">Batch 2</option>
                        </select>
                        <label htmlFor="date">Date: </label>
                        <input
                            type="date"
                            id="date"
                            className="date-selector"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <Link to="/mark" className="go">
                            GO
                        </Link>
                    </div>
                </div>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <div className="attendance-table-wrapper">
                        <table className="attendance-table">
                            <thead>
                                <tr>
                                    <th>Class</th>
                                    <th>Date</th>
                                    <th>P</th>
                                    <th>Absentees</th>
                                    <th>Topic</th>
                                    <th>Remark</th>
                                    <th>No.</th>
                                    <th>Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceData.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.class}</td>
                                        <td>{row.date}</td>
                                        <td>{row.present}</td>
                                        <td className="absentee-list">{row.absentees}</td>
                                        <td>{row.topic}</td>
                                        <td>{row.remark}</td>
                                        <td>{row.no}</td>
                                        <td
                                            className="edit-button"
                                            onClick={() => handleEdit(row)}
                                        >
                                            Edit
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Attendance;
