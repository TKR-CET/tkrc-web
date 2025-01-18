import React, { useState, useEffect } from "react";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import MobileNav from "../../Components/MobileNav/MobileNav";
import { useLocation, useNavigate } from "react-router-dom";

const Marking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const date = query.get("date") || new Date().toISOString().split("T")[0];
  const programYear = query.get("programYear");
  const department = query.get("department");
  const section = query.get("section");
  const subject = query.get("subject");

  const [studentsData, setStudentsData] = useState([]);
  const [topic, setTopic] = useState("");
  const [remarks, setRemarks] = useState("");
  const [attendance, setAttendance] = useState({});
  const [periods, setPeriods] = useState([]);
  const [markedPeriods, setMarkedPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchExistingAttendance();
    fetchMarkedPeriods();
  }, []);

  // Fetch students list
  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `https://tkrcet-backend.onrender.com/Section/${programYear}/${department}/${section}/students`
      );

      if (!response.ok) throw new Error(`Failed to fetch students: ${response.status}`);
      const result = await response.json();

      if (result.students && Array.isArray(result.students)) {
        setStudentsData(result.students);
        setAttendance(
          result.students.reduce((acc, student) => {
            acc[student.rollNumber] = "present";
            return acc;
          }, {})
        );
      } else {
        throw new Error("Invalid student data format.");
      }
    } catch (error) {
      alert(`Error fetching students: ${error.message}`);
    }
  };

  // Fetch already marked attendance for the selected date, section, and periods
  const fetchExistingAttendance = async () => {
    try {
      const response = await fetch(
        `https://tkrcet-backend.onrender.com/Attendance/date?date=${date}&year=${programYear}&department=${department}&section=${section}`
      );

      if (!response.ok) throw new Error(`Failed to fetch attendance data: ${response.status}`);
      const result = await response.json();

      if (Array.isArray(result.data) && result.data.length > 0) {
        // Populate fields for already marked attendance
        const attendanceData = result.data[0];
        setTopic(attendanceData.topic || "");
        setRemarks(attendanceData.remarks || "");
        setPeriods([attendanceData.period]);
        setAttendance(
          attendanceData.attendance.reduce((acc, student) => {
            acc[student.rollNumber] = student.status;
            return acc;
          }, {})
        );
      }
    } catch (error) {
      alert(`Error fetching existing attendance: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch already marked periods
  const fetchMarkedPeriods = async () => {
    try {
      const response = await fetch(
        `https://tkrcet-backend.onrender.com/Attendance/check?date=${date}&year=${programYear}&department=${department}&section=${section}`
      );

      if (!response.ok) throw new Error(`Failed to fetch marked periods: ${response.status}`);
      const result = await response.json();

      if (Array.isArray(result.periods)) setMarkedPeriods(result.periods);
    } catch (error) {
      alert(`Error fetching marked periods: ${error.message}`);
    }
  };

  // Handle attendance change
  const handleAttendanceChange = (rollNumber, status) => {
    setAttendance((prev) => ({
      ...prev,
      [rollNumber]: status,
    }));
  };

  // Handle submit
  const handleSubmit = async () => {
    const trimmedSubject = subject.trim();
    const trimmedTopic = topic.trim();
    const trimmedRemarks = remarks.trim();

    if (!trimmedSubject || !trimmedTopic || periods.length === 0) {
      alert("Please fill in all mandatory fields (Periods, Subject, and Topic).");
      return;
    }

    const attendanceData = {
      date,
      year: programYear,
      department,
      section,
      subject: trimmedSubject,
      topic: trimmedTopic,
      remarks: trimmedRemarks,
      periods,
      attendance: studentsData.map((student) => ({
        rollNumber: student.rollNumber,
        name: student.name,
        status: attendance[student.rollNumber],
      })),
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://tkrcet-backend.onrender.com/Attendance/mark-attendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attendanceData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Attendance submitted successfully!");
        navigate("/attendance");
      } else {
        throw new Error(result.message || "Failed to submit attendance.");
      }
    } catch (error) {
      alert(`Error submitting attendance: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Mark Attendance UI */}
      {/* Use the same UI as above but now includes the logic to auto-fill topic, remarks, and attendance */}
    </>
  );
};

export default Marking;
