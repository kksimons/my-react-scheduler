
import React, { useEffect, useState } from 'react';
import DescriptionIcon from '@mui/icons-material/Description';
import ContactsIcon from '@mui/icons-material/Contacts';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmployeeScheduler from './EmployeeScheduler';
import AddEmployee from './AddEmployee';
import EmployeeList from './AllEmployeeList';
import EmployeeManagement from './EmployeeManagement';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../userAuth/firebase';
import { AppProvider, DashboardLayout } from '@toolpad/core';
import theme from '../theme/theme';
import { ThemeProvider } from '@emotion/react';
import logo from "../assets/logo.png";


//This is only for navigation side bar title and icons, it does not have any functionality 
//Please import it in the EmployerDashboardLayout.jsx
const NAVIGATION = [
  {
    kind: 'header',
    title: 'Schedule Management',
  },
  {
    segment: 'schedule',
    title: 'Schedule',
    icon: <CalendarMonthIcon />,
    children: [
      {
        segment: 'diningSchedule',
        title: 'Dining Schedule',
        icon: <FiberManualRecordIcon />,
      },
      {
        segment: 'kitchenSchedule',
        title: 'Kitchen Schedule',
        icon: <FiberManualRecordIcon />,
      },
    ],
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

function EmployerNavigation() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useDemoRouter('/schedules');

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
        switch(subSegment) {
          case 'diningSchedule':
            return <EmployeeScheduler employees={employees.filter(emp => emp.employee_system === 'Dining Side')} isKitchen={false} />
          case 'kitchenSchedule' :
            return <EmployeeScheduler employees={employees.filter(emp => emp.employee_system === 'Kitchen Side')} isKitchen={true} />;
            default:
        }
        // return <EmployeeManagement employees={employees} setEmployees={setEmployees} defaultView="scheduler" />;
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
    <ThemeProvider theme={theme}>
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      branding={{
        logo: <img src={logo} alt="PowerShifts logo" />,
        title: "",
      }}
    >
      <DashboardLayout>
        {renderContent()}
      </DashboardLayout>
    </AppProvider>
    </ThemeProvider>

  );
}

export default EmployerNavigation;
