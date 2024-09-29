import { useState, useEffect } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

// Possible colors for events
const colors = ["#50b500", "#007BFF", "#FFC107", "#900000", "#28a745"];

// Form data types
interface FormData {
  num_employees: string;
  shifts_per_day: string;
  total_days: string;
  employee_types: string[];
}

// Event types
interface Event {
  event_id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  admin_id: number;
  editable: boolean;
}

export default function CooksSchedule() {
  const [events, setEvents] = useState<Event[]>([]);
  const [step, setStep] = useState(240); // Default step for 3 shifts
  const [formData, setFormData] = useState<FormData>({
    num_employees: "",
    shifts_per_day: "3", // Default to 3 shifts
    total_days: "",
    employee_types: [],
  });

  // Track shift times in the state
  const [shiftTimes, setShiftTimes] = useState({
    shift1: { start: "09:00", end: "13:00" }, // Default times for 3 shifts
    shift2: { start: "13:00", end: "17:00" },
    shift3: { start: "17:00", end: "21:00" },
  });

  const { shift1, shift2, shift3 } = shiftTimes;

  // Adjust step and default shift times based on shifts_per_day
  useEffect(() => {
    if (formData.shifts_per_day === "2") {
      // If 2 shifts, set step to 360 minutes and default shift times
      setStep(360);
      setShiftTimes({
        shift1: { start: "09:00", end: "15:00" },
        shift2: { start: "15:00", end: "21:00" },
        shift3: { start: "", end: "" }, // Empty for shift3 since it's not used
      });
    } else if (formData.shifts_per_day === "3") {
      // If 3 shifts, set step to 240 minutes and default shift times
      setStep(240);
      setShiftTimes({
        shift1: { start: "09:00", end: "13:00" },
        shift2: { start: "13:00", end: "17:00" },
        shift3: { start: "17:00", end: "21:00" },
      });
    }
  }, [formData.shifts_per_day]);

  // Update form data based on input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "num_employees") {
      const numEmployees = parseInt(value, 10) || 0;
      setFormData({
        ...formData,
        num_employees: value,
        employee_types: new Array(numEmployees).fill("full_time"), // Default to full_time
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle changes in the employee types so each employee gets an employee_type
  const handleEmployeeTypeChange = (index: number, value: string) => {
    const updatedEmployeeTypes = [...formData.employee_types];
    updatedEmployeeTypes[index] = value;
    setFormData({
      ...formData,
      employee_types: updatedEmployeeTypes,
    });
  };

  // Update shift times in the state
  type ShiftKey = "shift1" | "shift2" | "shift3";
  const handleShiftTimeChange = (
    shift: ShiftKey,
    timeType: string,
    value: string
  ) => {
    setShiftTimes((prevShiftTimes) => ({
      ...prevShiftTimes,
      [shift]: {
        ...prevShiftTimes[shift],
        [timeType]: value,
      },
    }));
  };

  // Define the form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      num_employees: parseInt(formData.num_employees, 10),
      shifts_per_day: parseInt(formData.shifts_per_day, 10),
      total_days: parseInt(formData.total_days, 10),
      employee_types: formData.employee_types,
    };

    const response = await fetch("http://localhost:80/api/v1/scheduler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    const newEvents: Event[] = [];

    // Generate events with shift times included
    data.schedules.forEach((dayObj: any, outerIndex: number) => {
      Object.keys(dayObj).forEach((dayKey, dayIndex) => {
        const shifts = dayObj[dayKey];
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + dayIndex);

        shifts.forEach((item: any) => {
          let shiftStartHour, shiftEndHour;

          if (item.shift === 0) {
            shiftStartHour = shift1.start;
            shiftEndHour = shift1.end;
          } else if (item.shift === 1) {
            shiftStartHour = shift2.start;
            shiftEndHour = shift2.end;
          } else if (item.shift === 2 && formData.shifts_per_day === "3") {
            shiftStartHour = shift3.start;
            shiftEndHour = shift3.end;
          } else {
            return;
          }

          const shiftStart = new Date(currentDate);
          const [startHour, startMinute] = shiftStartHour.split(":");
          shiftStart.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

          const shiftEnd = new Date(currentDate);
          const [endHour, endMinute] = shiftEndHour.split(":");
          shiftEnd.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

          const colorIndex = item.employee % colors.length;

          newEvents.push({
            event_id: `day${outerIndex + 1}-shift${item.shift}-emp${
              item.employee
            }`,
            title: `Employee ${item.employee} Shift ${item.shift}`,
            start: shiftStart,
            end: shiftEnd,
            color: colors[colorIndex],
            admin_id: item.employee,
            editable: true,
          });
        });
      });
    });

    setEvents(newEvents);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", gap: "24px" }}>
          {/* Schedule Settings (Left) */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Schedule Settings
            </Typography>
            <TextField
              label="Number of Employees"
              type="number"
              name="num_employees"
              value={formData.num_employees}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Shifts per Day"
              type="number"
              name="shifts_per_day"
              value={formData.shifts_per_day}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Total Days"
              type="number"
              name="total_days"
              value={formData.total_days}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </Box>

          {/* Assign Employee Types (Middle) */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Assign Employee Types
            </Typography>
            {formData.num_employees &&
              parseInt(formData.num_employees) > 0 && (
                <>
                  {formData.employee_types.map((type, index) => (
                    <Select
                      key={index}
                      label={`Employee ${index + 1}`}
                      value={type}
                      onChange={(e) =>
                        handleEmployeeTypeChange(
                          index,
                          e.target.value as string
                        )
                      }
                      fullWidth
                      variant="outlined"
                      sx={{ marginBottom: "8px" }}
                    >
                      <MenuItem value="full_time">Full Time</MenuItem>
                      <MenuItem value="part_time">Part Time</MenuItem>
                    </Select>
                  ))}
                </>
              )}
          </Box>

          {/* Define Shift Times (Right) */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Define Shift Times
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Box sx={{ display: "flex", gap: "16px" }}>
                <TextField
                  label="Shift 1 Start Time"
                  type="time"
                  value={shift1.start}
                  onChange={(e) =>
                    handleShiftTimeChange("shift1", "start", e.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label="Shift 1 End Time"
                  type="time"
                  value={shift1.end}
                  onChange={(e) =>
                    handleShiftTimeChange("shift1", "end", e.target.value)
                  }
                  fullWidth
                />
              </Box>

              <Box sx={{ display: "flex", gap: "16px" }}>
                <TextField
                  label="Shift 2 Start Time"
                  type="time"
                  value={shift2.start}
                  onChange={(e) =>
                    handleShiftTimeChange("shift2", "start", e.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label="Shift 2 End Time"
                  type="time"
                  value={shift2.end}
                  onChange={(e) =>
                    handleShiftTimeChange("shift2", "end", e.target.value)
                  }
                  fullWidth
                />
              </Box>

              {formData.shifts_per_day === "3" && (
                <Box sx={{ display: "flex", gap: "16px" }}>
                  <TextField
                    label="Shift 3 Start Time"
                    type="time"
                    value={shift3.start}
                    onChange={(e) =>
                      handleShiftTimeChange("shift3", "start", e.target.value)
                    }
                    fullWidth
                  />
                  <TextField
                    label="Shift 3 End Time"
                    type="time"
                    value={shift3.end}
                    onChange={(e) =>
                      handleShiftTimeChange("shift3", "end", e.target.value)
                    }
                    fullWidth
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
          fullWidth
        >
          Generate Schedule
        </Button>
      </form>

      {/* Scheduler for viewing events */}
      <Scheduler
        events={events}
        disableViewer
        onEventClick={() => {
          console.log("onEventClick");
        }}
        week={{
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          weekStartOn: 1,
          startHour: 9,
          endHour: 24,
          step: step, // Dynamic step value based on shifts_per_day
        }}
      />
    </div>
  );
}
