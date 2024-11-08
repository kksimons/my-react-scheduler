import React, { useState, useEffect, useCallback } from "react";
import { EventInteractionArgs } from "react-big-calendar/lib/addons/dragAndDrop";
import {
  Event as CalendarEvent,
  Calendar,
  momentLocalizer,
} from "react-big-calendar";
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

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

interface Employee {
  id: string;
  employee_fname: string;
  employee_lname: string;
  employee_position: string;
}

interface Event extends CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  employeeId: string;
  description?: string;
}

const EmployeeScheduler: React.FC<{ employees: Employee[] }> = ({
  employees,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
    employeeId?: string;
  }>({ start: new Date(), end: new Date() });
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null
  );
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");


  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    const scheduleCollection = collection(db, "schedules");
    const scheduleSnapshot = await getDocs(scheduleCollection);
    const scheduleList = scheduleSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      start: doc.data().start.toDate(),
      end: doc.data().end.toDate(),
    })) as Event[];
    setEvents(scheduleList);
  };

  const addSchedule = async (
    title: string,
    start: Date,
    end: Date,
    employeeId: string,
    description?: string
  ) => {
    try {
      const docRef = await addDoc(collection(db, "schedules"), {
        title,
        start,
        end,
        employeeId,
        description,
      });
      console.log("Document written with ID:", docRef.id);
      return docRef.id;
    } catch (e) {
      console.error("Error adding document:", e);
    }
  };

  const updateSchedule = async (eventId: string, updatedEvent: Event) => {
    try {
      // Create an object with the properties want to update
      const { title, start, end, employeeId, description } = updatedEvent;

      // Update the document in Firestore
      await updateDoc(doc(db, "schedules", eventId), {
        title,
        start,
        end,
        employeeId,
        description,
      });

      console.log("Document updated with ID:", eventId);
    } catch (e) {
      console.error("Error updating document:", e);
    }
  };

  // Check for overlapping schedules
  const hasOverlappingSchedule = (
    employeeId: string,
    start: Date,
    end: Date,
    excludeEventId?: string | null
  ): boolean => {
    return events.some(
      (event) =>
        event.employeeId === employeeId &&
        event.id !== excludeEventId && // Exclude the event being updated
        ((start >= event.start && start < event.end) ||
          (end > event.start && end <= event.end) ||
          (start <= event.start && end >= event.end))
    );
  };

  const handleEventDrop = useCallback(
    async ({ event, start, end }: EventInteractionArgs<Event>) => {
      //Create new start and end dates
      const newStart = new Date(start);
      const newEnd = new Date(end);

      // Maintain original start and end times
      newStart.setHours(event.start.getHours(), event.start.getMinutes());
      newEnd.setHours(event.end.getHours(), event.end.getMinutes());

      const updatedEvent: Event = { ...event, start: newStart, end: newEnd };
      await updateSchedule(event.id, updatedEvent);
      setEvents((prev) =>
        prev.map((ev) => (ev.id === event.id ? updatedEvent : ev))
      );
    },
    [setEvents]
  );

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      if (!selectedEmployeeId) {
        alert("Please select an employee first.");
        return; // Prevent opening dialog if no employee is selected
      }
      

      // Check for overlapping schedules
      if (hasOverlappingSchedule(selectedEmployeeId, start, end, null)) {
        alert(
          "This schedule overlaps with an existing schedule for this employee."
        );
        return; // Prevent opening dialog if there is an overlap
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

    // Validate time
    if (newEventEnd <= newEventStart) {
      alert("End time must be after start time.");
      return;
    }

    
    if (!selectedEmployeeId) {
      alert("No employee selected.");
      return;
    }
    

    // Check for overlapping schedules for the selected employee
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

    const newEvent: Event = {
      id: "", // Temporary ID until saved in Firestore
      title,
      start: newEventStart,
      end: newEventEnd,
      employeeId: employee.id,
      description: eventDescription,
    };

    if (selectedEventId) {
      await updateSchedule(selectedEventId, {
        ...newEvent,
        id: selectedEventId
      });
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === selectedEventId ? { ...newEvent, id: selectedEventId } : ev
        )
      );
    } else {
      const docRefId = await addSchedule(
        newEvent.title,
        newEvent.start,
        newEvent.end,
        newEvent.employeeId,
        newEvent.description
      );
      newEvent.id = docRefId!;
      setEvents((prev) => [...prev, newEvent]);
    }

    handleDialogClose();
  };

  const handleDeleteSchedule = async () => {
    if (!selectedEventId) return;
    await deleteDoc(doc(db, "schedules", selectedEventId));
    setEvents((prev) => prev.filter((ev) => ev.id !== selectedEventId));
    handleDialogClose();
  };

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Paper
        elevation={3}
        sx={{
          backgroundColor: "#8a2be2",
          width: 200,
          padding: 1,
          marginTop: "5px",
        }}
      >
        <Typography variant="h6" textAlign="center">
          Employees
        </Typography>
        <List sx={{display: "flex", flexDirection: "column"}}>
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
                  selectedEmployeeId === employee.id ? "2px solid black" : "none",
                  borderRadius: "3px",
                  backgroundColor: selectedEmployeeId === employee.id ? "#8a2be2" : "transparent",
                  height: "72px",
              }}
            >
              <ListItemText
                primary={`${employee.employee_fname} ${employee.employee_lname}`}
                secondary={employee.employee_position}
                sx={{
                  backgroundColor: "#9b30ff",
                  padding: "5px",
                  borderRadius: "4px",
                  // marginBottom: "4px",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <DnDCalendar
        localizer={localizer}
        events={events}
        components={{
          event: (props: any) => <CustomEvent {...props} employees={employees} />,
        }}
        onEventDrop={handleEventDrop}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={(event: Event) => {
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
        max={moment().startOf("day").add(20, "hours").toDate()}
        style={{ flexGrow: 1 }}
        defaultDate={new Date()}
        formats={{
          timeGutterFormat: (date: Date) => moment(date).format("HH:mm"),
          dayFormat: (date: Date) => moment(date).format("ddd DD/MM"),
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
            onChange={(e) => setStartTime(e.target.value)} // Update start time
          />
          <TextField
            margin="dense"
            label="End Time (HH:mm)"
            type="time"
            fullWidth
            variant="outlined"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)} // Update end time
          />
          <TextField
            margin="dense"
            label="Description" // Field for description
            type="text"
            fullWidth
            variant="outlined"
            value={eventDescription} // Bind to state variable
            onChange={(e) => setEventDescription(e.target.value)} // Update description state
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
    </Box>
  );
};

export default EmployeeScheduler;
