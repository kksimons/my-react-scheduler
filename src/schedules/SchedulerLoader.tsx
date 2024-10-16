// src/schedules/SchedulerLoader.tsx

import React from 'react';
import { Spin } from 'antd';
import Box from '@mui/material/Box';

const SchedulerLoader: React.FC = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Spin size="large" />
    </Box>
  );
};

export default SchedulerLoader;
