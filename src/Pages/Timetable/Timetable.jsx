import React from 'react';
import './Timetable.css';
import Header from '../../Components/Header/Header';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../../Components/Footer/Footer'
import MobileNav from "../../Components/MobileNav/MobileNav.jsx"

const Timetable = () => {
  return (
    <div>
      <Header/>
      <div class="nav">
      <NavBar/>
      </div>
      <div class="mob-nav">
      <MobileNav/>
      </div>
      {/* Staff Details */}
      <section className="staff-details">
        <table>
          <thead>
            <tr>
              <th colSpan="3">Staff Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>Faculty name</td>
              <td rowSpan="3" className="staff-image">
                <img src="faculty-image.jpg" alt="Faculty" />
              </td>
            </tr>
            <tr>
              <td>Department</td>
              <td>Department details</td>
            </tr>
            <tr>
              <td>Designation</td>
              <td>Professor/Assistant professor</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Timetable */}
      <section className="timetable">
        <h2>Time Table - ODD Semester (2024-25)</h2>
        <table>
          <thead>
            <tr className="periods">
              <th>DAY</th>
              <th>I</th>
              <th>II</th>
              <th>III</th>
              <th>IV</th>
              <th>V</th>
              <th>VI</th>
              <th>VII</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>MON</td>
              <td>coos</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>period</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>WED</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>THU</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>FRI</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>SAT</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </section>
      
    </div>
  );
};

export default Timetable;