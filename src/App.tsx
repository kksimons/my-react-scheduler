import { useState } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import Header from "./components/Header";

// Possible colors for an event to get assigned when it comes in
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

export default function App() {
  const [value, setValue] = useState(0); // Keep track of tab state in the header
  const [events, setEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState<FormData>({
    num_employees: "",
    shifts_per_day: "",
    total_days: "",
    employee_types: [],
  });

  // Or use underscore to show it's intentionally unused
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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

  // Define the type for the form submission handler
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
    console.log(data);

    const newEvents: Event[] = [];

    data.schedules.forEach((dayObj: any, outerIndex: number) => {
      Object.keys(dayObj).forEach((dayKey, dayIndex) => {
        const shifts = dayObj[dayKey];
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + dayIndex);

        shifts.forEach((item: any) => {
          const shiftStartHour = item.shift === 0 ? 6 : 12;
          const shiftEndHour = item.shift === 0 ? 12 : 17;
          const shiftStart = new Date(currentDate);
          shiftStart.setHours(shiftStartHour, 0, 0, 0);
          const shiftEnd = new Date(currentDate);
          shiftEnd.setHours(shiftEndHour, 0, 0, 0);

          // Let's make sure colors are unique so we can distinguish them on the calendar
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
      {/* Header*/}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="navigation tabs"
        >
          <Tab label="Home" />
          <Tab label="New Employee" />
          <Tab label="New Schedule" />
        </Tabs>
      </Box>

      {/* Header tabs */}
      <Header value={value} index={0}>
        <Typography variant="h5" component="h3">
          Welcome to PowerShift
        </Typography>
      </Header>

      <Header value={value} index={1}>
        <Typography variant="h5" component="h3">
          Add New Employee Form Here
        </Typography>
      </Header>

      {/* calendar for scheduling lives here */}
      <Header value={value} index={2}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <form
            onSubmit={handleSubmit}
            style={{ marginRight: "20px", width: "100%", maxWidth: "200px" }} // Reduced max width for a smaller form
          >
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

            {formData.num_employees && parseInt(formData.num_employees) > 0 && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Assign Employee Types
                </Typography>
                {formData.employee_types.map((type, index) => (
                  <Select
                    key={index}
                    label={`Employee ${index + 1}`}
                    value={type}
                    onChange={(e) =>
                      handleEmployeeTypeChange(index, e.target.value as string)
                    }
                    fullWidth
                    variant="outlined"
                  >
                    <MenuItem value="full_time">Full Time</MenuItem>
                    <MenuItem value="part_time">Part Time</MenuItem>
                  </Select>
                ))}
              </>
            )}

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

          {/* calendar begins */}
          <Scheduler
            events={events}
            disableViewer
            onEventClick={() => {
              console.log("onEventClick");
            }}
            week={{
              weekDays: [0, 1, 2, 3, 4, 5, 6],
              weekStartOn: 1,
              startHour: 5,
              endHour: 24,
              step: 60,
            }}
          />
        </div>
      </Header>
    </div>
  );
}

//for reference
// export interface WeekProps {
//     weekDays: WeekDays[];
//     weekStartOn: WeekDays;
//     startHour: DayHours;
//     endHour: DayHours;
//     step: number;
//     cellRenderer?(props: CellRenderedProps): JSX.Element;
//     headRenderer?(day: Date): JSX.Element;
//     hourRenderer?(hour: string): JSX.Element;
//     navigation?: boolean;
//     disableGoToDay?: boolean;
// }
