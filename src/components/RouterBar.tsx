// export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import ScheduleForm from './ScheduleForm'; 
import Home from '../HomePage'; 
import Scheduler from '../ManagerDashBoard/Schedules/Scheduler';
// import SchedulerView from './SchedulerView';
import EmployeeManagement from '../ManagerDashBoard/EmployeeManagement';
//import EmployeeList from './EmployeeList'; // Import EmployeeList
// import DisplayEmployeeList from './DisplayEmployeeList';

import '../styles/RouterBarStyle.css';


function RouterBar() {
  return (
    <Router>
      <div className="nav-bar-container">
        <Link to="/">Home</Link>
        <Link to="/Schedules/Scheduler">Scheduler View</Link>
        {/* <Link to="/ScheduleForm">Scheduler Form</Link> */}
        <Link to="/ManagerDashBoard/EmployeeManagement">Employee Management</Link>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/ScheduleForm" element={<ScheduleForm />} /> */}
        <Route path="/ManagerDashBoard/EmployeeManagement" element={<EmployeeManagement />} />
        <Route path="/Schedules/Scheduler" element={<Scheduler />} />
        {/* <Route path="/DisplayEmployeeList" element={<DisplayEmployeeList />} />  */}
      </Routes>
    </Router>

  );
}

export default RouterBar;
