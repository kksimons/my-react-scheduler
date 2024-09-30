import { useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import ServersSchedule from "./schedules/ServersSchedule";
import BussersSchedule from "./schedules/BussersSchedule";
import CooksSchedule from "./schedules/CooksSchedule";

export default function App() {
  const [value, setValue] = useState(0); // Default to Servers Schedule, now 0

  return (
    <div>
      {/* Header */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={(e, newValue) => setValue(newValue)} aria-label="schedule tabs">
          <Tab label="Servers Schedule" />
          <Tab label="Bussers Schedule" />
          <Tab label="Cooks Schedule" />
        </Tabs>
      </Box>

      {/* Tabs Content */}
      {value === 0 && (
        <Box p={3}>
          <Typography variant="h5">Servers Schedule</Typography>
          <ServersSchedule />
        </Box>
      )}
      {value === 1 && (
        <Box p={3}>
          <Typography variant="h5">Bussers Schedule</Typography>
          <BussersSchedule />
        </Box>
      )}
      {value === 2 && (
        <Box p={3}>
          <Typography variant="h5">Cooks Schedule</Typography>
          <CooksSchedule />
        </Box>
      )}
    </div>
  );
}
