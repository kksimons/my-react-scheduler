
import React from 'react';
import DescriptionIcon from '@mui/icons-material/Description';
import ContactsIcon from '@mui/icons-material/Contacts';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

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

export default NAVIGATION;
