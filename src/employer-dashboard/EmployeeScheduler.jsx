import React, { useState, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../userAuth/firebase";
import CustomEvent from "./CustomEvent";
import AutoGenerateSchedule from "./AutoGenerateSchedule";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const EmployeeScheduler = ({ employees, isKitchen }) => {
  // const [employees, setEmployees] = useState(initialEmployees);
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState({
    start: new Date(),
    end: new Date(),
  });
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [employeeRemainingHours, setEmployeeRemainingHours] = useState({});

  useEffect(() => {
    fetchSchedule();
    initializeEmployeeHours();
  }, [employees]);

  const fetchSchedule = async () => {
    const scheduleCollection = collection(db, "schedules");
    const scheduleSnapshot = await getDocs(scheduleCollection);
    const scheduleList = scheduleSnapshot.docs.map((doc) => {
      const data = doc.data();
      const employee = employees.find((emp) => emp.id === data.employeeId);

      return {
        id: doc.id,
        ...doc.data(),
        start: doc.data().start.toDate(),
        end: doc.data().end.toDate(),
        position: employee?.employee_position || "Unknown",
      };
    });

    // Filter events based on schedule type
    const filteredEvents = scheduleList.filter(
      (event) => event.scheduleType === (isKitchen ? "Kitchen" : "Dining")
    );
    setEvents(filteredEvents);
  };

  const initializeEmployeeHours = () => {
    const initialHours = employees.reduce((acc, employee) => {
      acc[employee.id] = getMaxHours(employee.employee_type);
      return acc;
    }, {});
    setEmployeeRemainingHours(initialHours);
  };

  const getMaxHours = (employeeType) => {
    return employeeType === "Full-Time" ? 40 : 24;
  };

  const eventStyleGetter = (event) => {
    let backgroundColor;

    switch (event.position) {
      case "Server":
        backgroundColor = "Red"; // Color for Server
        break;
      case "Busser":
        backgroundColor = "green"; // Color for Busser
        break;
      case "Cook":
        backgroundColor = "orange"; // Color for Cook
        break;
      case "Host":
        backgroundColor = "purple"; // Color for Host
        break;
      default:
        backgroundColor = "gray"; // Fallback color
    }

    return {
      style: {
        backgroundColor,
        color: "white", // Optional text color for better contrast
      },
    };
  };

  // function for worked hour
  const getEmployeeHours = (employeeType) => {
    return employeeType === "Full-Time" ? "40hr" : "24hr";
  };

  const addSchedule = async (
    title,
    start,
    end,
    employeeId,
    description,
    isKitchen,
    // batchId
  ) => {
    try {
      // Check if the employee is eligible for scheduling based on the type of schedule
      const employee = employees.find((emp) => emp.id === employeeId);

      if (isKitchen && employee?.employee_system !== "Kitchen Side") {
        alert("Only cooks can be scheduled in the kitchen.");
        return;
      } else if (!isKitchen && employee?.employee_system !== "Dining Side") {
        alert(
          "Only Hosts, Servers, and Bussers can be scheduled in the dining area."
        );
        return;
      }

      // Proceed to add the schedule to firestore if validation passes
      const docRef = await addDoc(collection(db, "schedules"), {
        title,
        start,
        end,
        employeeId,
        description,
        scheduleType: isKitchen ? "Kitchen Side" : "Dining Side",
        // batchId,
      });

      console.log("Document written with ID:", docRef.id);

      // Return the newly created event object
      return {
        id: docRef.id,
        title,
        start,
        end,
        employeeId,
        description,
        position: employee?.employee_position,
        scheduleType: isKitchen ? "Kitchen Side" : "Dining Side",
        // batchId,
      };
    } catch (e) {
      console.error("Error adding document:", e);
      alert("Failed to add schedule. Please try again.");
    }
  };

  // EmployeeScheduler.jsx
  const updateSchedule = async (eventId, updatedEvent) => {
    try {
      await updateDoc(doc(db, "schedules", eventId), {
        ...updatedEvent,
        scheduleType: isKitchen ? "Kitchen" : "Dining",
      });
      console.log("Document updated with ID:", eventId);
    } catch (e) {
      console.error("Error updating document:", e);
    }
  };

  const updateEmployeeHours = useCallback((employeeId, hoursWorked) => {
    setEmployeeRemainingHours((prevHours) => ({
      ...prevHours,
      [employeeId]: Math.max(0, (prevHours[employeeId] || 0) - hoursWorked),
    }));
  }, []);

  const hasOverlappingSchedule = (employeeId, start, end, excludeEventId) => {
    return events.some(
      (event) =>
        event.employeeId === employeeId &&
        event.id !== excludeEventId &&
        ((start >= event.start && start < event.end) ||
          (end > event.start && end <= event.end) ||
          (start <= event.start && end >= event.end))
    );
  };

  const handleEventDrop = useCallback(
    async ({ event, start, end }) => {
      const newStart = new Date(start);
      const newEnd = new Date(end);
      newStart.setHours(event.start.getHours(), event.start.getMinutes());
      newEnd.setHours(event.end.getHours(), event.end.getMinutes());
      const updatedEvent = { ...event, start: newStart, end: newEnd };
      await updateSchedule(event.id, updatedEvent);
      setEvents((prev) =>
        prev.map((ev) => (ev.id === event.id ? updatedEvent : ev))
      );
    },
    [setEvents]
  );

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      if (!selectedEmployeeId) {
        alert("Please select an employee first.");
        return;
      }
      if (hasOverlappingSchedule(selectedEmployeeId, start, end, null)) {
        alert(
          "This schedule overlaps with an existing schedule for this employee."
        );
        return;
      }
      setSelectedSlot({ start, end });
      setOpenDialog(true);
      setStartTime(moment(start).format("HH:mm"));
      setEndTime(moment(end).format("HH:mm"));
    },
    [selectedEmployeeId]
  );

  const handleDialogClose = () => {
    setOpenDialog(false);
    setStartTime("");
    setEndTime("");
    setSelectedEventId(null);
    setEventDescription("");
  };

  const handleScheduleSet = async () => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const newEventStart = new Date(selectedSlot.start);
    newEventStart.setHours(startHour, startMinute);
    const newEventEnd = new Date(selectedSlot.start);
    newEventEnd.setHours(endHour, endMinute);

    if (newEventEnd <= newEventStart) {
        alert("End time must be after start time.");
        return;
    }
    if (!selectedEmployeeId) {
        alert("No employee selected.");
        return;
    }
    if (
        hasOverlappingSchedule(
            selectedEmployeeId,
            newEventStart,
            newEventEnd,
            selectedEventId
        )
    ) {
        alert(
            "This schedule overlaps with an existing schedule for this employee."
        );
        return;
    }

    const employee = employees.find((emp) => emp.id === selectedEmployeeId);
    if (!employee) {
        alert("Selected employee not found.");
        return;
    }

    const title = `${employee.employee_fname} ${employee.employee_lname}`;

    // Create a new event including position
    const newEvent = {
      id: "", // This will be set after adding to Firestore
      title,
      start: newEventStart,
      end: newEventEnd,
      employeeId: employee.id,
      description: eventDescription,
      position: employee.employee_position, // Include position here
    };

    if (selectedEventId) {
      // Update an existing schedule
      await updateSchedule(selectedEventId, {
        ...newEvent,
        id: selectedEventId,
        scheduleType,
      });
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === selectedEventId ? { ...newEvent, id: selectedEventId } : ev
        )
      );
    } else {
      // Adding a new schedule
      const addedEvent = await addSchedule(
        newEvent.title,
        newEvent.start,
        newEvent.end,
        newEvent.employeeId,
        newEvent.description,
        isKitchen
      );

      // Add the event with its position to state
      if (addedEvent) {
        setEvents((prev) => [...prev, addedEvent]);
      }
    }

    handleDialogClose();
};

  const handleDeleteSchedule = async () => {
    if (!selectedEventId) return;
    await deleteDoc(doc(db, "schedules", selectedEventId));
    setEvents((prev) => prev.filter((ev) => ev.id !== selectedEventId));
    handleDialogClose();
  };
  // useEffect(() => {
  //   console.log("Events to be displayed:", events);
  // }, [events]); // This will log whenever events change

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Paper
        elevation={3}
        sx={{
          backgroundColor: "LightSlateGrey",
          width: 200,
          height: "100%",
          padding: 1,
          marginTop: "5px",
          marginRight: "5px",
          marginTop: "5px",
          marginRight: "5px",
        }}
      >
        <Typography variant="h6" textAlign="center">
          Employees
        </Typography>
        <List sx={{ display: "flex", flexDirection: "column" }}>
          {employees.map((employee) => (
            <ListItem
              key={employee.id}
              onClick={() => {
                setSelectedEmployeeId(employee.id);
                setSelectedEmployeeName(
                  `${employee.employee_fname} ${employee.employee_lname}`
                );
              }}
              style={{
                cursor: "pointer",
                padding: "1px",
                border:
                  selectedEmployeeId === employee.id
                    ? "2px solid black"
                    : "none",
                borderRadius: "5px",
                backgroundColor:
                  selectedEmployeeId === employee.id
                    ? "#8a2be2"
                    ? "#8a2be2"
                    : "transparent",
                height: "72px",
              }}
            >
              <ListItemText
                primary={`${employee.employee_fname} ${employee.employee_lname}`}
                secondary={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {employee.employee_position}
                    </Typography>
                    <Typography component="span" variant="body2">
                      {employee.remainingHours
                        ? `${employee.remainingHours}hr left`
                        : getEmployeeHours(employee.employee_type)}
                    </Typography>
                  </Box>
                }
                secondaryTypographyProps={{ component: "div" }} 
                sx={{
                  backgroundColor: "#B0C4DE",
                  padding: "9px",
                  borderRadius: "2px",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <DnDCalendar
        localizer={localizer}
        events={events}
        eventPropGetter={eventStyleGetter}
        eventPropGetter={eventStyleGetter}
        components={{
          event: (props) => <CustomEvent {...props} employees={employees} />,
        }}
        onEventDrop={handleEventDrop}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={(event) => {
          setSelectedSlot({ start: event.start, end: event.end });
          setStartTime(moment(event.start).format("HH:mm"));
          setEndTime(moment(event.end).format("HH:mm"));
          setSelectedEventId(event.id);
          setEventDescription(event.description || "");
          setOpenDialog(true);
        }}
        selectable
        resizable={false}
        defaultView="week"
        views={["day", "week"]}
        step={60}
        timeslots={1}
        min={moment().startOf("day").add(7, "hours").toDate()}
        max={moment().startOf("day").add(23, "hours").toDate()}
        max={moment().startOf("day").add(23, "hours").toDate()}
        style={{ flexGrow: 1 }}
        defaultDate={new Date()}
        formats={{
          timeGutterFormat: (date) => moment(date).format("HH:mm"),
          dayFormat: (date) => moment(date).format("ddd DD/MM"),
        }}
      />
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          {selectedEventId
            ? "Update Working Hours"
            : `Set Working Hours for ${selectedEmployeeName}`}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Start Time (HH:mm)"
            type="time"
            fullWidth
            variant="outlined"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <TextField
            margin="dense"
            label="End Time (HH:mm)"
            type="time"
            fullWidth
            variant="outlined"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          {selectedEventId && (
            <Button color="error" onClick={handleDeleteSchedule}>
              Delete
            </Button>
          )}
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleScheduleSet}>
            {selectedEventId ? "Update Schedule" : "Set Schedule"}
          </Button>
        </DialogActions>
      </Dialog>
      <Box>
        <AutoGenerateSchedule
          employees={employees}
          addSchedule={addSchedule}
          hasOverlappingSchedule={hasOverlappingSchedule}
          setEvents={setEvents}
          updateEmployeeHours={updateEmployeeHours}
          // employeeRemainingHours={employeeRemainingHours}
          isKitchen={isKitchen}
        />
      </Box>
    </Box>
  );
};

export default EmployeeScheduler;
