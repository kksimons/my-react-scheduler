// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import ScheduleForm from './ScheduleForm'; // Scheduler view
// import Home from './Home'; // Home page
// import SchedulerView from './SchedulerView';
// import EmployeeManagement from './EmployeeManagement';

// function App() {
//   return (
//     <Router>
//       <div className="topnav">
//         <Link to="/">Home</Link>
//         <Link to="/SchedulerView">Scheduler View</Link>
//         <Link to="/ScheduleForm">Scheduler Form</Link>
//         <Link to="/EmployeeManagement">Employee Management</Link>
//       </div>

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/ScheduleForm" element={<ScheduleForm />} /> {/* Scheduler View */}
//         <Route path="/EmployeeManagement" element={<EmployeeManagement />} /> {/* Employee Form */}
//         <Route path="/SchedulerView" element={<SchedulerView />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ScheduleForm from './ScheduleForm'; 
import Home from './Home'; 
import SchedulerView from './SchedulerView';
import EmployeeManagement from './EmployeeManagement';
//import EmployeeList from './EmployeeList'; // Import EmployeeList
import DisplayEmployeeList from './DisplayEmployeeList';

function App() {
  return (
    <Router>
      <div className="topnav">
        <Link to="/">Home</Link>
        <Link to="/SchedulerView">Scheduler View</Link>
        <Link to="/ScheduleForm">Scheduler Form</Link>
        <Link to="/EmployeeManagement">Employee Management</Link>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ScheduleForm" element={<ScheduleForm />} />
        <Route path="/EmployeeManagement" element={<EmployeeManagement />} />
        <Route path="/SchedulerView" element={<SchedulerView />} />
        <Route path="/DisplayEmployeeList" element={<DisplayEmployeeList />} /> 
      </Routes>
    </Router>
  );
}

export default App;
