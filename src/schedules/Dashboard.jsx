import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';

import Grid from '@mui/material/Grid2';
import ContactsIcon from '@mui/icons-material/Contacts';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';


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
        segment: 'serversSchedule',
        title: 'Server Schedule',
        icon: <FiberManualRecordIcon />,
      },
      {
        segment: 'bussersSchedule',
        title: 'Busser Schedule',
        icon: <FiberManualRecordIcon />,
      },
      {
        segment: 'cooksSchedule',
        title: 'Cook Schedule',
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

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
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


export function DashboardLayoutBasic(props) {
  const { window } = props;

  const router = useDemoRouter('/dashboard');

  // Remove this const when copying and pasting into your project.
  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>

      </DashboardLayout>
    </AppProvider>
  );
}
export default DashboardLayoutBasic;