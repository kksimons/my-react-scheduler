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
import CustomEvent from "./CustomeEvent";
import AutoGenerateSchedule from "./AutoGenerateSchedule";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const EmployeeScheduler = ({ employees }) => {
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
    }));
    setEvents(scheduleList);
  };

  const addSchedule = async (title, start, end, employeeId, description) => {
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

  const updateSchedule = async (eventId, updatedEvent) => {
    try {
      const { title, start, end, employeeId, description } = updatedEvent;
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
    const newEvent = {
      id: "",
      title,
      start: newEventStart,
      end: newEventEnd,
      employeeId: employee.id,
      description: eventDescription,
    };

    if (selectedEventId) {
      await updateSchedule(selectedEventId, {
        ...newEvent,
        id: selectedEventId,
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
      newEvent.id = docRefId;
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
      <Box
        elevation={3}
        sx={{
          backgroundColor: "white",
          width: 200,
          padding: 1,
          // marginTop: "5px",
          // marginRight: "5px",
          margin: 0,
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
                    ? "#F1EEFF"
                    : "transparent",
                height: "72px",
              }}
            >
              <ListItemText
                primary={`${employee.employee_fname} ${employee.employee_lname}`}
                secondary={employee.employee_position}
                sx={{
                  backgroundColor: "#CCC1FF", //new purple 
                  padding: "9px",
                  borderRadius: "2px",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <DnDCalendar
        localizer={localizer}
        events={events}
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
        max={moment().startOf("day").add(20, "hours").toDate()}
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
      <AutoGenerateSchedule employees={employees} addSchedule={addSchedule} hasOverlappingSchedule={hasOverlappingSchedule} setEvents={setEvents} />
    </Box>
  );
};

export default EmployeeScheduler;
