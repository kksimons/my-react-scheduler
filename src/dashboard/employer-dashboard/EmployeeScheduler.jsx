
//Resource: 
//ChatGPT

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
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";

import { collection, addDoc, getDocs, getDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@userAuth/firebase";
import AutoGenerateSchedule from "./AutoGenerateSchedule";

//import pdf 
import jsPDF from "jspdf";
import "jspdf-autotable";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const EmployeeScheduler = ({ employees, isKitchen }) => {
  const [events, setEvents] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({
    start: new Date(),
    end: new Date(),
  });
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
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
      return {
        id: doc.id,
        ...data,
        start: data.start.toDate(),
        end: data.end.toDate(),
      };
    });

    // Filter events based on the schedule type
    const filteredEvents = scheduleList.filter(
      (event) =>
        event.scheduleType === (isKitchen ? "Kitchen Side" : "Dining Side")
    );
    setEvents(filteredEvents);
  };

  // const initializeEmployeeHours = () => {
  //   const initialHours = employees.reduce((acc, employee) => {
  //     acc[employee.id] = getMaxHours(employee.employee_type); // Set max hours initially
  //     return acc;
  //   }, {});
  //   setEmployeeRemainingHours(initialHours);
  // };
  const initializeEmployeeHours = async () => {
    const initialHours = {};
    for (const employee of employees) {
      try {
        const employeeDoc = doc(db, "employees", employee.id);
        const employeeSnapshot = await getDoc(employeeDoc);
  
        if (employeeSnapshot.exists()) {
          const employeeData = employeeSnapshot.data();
          initialHours[employee.id] =
            employeeData.remainingHours !== undefined
              ? employeeData.remainingHours
              : getMaxHours(employee.employee_type); // Use saved or default max hours
              console.log("Fetched employee data:", employeeSnapshot.data());

        } else {
          console.warn(`No data found for employee ID: ${employee.id}`);
          initialHours[employee.id] = getMaxHours(employee.employee_type);
        }
      } catch (error) {
        console.error(`Failed to fetch data for employee ID: ${employee.id}`, error);
        
        initialHours[employee.id] = getMaxHours(employee.employee_type); // Fallback
      }
    }
    setEmployeeRemainingHours(initialHours);
  };
  
  

  //Check employee maximum hours based on employee type, if exactly like the data type 
  const getMaxHours = (employeeType) => {
    return employeeType === "Full-Time" ? 40 : 24;
  };

  //Add schedule function with (title, start, end, employeeId, description, isKitchen), if yes, use find to get the first emp with the id 
  //matches the employeeId, if not, alert the user that only cooks can be scheduled in the kitchen 
  // const addSchedule = async (
  //   title,
  //   start,
  //   end,
  //   employeeId,
  //   description,
  //   isKitchen
  // ) => {
  //   try {
  //     const employee = employees.find((emp) => emp.id === employeeId);

  //     if (isKitchen && employee?.employee_system !== "Kitchen Side") {
  //       alert("Only cooks can be scheduled in the kitchen.");
  //       return;
  //     } else if (
  //       !isKitchen &&
  //       employee?.employee_system !== "Dining Side"
  //     ) {
  //       alert(
  //         "Only Hosts, Servers, and Bussers can be scheduled in the dining area."
  //       );
  //       return;
  //     }

  //     const docRef = await addDoc(collection(db, "schedules"), {
  //       title,
  //       start,
  //       end,
  //       employeeId,
  //       description,
  //       scheduleType: isKitchen ? "Kitchen Side" : "Dining Side",
  //     });

  //     const newEvent = {
  //       id: docRef.id,
  //       title,
  //       start,
  //       end,
  //       employeeId,
  //       description,
  //       position: employee?.employee_position || "Unknown",
  //       scheduleType: isKitchen ? "Kitchen Side" : "Dining Side",
  //     };

  //     setEvents((prev) => [...prev, newEvent]);
  //   //   updateRemainingHours(employeeId, start, end);
  //   // } catch (e) {
  //   //   console.error("Error adding schedule:", e);
  //   //   alert("Failed to add schedule. Please try again.");
  //   // }
  //       updateRemainingHours(employeeId, start, end); // Update hours here
  //     } catch (e) {
  //       console.error("Error adding schedule:", e);
  //       alert("Failed to add schedule. Please try again.");
  //     }
  // };

  // const updateRemainingHours = (employeeId, start, end) => {
  //   const shiftHours = (end - start) / (1000 * 60 * 60); // Calculate shift duration in hours
  
  //   setEmployeeRemainingHours((prev) => ({
  //     ...prev,
  //     [employeeId]: Math.max(0, (prev[employeeId] || getMaxHours("Part-Time")) - shiftHours),
  //   }));
  // };

  const addSchedule = async (
    title,
    start,
    end,
    employeeId,
    description,
    isKitchen
  ) => {
    try {
      const employee = employees.find((emp) => emp.id === employeeId);
  
      if (isKitchen && employee?.employee_system !== "Kitchen Side") {
        alert("Only cooks can be scheduled in the kitchen.");
        return;
      } else if (
        !isKitchen &&
        employee?.employee_system !== "Dining Side"
      ) {
        alert(
          "Only Hosts, Servers, and Bussers can be scheduled in the dining area."
        );
        return;
      }
  
      const docRef = await addDoc(collection(db, "schedules"), {
        title,
        start,
        end,
        employeeId,
        description,
        scheduleType: isKitchen ? "Kitchen Side" : "Dining Side",
      });
  
      const newEvent = {
        id: docRef.id,
        title,
        start,
        end,
        employeeId,
        description,
        position: employee?.employee_position || "Unknown",
        scheduleType: isKitchen ? "Kitchen Side" : "Dining Side",
      };
  
      setEvents((prev) => [...prev, newEvent]);
      updateRemainingHours(employeeId, start, end); // Update remaining hours here
    } catch (e) {
      console.error("Error adding schedule:", e);
      alert("Failed to add schedule. Please try again.");
    }
  };
  
  const updateRemainingHours = (employeeId, start, end) => {
    const shiftHours = (end - start) / (1000 * 60 * 60); // Calculate shift duration in hours
  
    setEmployeeRemainingHours((prev) => {
      const newHours = Math.max(
        0,
        (prev[employeeId] || getMaxHours("Part-Time")) - shiftHours
      );
  
      // Save the updated remaining hours to Firestore
      updateEmployeeHoursToDatabase(employeeId, newHours);
  
      return {
        ...prev,
        [employeeId]: newHours,
      };
    });
  };
  
  const updateEmployeeHoursToDatabase = async (employeeId, remainingHours) => {
    try {
      const employeeDoc = doc(db, "employees", employeeId);
      await updateDoc(employeeDoc, { remainingHours });
      console.log(`Updated remaining hours for employee ID: ${employeeId}`);
    } catch (error) {
      console.error(`Failed to update remaining hours for employee ID: ${employeeId}`, error);
    }
  };
  
  

  const hasOverlappingSchedule = (
    employeeId,
    start,
    end,
    excludeEventId
  ) => {
    return events.some(
      (event) =>
        event.employeeId === employeeId &&
        event.id !== excludeEventId &&
        ((start >= event.start && start < event.end) ||
          (end > event.start && end <= event.end) ||
          (start <= event.start && end >= event.end))
    );
  };

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      if (!selectedEmployeeId) {
        alert("Please select an employee first.");
        return;
      }
      setSelectedSlot({ start, end });
      setOpenDialog(true);
      setStartTime(moment(start).format("HH:mm"));
      setEndTime(moment(end).format("HH:mm"));
    },
    [selectedEmployeeId]
  );

  //functoin to handle dialog close, to close the dialog and clear the selected event ID,
  // selected slot, start time, end time, and event description
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedEventId(null); // Clear selected event ID
    setSelectedSlot({ start: new Date(), end: new Date() });
    setStartTime("");
    setEndTime("");
    setEventDescription("");
  };


  // handle schedule set function to set the schedule for the selected employee
  const handleScheduleSet = async () => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const newEventStart = new Date(selectedSlot.start);
    newEventStart.setHours(startHour, startMinute);
    const newEventEnd = new Date(selectedSlot.start);
    newEventEnd.setHours(endHour, endMinute);

    if (!selectedEmployeeId) {
      alert("No employee selected.");
      return;
    }

    const employee = employees.find((emp) => emp.id === selectedEmployeeId);
    if (!employee) {
      alert("Selected employee not found.");
      return;
    }

    const title = `${employee.employee_fname} ${employee.employee_lname}`;
    const shiftDuration =
      (newEventEnd.getTime() - newEventStart.getTime()) / (1000 * 60 * 60);

    if ((employeeRemainingHours[selectedEmployeeId] || 0) < shiftDuration) {
      alert("Not enough remaining hours for this employee.");
      return;
    }

    if (selectedEventId) {
      // Update existing event
      try {
        await updateDoc(doc(db, "schedules", selectedEventId), {
          title,
          start: newEventStart,
          end: newEventEnd,
          description: eventDescription,
        });
  
        setEvents((prev) =>
          prev.map((ev) =>
            ev.id === selectedEventId
              ? { ...ev, title, start: newEventStart, end: newEventEnd }
              : ev
          )
        );
  
        console.log("Event updated:", selectedEventId);
      } catch (error) {
        console.error("Error updating event:", error);
        alert("Failed to update event.");
      }
    } else {
      // Create new event
      await addSchedule(
        title,
        newEventStart,
        newEventEnd,
        selectedEmployeeId,
        eventDescription,
        isKitchen
      );
    }

    setOpenDialog(false);
    setStartTime("");
    setEndTime("");
    setEventDescription("");

    handleDialogClose(); // Clear selected event ID
  };


  // handle event drop function to update the event start and end times in the database
  const handleEventDrop = async ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
  
    try {
      await updateDoc(doc(db, "schedules", event.id), {
        start,
        end,
      });
      setEvents((prev) =>
        prev.map((ev) => (ev.id === event.id ? updatedEvent : ev))
      );
  
      console.log(`Shift updated for event ID: ${event.id}`);
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event.");
    }
  };

  // handle select event function to set the selected slot, employee ID, and open the dialog
  const handleSelectEvent = (event) => {
    setSelectedSlot({ start: event.start, end: event.end });
    setSelectedEmployeeId(event.employeeId);
    setSelectedEmployeeName(event.title);
    setEventDescription(event.description || "");
    setSelectedEventId(event.id);
    setOpenDialog(true);
  };


  

  const handleDeleteSchedule = async () => {
    if (!selectedEventId) return;
  
    try {
      await deleteDoc(doc(db, "schedules", selectedEventId));
      setEvents((prev) => prev.filter((event) => event.id !== selectedEventId));
      console.log("Event deleted:", selectedEventId);
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    }
  
    setOpenDialog(false);
    setSelectedEventId(null); // Clear selected event
  };
  
 
  // handle export to PDF function to generate a PDF of the weekly employee schedule
  const handleExportToPDF = () => {
    const doc = new jsPDF();
  
    // Add Title
    doc.setFontSize(14);
    doc.text("Weekly Employee Schedule", 30, 20); // (text, x, y)
  
  
    // Prepare Table Columns
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const tableColumns = ["Employee", ...daysOfWeek.map((day, index) => `${day} (${moment().startOf("week").add(index + 1, "days").format("D/MM")})`)];
  
  // Prepare Table Data
  const tableRows = employees.map((employee) => {
    const row = [employee.employee_fname + " " + employee.employee_lname]; // Employee Name
    daysOfWeek.forEach((day, index) => {
      // Get the start date of the week for reference
      const currentDate = moment()
        .startOf("week")
        .add(index + 1, "days")
        .format("YYYY-MM-DD"); // Format to match event date

      // Filter events for this employee and day
      const dayEvents = events.filter(
        (event) =>
          event.employeeId === employee.id &&
          moment(event.start).format("YYYY-MM-DD") === currentDate
      );

      if (dayEvents.length > 0) {
        // Combine all shifts into one cell
        const shiftDetails = dayEvents
          .map(
            (event) =>
              `${event.description} (${moment(event.start).format("h:mm A")} to ${moment(event.end).format("h:mm A")})`
          )
          .join("\n");
        row.push(shiftDetails);
      } else {
        row.push(""); // Empty cell for no shifts
      }
    });
    return row;
    });
  
    // Render Table in PDF
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 20,
      theme: "grid",
      styles: {
        halign: "center", // Center align text
        valign: "middle", // Vertically align text
      },
      columnStyles: {
        0: { halign: "left" }, // Align employee names to the left
      },
      didDrawCell: (data) => {
        // Check if the cell contains "No shift"
        if (data.cell.raw === "No shift") {
          doc.setFillColor(200); // Set gray background color
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, "F"); // Fill the cell
        }
      },
    });
  
    // Save PDF
    doc.save("Employee_Schedule.pdf");
  };
  
  
  

  return (
    <Box display="flex" flexDirection="column" height="100vh" padding={""}>

      {/* Auto Generate Button Section */}
      <Box
        display="flex"
        justifyContent="flex-start"
        gap={5}
        sx={{ padding: "1.5rem"}}
      >
        <AutoGenerateSchedule
        
          employees={employees}
          addSchedule={addSchedule}
          hasOverlappingSchedule={hasOverlappingSchedule}
          setEvents={setEvents}
          updateEmployeeHours={updateRemainingHours}
          isKitchen={isKitchen}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleExportToPDF}
        >
          Export to PDF
        </Button>
      </Box>
  
      {/* Calendar Section */}
      <Box display="flex" flexGrow={1} overflow="hidden"> 
        
        {/* Employee List */}
        <Paper
          style={{
            width: "250px",
            overflowY: "auto",
            padding: "8px",
            height: "100%",
          }}
        >
          <Typography variant="h6" align="center">
            Employee List
          </Typography>
          <List>
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
                  backgroundColor:
                    selectedEmployeeId === employee.id ? "#d3d3d3" : "white",
                  margin: "1rem 0",
                  borderRadius: "4px",
                }}
              >
                <Avatar src={employee.photoURL} alt={employee.employee_fname} />
                <ListItemText
                  primary={`${employee.employee_fname} ${employee.employee_lname}`}
                  secondary={
                    <>
                      <Typography variant="body2">
                        {employee.employee_position}
                      </Typography>
                      <Typography variant="body2">
                        Remaining Hours:{" "}
                        {employeeRemainingHours[employee.id] !== undefined
                          ? employeeRemainingHours[employee.id].toFixed(1) // Format to 1 decimal place
                          : getMaxHours(employee.employee_type)}{" "}
                        hrs
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
  
        {/* Calendar */}
        <Box flexGrow={1} overflow="hidden">
          <DnDCalendar
            localizer={localizer}
            events={events}
            selectable
            resizable
            onEventDrop={handleEventDrop}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            dayLayoutAlgorithm="overlap"
            defaultView="week"
            style={{ height: "100%", width: "100%" }}
          />
        </Box>
      </Box>
  
      {/* Dialog for Event Actions */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{`Assign Shift for ${selectedEmployeeName}`}</DialogTitle>
        <DialogContent>
          <TextField
            label="Start Time (HH:mm)"
            type="time"
            fullWidth
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <TextField
            label="End Time (HH:mm)"
            type="time"
            fullWidth
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <TextField
            label="Description"
            type="text"
            fullWidth
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          {selectedEventId ? (
            // When updating an existing event
            <>
              <Button color="error" onClick={handleDeleteSchedule}>
                Delete
              </Button>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={handleScheduleSet}>Update</Button>
            </>
          ) : (
            // When creating a new event
            <>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={handleScheduleSet}>Set Schedule</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
  
};

export default EmployeeScheduler;
