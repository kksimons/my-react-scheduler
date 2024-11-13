// DashboardLayoutBasic.js

import * as React from 'react';
import { useState, useEffect } from 'react';
import { extendTheme } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import ContactsIcon from '@mui/icons-material/Contacts';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmployeeScheduler from '../employer-dashboard/EmployeeScheduler';
import AddEmployee from '../employer-dashboard/AddEmployee';
import EmployeeList from '../employer-dashboard/AllEmployeeList';
import EmployeeManagement from '../employer-dashboard/EmployeeManagement';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../userAuth/firebase';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Schedule Management',
  },
  {
    segment: 'schedule',
    title: 'Schedule',
    icon: <CalendarMonthIcon />,
    // children: [
    //   {
    //     segment: 'serversSchedule',
    //     title: 'Server Schedule',
    //     icon: <FiberManualRecordIcon />,
    //   },
    //   {
    //     segment: 'bussersSchedule',
    //     title: 'Busser Schedule',
    //     icon: <FiberManualRecordIcon />,
    //   },
    //   {
    //     segment: 'cooksSchedule',
    //     title: 'Cook Schedule',
    //     icon: <FiberManualRecordIcon />,
    //   },
    // ],
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Employee Management',
  },
  {
    segment: 'employeeManagement',
    title: 'Employee Management',
    icon: <PeopleAltIcon />,
    children: [
      {
        segment: 'addEmployee',
        title: 'Add Employee',
        icon: <PersonAddIcon />,
      },
      {
        segment: 'employeeList',
        title: 'Employee List',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'contactList',
    title: 'Contact List',
    icon: <ContactsIcon />,
  },
];

// Corrected theme object name
const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

function DashboardLayoutBasic(props) {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useDemoRouter('/dashboard');
  const demoWindow = props.window ? props.window() : undefined;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const employeeCollection = collection(db, "employees");
        const employeeSnapshot = await getDocs(employeeCollection);
        const employeeList = employeeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployees(employeeList);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setError("Failed to fetch employees. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const renderContent = () => {
    const [mainSegment, subSegment] = router.pathname.split('/').slice(1);
    
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
  
    switch(mainSegment) {
      case 'schedule':
        return <EmployeeManagement employees={employees} setEmployees={setEmployees} defaultView="scheduler" />;
      case 'employeeManagement':
        switch(subSegment) {
          case 'addEmployee':
            return <EmployeeManagement employees={employees} setEmployees={setEmployees} defaultView="addEmployee" />;
          case 'employeeList':
            return <EmployeeManagement employees={employees} setEmployees={setEmployees} defaultView="list" />;
          default:
            return <EmployeeManagement employees={employees} setEmployees={setEmployees} defaultView="list" />;
        }
      case 'contactList':
        return <div>Contact List</div>;
      default:
        return <EmployeeManagement employees={employees} setEmployees={setEmployees} defaultView="scheduler" />;
    }
  };

  return (
    <AppProvider
      navigation={NAVIGATION}
      // router={router}
      theme={demoTheme} 
      // window={demoWindow}
    >
      <DashboardLayout>
        {renderContent()}
      </DashboardLayout>
    </AppProvider>
  );
}

export default DashboardLayoutBasic;