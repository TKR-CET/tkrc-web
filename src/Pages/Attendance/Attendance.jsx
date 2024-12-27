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

    // Placeholder: Simulate fetching data from the backend
    useEffect(() => {
        // Simulated API call to fetch attendance data
        fetchAttendanceData(batch, date);
    }, [batch, date]);

    const fetchAttendanceData = async (selectedBatch, selectedDate) => {
        console.log("Fetching attendance data for", selectedBatch, selectedDate);
        const mockData = [
            {
                class: 26,
                date: "28-10-24",
                present: 6,
                absentees: "20K91A0328, 20K91A0335, 20K91A0343",
                topic: "CAD Basics",
                remark: "",
                no: 3,
            },
            {
                class: 25,
                date: "28-10-24",
                present: 5,
                absentees: "20K91A0328, 20K91A0335, 20K91A0343",
                topic: "CAM Basics",
                remark: "",
                no: 2,
            },
        ];
        setAttendanceData(mockData); // Simulated data
    };

    const handleEdit = (row) => {
        console.log("Edit row:", row);
        alert(`Edit functionality is not implemented yet for class ${row.class}.`);
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
                <ul className="container">
                    <li className="section">Subject: CAD/CAM Lab</li>
                    <li className="section">Section: IV ME I A (2024-25)</li>
                </ul>
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
                                    <td className="edit-button" onClick={() => handleEdit(row)}>
                                        Edit
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Attendance;