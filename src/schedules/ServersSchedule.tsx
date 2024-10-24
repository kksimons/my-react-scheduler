import { useState, useEffect } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../userAuth/firebase";
import { useUserStore } from "../stores/useUserStore";
import { Timestamp } from "firebase/firestore";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaTableColumns } from "react-icons/fa6";
import { MdTableRows } from "react-icons/md";

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
  admin_id: string;
  editable: boolean;
}

// for saveScheduleToFirestore
interface ScheduleData {
  events: Event[];
  employeeColors: { [key: string]: string };
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
    [key: string]: string;
  }>({});
  const [servers, setServers] = useState<any[]>([]); // State to hold server employees
  const { role } = useUserStore(); // Zustand store to get user role

  const [shiftTimes, setShiftTimes] = useState({
    shift1: { start: "09:00", end: "13:00" },
    shift2: { start: "13:00", end: "17:00" },
    shift3: { start: "17:00", end: "21:00" },
  });

  const { shift1, shift2, shift3 } = shiftTimes;

  // Fetch server data from Firestore
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const serversQuery = query(
          collection(db, "employees"),
          where("employeeType", "==", "server") // Ensure it matches the Firestore field
        );
        const querySnapshot = await getDocs(serversQuery);

        const fetchedServers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setServers(fetchedServers);

        setFormData((prev) => ({
          ...prev,
          num_employees: fetchedServers.length.toString(),
          employee_types: fetchedServers.map(() => "full_time"),
        }));

        // Fetch the last saved schedule when the page loads
        await fetchLastScheduleFromFirestore();
      } catch (error) {
        console.error("Error fetching servers from Firestore:", error);
      }
    };

    fetchServers(); // Call the function to fetch servers from Firestore
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
        employee_types: new Array(numEmployees).fill("full_time"), // Defaulting all employees to full-time
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

  // Save schedule to "serverSchedules" instead of "employerSchedule"
  const saveScheduleToFirestore = async (scheduleData: ScheduleData) => {
    try {
      // Check if events exist
      if (!scheduleData.events || !Array.isArray(scheduleData.events)) {
        throw new Error("Invalid event data. No events to save.");
      }

      const scheduleCollectionRef = collection(db, "serverSchedules");

      // Convert event start and end to Firestore Timestamps
      const eventsWithTimestamp = scheduleData.events.map((event) => ({
        ...event,
        start: Timestamp.fromDate(new Date(event.start)),
        end: Timestamp.fromDate(new Date(event.end)),
      }));

      // Save schedule to Firestore
      const docRef = await addDoc(scheduleCollectionRef, {
        events: eventsWithTimestamp,
        employeeColors: scheduleData.employeeColors,
        timestamp: Timestamp.now(),
      });

      console.log(`Schedule saved for servers:`, docRef.id);
    } catch (error) {
      console.error("Error saving schedule to Firestore:", error);
    }
  };

  // Fetch the last generated schedule from "serverSchedules"
  const fetchLastScheduleFromFirestore = async () => {
    try {
      const scheduleQuery = query(
        collection(db, "serverSchedules"),
        orderBy("timestamp", "desc"),
        limit(1) // Fetch only the latest schedule
      );

      const querySnapshot = await getDocs(scheduleQuery);

      if (!querySnapshot.empty) {
        const lastSchedule = querySnapshot.docs[0].data();

        // Ensure the fetched events are in the right format
        const fetchedEvents = lastSchedule.events.map((event: any) => {
          // Convert Firestore Timestamp to Date object
          const startDate = event.start.toDate();
          const endDate = event.end.toDate();

          return {
            ...event,
            start: startDate,
            end: endDate,
          };
        });

        // Update state with fetched events and employeeColors
        setEvents(fetchedEvents);
        setEmployeeColors(lastSchedule.employeeColors || {}); // Default to empty object if undefined

        console.log("Fetched last schedule from Firestore:", lastSchedule);
      } else {
        console.log("No previous schedule found.");
      }
    } catch (error) {
      console.error("Error fetching last schedule from Firestore:", error);
    }
  };

  useEffect(() => {
    // Log to check if events and employeeColors are updated correctly
    console.log("Events state updated:", events);
    console.log("Employee Colors state updated:", employeeColors);
  }, [events, employeeColors]);

  // Define the form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      num_employees: servers.length, // Number of servers
      shifts_per_day: parseInt(formData.shifts_per_day, 10),
      total_days: parseInt(formData.total_days, 10),
      employee_types: servers.map((employee) => employee.workType), // Employee types
    };

    try {
      const response = await fetch("http://localhost:80/api/v1/scheduler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.schedules || !Array.isArray(data.schedules)) {
        throw new Error("No schedules found in API response.");
      }

      const newEvents: Event[] = [];
      const newEmployeeColors: { [key: string]: string } = {}; // Temporary object to store colors

      // Map the employee index from the API to the actual userId from Firestore
      const employeeIdMapping = servers.reduce(
        (acc, server, index) => ({ ...acc, [index]: server.id }),
        {}
      );

      // Generate events with shift times included
      data.schedules.forEach((dayObj: any, outerIndex: number) => {
        Object.keys(dayObj).forEach((dayKey, dayIndex) => {
          const shifts = dayObj[dayKey];
          const currentDate = new Date();
          currentDate.setDate(currentDate.getDate() + dayIndex);

          shifts.forEach((item: any, shiftIndex: number) => {
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
            shiftStart.setHours(
              parseInt(startHour),
              parseInt(startMinute),
              0,
              0
            );

            const shiftEnd = new Date(currentDate);
            const [endHour, endMinute] = shiftEndHour.split(":");
            shiftEnd.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

            // Ensure the event ID is unique by including a combination of day, shift, employee, and a unique shiftIndex or timestamp
            const employeeId = employeeIdMapping[item.employee];
            const uniqueEventId = `day${outerIndex + 1}-shift${
              item.shift
            }-emp${employeeId}-${shiftStart.getTime()}-${shiftIndex}`;

            // Assign a color to the employee if not already assigned
            if (!newEmployeeColors[employeeId]) {
              newEmployeeColors[employeeId] = generateRandomColor(); // Use a random color generator
            }

            newEvents.push({
              event_id: uniqueEventId, // Ensure event_id is unique
              title: `Employee ${employeeId} Shift ${item.shift}`,
              start: shiftStart,
              end: shiftEnd,
              color: newEmployeeColors[employeeId], // Use dynamic color
              admin_id: employeeId,
              editable: true,
            });
          });
        });
      });

      // Set events and colors after the schedule is generated
      setEvents(newEvents);
      setEmployeeColors(newEmployeeColors);

      // Save the generated schedule to Firestore
      await saveScheduleToFirestore({
        events: newEvents,
        employeeColors: newEmployeeColors,
      });

      setEvents(newEvents);
      setEmployeeColors(newEmployeeColors);
      handleCloseDialog(); // Close the modal after submission
    } catch (error) {
      console.error("Error generating or saving schedule:", error);
    }
  };

  // PDF export function
  const exportScheduleToPDF = async () => {
    const scheduleElement = document.getElementById("schedule-container");

    if (!scheduleElement) {
      console.error("Schedule element not found!");
      return;
    }

    const canvas = await html2canvas(scheduleElement);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgWidth = 190;
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("Servers_Schedule.pdf");
  };

  // putting the new stuff here, can clean up later
  // -------------------------------------------------- //
  const [layout, setLayout] = useState("row"); // state for switching between columns and rows (row default)
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Group events by employee
  const groupEventsByEmployee = () => {
    const grouped: { [key: string]: Event[] } = {};
    events.forEach((event) => {
      if (!grouped[event.admin_id]) {
        grouped[event.admin_id] = [];
      }
      grouped[event.admin_id].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByEmployee();

  // Open the modal dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Close the modal dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Modal control state
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div>
      {/* Anything that is universal to both calendars should go here, before the toggle layout button */}
      {role === "employer" && (
        <>
          {/* Generate Schedule button to open the modal */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            style={{ marginTop: "20px" }}
          >
            Generate Schedule
          </Button>

          {/* Modal with the form */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Generate Schedule</DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
                >
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
                <DialogActions>
                  <Button onClick={handleCloseDialog} color="secondary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    Generate
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Toggle Layout Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <ToggleButtonGroup
          value={layout}
          exclusive
          onChange={(_, newLayout) => setLayout(newLayout)}
          aria-label="layout toggle"
        >
          <ToggleButton value="row" aria-label="row view">
            <MdTableRows size={24} />
          </ToggleButton>
          <ToggleButton value="column" aria-label="column view">
            <FaTableColumns size={24} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Column layout - our previous schedule look */}
      {layout === "column" && (
        <>
          {/* Employee Cards */}
          <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
            {servers.map((employee) => (
              <Paper
                key={employee.id}
                elevation={3}
                sx={{
                  padding: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "300px",
                  backgroundColor: employeeColors[employee.id] || "#FFFFFF", // Use white by default, color after schedule generation
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
                    {employee.employeeType.charAt(0).toUpperCase() +
                      employee.employeeType.slice(1)}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>

          {/* Visual Schedule */}
          <div id="schedule-container">
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

          <Button
            variant="contained"
            color="secondary"
            onClick={exportScheduleToPDF}
            style={{ marginTop: "20px" }}
          >
            Export Schedule as PDF
          </Button>
        </>
      )}

      {/* Row layout placeholder */}
      {layout === "row" && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Employee Shift Schedule (Row Layout)
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                {daysOfWeek.map((day) => (
                  <TableCell key={day}>{day}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {servers.map((employee) => (
                <TableRow key={employee.id}>
                  {/* Employee Avatar and Name */}
                  <TableCell>
                    <Paper
                      elevation={3}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        padding: 2,
                        backgroundColor:
                          employeeColors[employee.id] || "#FFFFFF",
                      }}
                    >
                      <Avatar
                        src={employee.profilePic}
                        alt={employee.name}
                        sx={{ width: 56, height: 56 }}
                      />
                      <Typography>{employee.name}</Typography>
                    </Paper>
                  </TableCell>

                  {/* Display Shift Data for Each Day */}
                  {daysOfWeek.map((day, index) => {
                    const dayEvents = groupedEvents[employee.id]?.filter(
                      (event) => {
                        const eventDay = new Date(event.start).getDay(); // Get the day of the event
                        return eventDay === index + 1; // Adjust index to match Monday = 1, Sunday = 7
                      }
                    );

                    return (
                      <TableCell key={day}>
                        {dayEvents?.map((event) => (
                          <Typography key={event.event_id}>
                            Shift {event.title.split(" ")[3]}:{" "}
                            {new Date(event.start).toLocaleTimeString()} -{" "}
                            {new Date(event.end).toLocaleTimeString()}
                          </Typography>
                        )) || <Typography>No Shift</Typography>}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </div>
  );
}
