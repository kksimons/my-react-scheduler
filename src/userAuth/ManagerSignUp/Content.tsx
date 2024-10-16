// src/userAuth/components/Content.tsx

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';

//Content Text Writing Starts Here 
const items = [
  {
    icon: <SettingsSuggestRoundedIcon sx={{ color: 'text.secondary', fontSize: 40 }} />,
    title: 'Our Solution Makes Your Life Easier',
    description:
      "PowerShift creates schedules for you based on your team's availability, saving time and making sure shifts are always covered.",
  },
  {
    icon: <ConstructionRoundedIcon sx={{ color: 'text.secondary', fontSize: 40 }} />,
    title: 'Built to Keep Things Running Smoothly',
    description:
      'Whether your team is big or small, PowerShift handles scheduling with ease, so you can focus on running your business.',
  },
  {
    icon: <ThumbUpAltRoundedIcon sx={{ color: 'text.secondary', fontSize: 40 }} />,
    title: 'Employees Manage Their Own Availability',
    description:
      "PowerShift’s intuitive design provides a seamless experience for managers and employees alike, ensuring everyone stays on the same page.",
  },
  {
    icon: <AutoFixHighRoundedIcon sx={{ color: 'text.secondary', fontSize: 40 }} />,
    title: 'User-Friendly Interface',
    description:
      'PowerShift offers smart features that take the hassle out of scheduling, giving you more time to focus on other important tasks.',
  },
];


//Content starts here 
const Content: React.FC = () => {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      {items.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2 }}>
          {item.icon}
          <Box>
            <Typography gutterBottom sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

export default Content;
