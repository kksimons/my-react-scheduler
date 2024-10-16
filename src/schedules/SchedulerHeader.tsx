// src/schedules/SchedulerHeader.tsx

import React from 'react';
import { Button, Select, MenuItem, FormControl, InputLabel, Box, SelectChangeEvent } from '@mui/material';
import { ViewType } from 'react-big-scheduler-stch';

interface SchedulerHeaderProps {
  onViewChange?: (viewType: ViewType) => void;
  currentView?: ViewType;
  onPrevClick?: () => void;
  onNextClick?: () => void;
}

const SchedulerHeader: React.FC<SchedulerHeaderProps> = ({
  onViewChange,
  currentView,
  onPrevClick,
  onNextClick,
}) => {
  const handleViewChange = (event: SelectChangeEvent<ViewType>) => {
    if (onViewChange) {
      onViewChange(event.target.value as ViewType);
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      {/* Navigation Buttons */}
      <Box>
        <Button
          variant="contained"
          color="primary"
          style={{ marginRight: '10px' }}
          onClick={onPrevClick}
        >
          Previous
        </Button>
        <Button variant="contained" color="primary" onClick={onNextClick}>
          Next
        </Button>
      </Box>

      {/* View Selector */}
      <FormControl variant="outlined" size="small">
        <InputLabel>View</InputLabel>
        <Select
          value={currentView || ViewType.Week}
          onChange={handleViewChange}
          label="View"
        >
          <MenuItem value={ViewType.Day}>Day</MenuItem>
          <MenuItem value={ViewType.Week}>Week</MenuItem>
          <MenuItem value={ViewType.Month}>Month</MenuItem>
          {/* Add more views if needed */}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SchedulerHeader;
