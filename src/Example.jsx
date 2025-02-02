import React, { useState, useEffect } from "react";
import styled from "styled-components";

// Styled components
const Container = styled.div`
  font-family: "Arial, sans-serif";
  padding: 20px;
  max-width: 1000px;
  margin: auto;
`;

const LoadingText = styled.div`
  font-size: 18px;
  color: #555;
  text-align: center;
`;

const StudentDetails = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  background-color: #f2f2f2;
  font-weight: bold;
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
  vertical-align: middle;
`;

const Img = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const Example = () => {
  const [student, setStudent] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    if (studentId) {
      fetch(`https://tkrcet-backend-g3zu.onrender.com/Section/${studentId}`)
        .then((response) => response.json())
        .then((data) => {
          setStudent(data.student);
          const { year, department, section } = data.student;
          fetch(
            `https://tkrcet-backend-g3zu.onrender.com/Section/${year}/${department}/${section}/timetable`
          )
            .then((response) => response.json())
            .then((data) => {
              setTimetable(data.timetable);
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching timetable:", error);
              setLoading(false);
            });
        })
        .catch((error) => {
          console.error("Error fetching student details:", error);
          setLoading(false);
        });
    } else {
      console.error("No studentId found in localStorage");
      setLoading(false);
    }
  }, []);

  if (loading) return <LoadingText>Loading...</LoadingText>;
  if (!student) return <LoadingText>Student details not found!</LoadingText>;

  // Function to merge same subjects into single cell
  const renderTimetableRow = (day) => {
    let mergedPeriods = [];
    let i = 0;

    while (i < day.periods.length) {
      let colSpan = 1;
      while (
        i + colSpan < day.periods.length &&
        day.periods[i].subject === day.periods[i + colSpan].subject
      ) {
        colSpan++;
      }
      mergedPeriods.push({ subject: day.periods[i].subject, colSpan });
      i += colSpan;
    }

    return (
      <tr key={day._id}>
        <Td>{day.day}</Td>
        {mergedPeriods.slice(0, 3).map((period, index) => (
          <Td key={index} colSpan={period.colSpan}>{period.subject}</Td>
        ))}
        <Td>LUNCH</Td>
        {mergedPeriods.slice(3).map((period, index) => (
          <Td key={index} colSpan={period.colSpan}>{period.subject}</Td>
        ))}
      </tr>
    );
  };

  return (
    <Container>
      {/* Student Details */}
      <StudentDetails>
        <h2>Student Details</h2>
        <Table>
          <tbody>
            <tr>
              <Th>Roll No.</Th>
              <Td>{student.rollNumber}</Td>
              <Td rowSpan="4">
                <Img src={student.image} alt="Student" />
              </Td>
            </tr>
            <tr>
              <Th>Student Name</Th>
              <Td>{student.name}</Td>
            </tr>
            <tr>
              <Th>Father's Name</Th>
              <Td>{student.fatherName}</Td>
            </tr>
            <tr>
              <Th>Department</Th>
              <Td>{`${student.year} ${student.department} ${student.section}`}</Td>
            </tr>
          </tbody>
        </Table>
      </StudentDetails>

      {/* Timetable */}
      <h2>Timetable</h2>
      <Table>
        <thead>
          <tr>
            <Th>DAY</Th>
            <Th>9:40-10:40</Th>
            <Th>10:40-11:40</Th>
            <Th>11:40-12:40</Th>
            <Th>12:40-1:20</Th>
            <Th>1:20-2:20</Th>
            <Th>2:20-3:20</Th>
            <Th>3:20-4:20</Th>
          </tr>
        </thead>
        <tbody>{timetable.map(renderTimetableRow)}</tbody>
      </Table>
    </Container>
  );
};

export default Example;