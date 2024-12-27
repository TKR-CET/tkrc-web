import React from 'react';  
import Header from '../../Components/Header/Header';  
import NavBar from '../../Components/NavBar/NavBar';  
import MobileNav from "../../Components/MobileNav/MobileNav.jsx"
import "./Activitydiary.css"

const ActivityDiary = () => {  
  return (  
    <div>  
      <Header />  
      <div class="nav">
      <NavBar />  
      </div>
      <div class="mob-nav">
        <MobileNav/>
        </div>
      <div className="activity-container">  
        {/* Sidebar */}  
        <div className="activity-sidebar">  
          <select id="section-dropdown">  
            <option>B.Tech - IV ME I A</option>  
          </select>  
          <a href="#" id="lab-link-btn">CAD / CAM Lab</a>  
        </div>  

        {/* Main Content */}  
        <div className="activity-content">  
          <h2 id="activity-title">  
            Activity Diary (CAD / CAM Lab) Section: IV ME I A - 2024-25  
          </h2>  
          <table id="activity-table">  
            <thead>  
              <tr>  
                <th>S.No</th>  
                <th>Date</th>  
                <th>Period</th>  
                <th>Topic</th>  
                <th>Remark</th>  
                <th>Absentees</th>  
              </tr>  
            </thead>  
            <tbody>  
              <tr>  
                <td>1</td>  
                <td>28-10-2024</td>  
                <td>4</td>  
                <td></td>  
                <td></td>  
                <td></td>  
              </tr>  
              <tr>  
                <td>2</td>  
                <td>28-10-2024</td>  
                <td>5</td>  
                <td></td>  
                <td></td>  
                <td></td>  
              </tr>  
              <tr>  
                <td>3</td>  
                <td>28-10-2024</td>  
                <td>6</td>  
                <td></td>  
                <td></td>  
                <td></td>  
              </tr>  
            </tbody>  
          </table>  
        </div>  
      </div>  
    </div>  
  );  
};  

export default ActivityDiary;