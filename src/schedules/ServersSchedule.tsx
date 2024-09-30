import { useState, useEffect } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Paper,
} from "@mui/material";
import employeesData from "../data/employees.json"; // Importing the employees data for now, we can move off to firebase when it's ready and pull from there

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

export default function ServersSchedule() {
  const [events, setEvents] = useState<Event[]>([]);
  const [step, setStep] = useState(240); // Default step for 3 shifts
  const [formData, setFormData] = useState<FormData>({
    num_employees: "",
    shifts_per_day: "3", // Default to 3 shifts
    total_days: "",
    employee_types: [],
  });
  const [employeeColors, setEmployeeColors] = useState<{
    [key: number]: string;
  }>({}); // Store employee colors dynamically

  // Track shift times in the state
  const [shiftTimes, setShiftTimes] = useState({
    shift1: { start: "09:00", end: "13:00" },
    shift2: { start: "13:00", end: "17:00" },
    shift3: { start: "17:00", end: "21:00" },
  });

  const { shift1, shift2, shift3 } = shiftTimes;

  // Fetch employee data and set the number of employees based on employee type
  useEffect(() => {
    const servers = employeesData.filter(
      (employee) => employee.employee_type === "server"
    );
    setFormData((prev) => ({
      ...prev,
      num_employees: servers.length.toString(),
      employee_types: servers.map(() => "full_time"),
    }));
  }, []);

  // Adjust step and default shift times based on shifts_per_day
  useEffect(() => {
    if (formData.shifts_per_day === "2") {
      setStep(360);
      setShiftTimes({
        shift1: { start: "09:00", end: "15:00" },
        shift2: { start: "15:00", end: "21:00" },
        shift3: { start: "", end: "" }, // Shift 3 not used
      });
    } else if (formData.shifts_per_day === "3") {
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
        employee_types: new Array(numEmployees).fill("full_time"),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Function to generate random colors for employees
  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
    const newEmployeeColors: { [key: number]: string } = {};

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

          // Assign a color to the employee if not already assigned
          if (!newEmployeeColors[item.employee]) {
            newEmployeeColors[item.employee] = generateRandomColor();
          }

          newEvents.push({
            event_id: `day${outerIndex + 1}-shift${item.shift}-emp${
              item.employee
            }`,
            title: `Employee ${item.employee} Shift ${item.shift}`,
            start: shiftStart,
            end: shiftEnd,
            color: newEmployeeColors[item.employee], // Assign employee's color
            admin_id: item.employee,
            editable: true,
          });
        });
      });
    });

    setEvents(newEvents);
    setEmployeeColors(newEmployeeColors); // Assign employee colors dynamically
  };

  return (
    <div>
      {/* Render Employee Cards */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {employeesData
          .filter((employee) => employee.employee_type === "server")
          .map((employee) => (
            <Paper
              key={employee.id}
              elevation={3}
              sx={{
                padding: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "300px",
                backgroundColor: employeeColors[employee.id] || "#FFFFFF", // Color applied after schedule generation
              }}
            >
              <Avatar
                src={employee.profilePic}
                alt={employee.name}
                sx={{ width: 56, height: 56 }}
              />
              <Box>
                <Typography variant="h6">{employee.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {employee.employee_type.charAt(0).toUpperCase() +
                    employee.employee_type.slice(1)}
                </Typography>
              </Box>
            </Paper>
          ))}
      </Box>

      {/* Form for scheduling */}
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", gap: "24px", marginTop: "20px" }}>
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
