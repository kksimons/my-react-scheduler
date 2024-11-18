import React, { useEffect, useState } from 'react';
import DescriptionIcon from '@mui/icons-material/Description';
import ContactsIcon from '@mui/icons-material/Contacts';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmployeeScheduler from './EmployeeScheduler';
import EmployeeManagement from './EmployeeManagement';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@userAuth/firebase';
import { AppProvider, DashboardLayout } from '@toolpad/core';
import theme from '@theme/theme';
import { ThemeProvider } from '@emotion/react';
import logo from "@assets/logo.png";
import UserProfile from '@dashboard/components/UserProfile';
import { useAuth } from '@userAuth/contexts/AuthContext'; 

// Navigation Configuration
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
        segment: 'employeeList',
        title: 'Employee List',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'My Profile',
  },
  {
    segment: 'profile',
    title: 'Profile',
    icon: <PersonAddIcon />,
    children: [
      {
        segment: 'myProfile',
        title: 'My Profile',
        icon: <ContactsIcon />,
      },
    ],
  },
];

// Custom Router Hook
function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => ({
    pathname,
    searchParams: new URLSearchParams(),
    navigate: (path) => setPathname(String(path)),
  }), [pathname]);

  return router;
}

// Main Employee Navigation Component
function EmployeeNavigation() {
  const { user } = useAuth(); // Get the current user
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useDemoRouter('/schedule');

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
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError("Failed to fetch employees. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Render Content Based on Route
  const renderContent = () => {
    const [mainSegment, subSegment] = router.pathname.split('/').slice(1);

    if (isLoading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    switch (mainSegment) {
      case 'schedule':
        switch (subSegment) {
          case 'diningSchedule':
            return (
              <EmployeeScheduler
                employees={employees.filter(emp => emp.employee_system === 'Dining Side')}
                isKitchen={false}
              />
            );
          case 'kitchenSchedule':
            return (
              <EmployeeScheduler
                employees={employees.filter(emp => emp.employee_system === 'Kitchen Side')}
                isKitchen={true}
              />
            );
          default:
            return <div>Select a schedule to view</div>;
        }
      case 'employeeManagement':
        switch (subSegment) {
          case 'employeeList':
            return (
              <EmployeeManagement
                employees={employees}
                setEmployees={setEmployees}
                defaultView="list"
              />
            );
          default:
            return <div>Select an employee management option</div>;
        }
      case 'profile':
        switch (subSegment) {
          case 'myProfile':
            return (
              <UserProfile
                employeeId={user?.uid}
                navigate={router.navigate}
              />
            );
          default:
            return <div>Profile Overview</div>;
        }
      default:
        return <div>Welcome to the Employee Dashboard</div>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        branding={{
          logo: <img src={logo} alt="PowerShifts logo" />,
          // Remove the title to prevent extra "PowerShifts" text
          // title: "", // Optionally set to an empty string if needed
        }}
      >
        <DashboardLayout>{renderContent()}</DashboardLayout>
      </AppProvider>
    </ThemeProvider>
  );
}

export default EmployeeNavigation;
