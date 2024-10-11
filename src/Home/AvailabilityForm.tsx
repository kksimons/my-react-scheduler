import React from "react";
import { Box, Button, Typography } from "@mui/material";

interface AvailabilityFormProps {
  availability: { [key: string]: string[] };
  handleAvailabilityChange: (day: string, shift: string) => void;
}

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
  availability,
  handleAvailabilityChange,
}) => {
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Availability
      </Typography>
      {days.map((day) => (
        <Box key={day}>
          <Typography variant="subtitle1">{day.toUpperCase()}</Typography>
          {["morning", "afternoon", "evening"].map((shift) => (
            <Button
              key={shift}
              variant={availability[day].includes(shift) ? "contained" : "outlined"}
              onClick={() => handleAvailabilityChange(day, shift)}
              sx={{ mr: 1, mb: 1 }}
            >
              {shift}
            </Button>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default AvailabilityForm;
