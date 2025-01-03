import React from 'react';
import './Mainpage.css';
import Landingpage from './Landingpage/Landingpage';
import { Routes, Route, useLocation } from "react-router-dom";
import Timetable from './Pages/Timetable/Timetable.jsx';
import Attendance from './Pages/Attendance/Attendance'
import Activitydiary from './Pages/Activitydiary/Activitydiary';
import Homepage from "./Homepage/Homepage";
import Marking from "./Pages/Marking/Marking.jsx";



function Mainpage() {
  const location = useLocation();

  // List of routes where the other components should be hidden
  const hideComponentsPaths = ['/timetable', '/index','/attendance','/activity','/home','/mark']; // Add more paths here

  return (
    <div className="maindiv">
      {/* Only show components if the current path is not in hideComponentsPaths */}
      {!hideComponentsPaths.includes(location.pathname) && (
        <>
          <Homepage/>

     
        </>
      )}
     
      <Routes>
        <Route path="/timetable" element={<Timetable />} />
        
        <Route path="/index" element={<Landingpage/>}/>
                <Route path="/attendance" element={<Attendance/>}/>
                  <Route path="/activity" element={<Activitydiary/>}/>

                  
                  <Route path="/mark" element={<Marking/>}/>
      </Routes>
    </div>
  );
}

export default Mainpage;