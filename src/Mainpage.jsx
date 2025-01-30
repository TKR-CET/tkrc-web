import React from 'react';
import './Mainpage.css';
import Landingpage from './Landingpage/Landingpage';
import { Routes, Route, useLocation } from "react-router-dom";
import Timetable from './Pages/Timetable/Timetable.jsx';
import Attendance from './Pages/Attendance/Attendance'
import Activitydiary from './Pages/Activitydiary/Activitydiary';
import Homepage from "./Homepage/Homepage";
import Marking from "./Pages/Marking/Marking.jsx";
import AddFacultyForm from "./AddFacultyForm";
import AddSectionData from "./AddSectionData";
import Register from "./Pages/Register/Register.jsx";
import StudentDashboard from "./Student/Studentdashboard.jsx";

function Mainpage() {
  const location = useLocation();

  // List of routes where the other components should be hidden
  const hideComponentsPaths = ['/timetable', '/index','/attendance','/activity','/home','/mark','/register','/add']; // Add more paths here

  return (
    <div className="maindiv">
      {/* Only show components if the current path is not in hideComponentsPaths */}
      {!hideComponentsPaths.includes(location.pathname) && (
        <>
          <Homepage/>

     
        </>
      )}
     
      <Routes>
        <Route path="/register"  element={<Register/>}/>
 <Route path="/add" element={<AddSectionData/>}/>
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/student" element={<Studentdashboard/>}/></Route>
        <Route path="/index" element={<Landingpage/>}/>
                <Route path="/attendance" element={<Attendance/>}/>
                  <Route path="/activity" element={<Activitydiary/>}/>
  
                  <Route path="/form" element={<AddFacultyForm/>}/>
                  <Route path="/mark" element={<Marking/>}/>
      </Routes>
    </div>
  );
}

export default Mainpage;
