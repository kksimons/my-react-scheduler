import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Paper, Typography, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../userAuth/firebase';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

interface Employee {
  id: string;
  employee_fname: string;
  employee_lname: string;
  employee_position: string;
}

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  employeeId: string;
}

const EmployeeScheduler: React.FC<{ employees: Employee[] }> = ({ employees }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date; employeeId?: string }>({ start: new Date(), end: new Date() });
  const [startTime, setStartTime] = useState<string>('07:00'); // Default start time
  const [endTime, setEndTime] = useState<string>('19:00'); // Default end time

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    const scheduleCollection = collection(db, 'schedules');
    const scheduleSnapshot = await getDocs(scheduleCollection);
    const scheduleList = scheduleSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      start: doc.data().start.toDate(),
      end: doc.data().end.toDate(),
    })) as Event[];
    setEvents(scheduleList);
  };

  const addSchedule = async (title: string, start: Date, end: Date, employeeId: string) => {
    try {
      const docRef = await addDoc(collection(db, 'schedules'), {
        title,
        start,
        end,
        employeeId,
      });
      console.log('Document written with ID:', docRef.id);
      return docRef.id; // Return the new document ID
    } catch (e) {
      console.error('Error adding document:', e);
    }
  };

  const updateSchedule = async (eventId: string, updatedEvent: Event) => {
    try {
      await updateDoc(doc(db, 'schedules', eventId), updatedEvent);
      console.log('Document updated with ID:', eventId);
    } catch (e) {
      console.error('Error updating document:', e);
    }
  };

  const handleEventDrop = useCallback(
    async ({ event, start }) => {
      const end = new Date(start.getTime() + (event.end.getTime() - event.start.getTime())); // Calculate new end time
      const updatedEvent = { ...event, start, end };
      
      await updateSchedule(event.id, updatedEvent); // Update existing event in Firestore
      setEvents(prev => prev.map(ev => ev.id === event.id ? updatedEvent : ev));
    },
    []
  );

  const handleSelectSlot = useCallback(
    async ({ start }) => {
      // Open dialog to set working hours for the selected employee
      const employeeIndex = Math.floor((start.getHours() - 7)); // Assuming shifts are hourly starting at 7 AM
      if (employeeIndex < 0 || employeeIndex >= employees.length) return; // Check if within bounds

      const employee = employees[employeeIndex];
      if (!employee) return;

      setSelectedSlot({ start }); // Set selected slot for dialog
      setOpenDialog(true); // Open dialog
      setStartTime('09:00'); // Reset default time
      setEndTime('10:00');   // Reset default time
      setSelectedEventId(null); // Reset selected event ID for new schedule
    },
    [employees]
  );

  const handleDialogClose = () => {
    setOpenDialog(false);
    setStartTime('07:00'); // Reset default time
    setEndTime('9:00');   // Reset default time
    setSelectedEventId(null); // Reset selected event ID
  };

  const handleScheduleSet = async () => {
    // Parse input times
    const [startHour] = startTime.split(':').map(Number);
    const [endHour] = endTime.split(':').map(Number);

    // Create new event based on input times
    const newEventStart = new Date(selectedSlot.start);
    newEventStart.setHours(startHour);

    const newEventEnd = new Date(selectedSlot.start);
    newEventEnd.setHours(endHour);

    if (newEventEnd <= newEventStart) {
      alert("End time must be after start time.");
      return;
    }

    const title = `${employees[Math.floor((selectedSlot.start.getHours() - 7))].employee_fname} ${employees[Math.floor((selectedSlot.start.getHours() - 7))].employee_lname}`;

    const newEvent: Event = {
      id: '', // Temporary ID until saved in Firestore
      title,
      start: newEventStart,
      end: newEventEnd,
      employeeId: employees[Math.floor((selectedSlot.start.getHours() - 7))].id,
    };

    if (selectedEventId) {
      await updateSchedule(selectedEventId, {
        title, start: newEventStart, end: newEventEnd,
        id: '',
        employeeId: ''
      }); // Update existing event if editing
      setEvents(prev => prev.map(ev => ev.id === selectedEventId ? { ...newEvent, id: selectedEventId } : ev));
    } else {
      // Add to Firestore and update state for new event
      const docRefId = await addSchedule(newEvent.title, newEvent.start, newEvent.end, newEvent.employeeId);
      newEvent.id = docRefId; // Set the ID of the newly created document

      setEvents(prev => [...prev.filter(ev => ev.id !== ''), newEvent]); // Add or update event in state
    }

    handleDialogClose();
  };

  const handleDeleteSchedule = async () => {
    if (!selectedEventId) return;

    await deleteDoc(doc(db, 'schedules', selectedEventId));
    
    setEvents(prev => prev.filter(ev => ev.id !== selectedEventId));
    
    handleDialogClose();
  };

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      
    <Paper elevation={3} sx={{ backgroundColor: '#8a2be2', width: '150', overflowY: 'auto', marginRight: 2, padding: 3, paddingTop: 5}}>
      <Typography variant="h6" gutterBottom>
        Employees
      </Typography>
      <List>
        {employees.map((employee) => (
          <ListItem key={employee.id}>
            <ListItemText
              primary={`${employee.employee_fname} ${employee.employee_lname}`}
              secondary={employee.employee_position}
              sx={{ backgroundColor: '#9b30ff', padding: '8px', borderRadius:'4px', marginBottom:'4px' }} 
            />
          </ListItem>
        ))}
      </List>
    </Paper>

     {/* Calendar Component */}
     <DnDCalendar
      localizer={localizer}
      events={events}
      onEventDrop={handleEventDrop}
      onSelectSlot={handleSelectSlot}
      onSelectEvent={(event) => {
        setSelectedSlot({ start: event.start }); 
        setStartTime(moment(event.start).format("HH:mm")); 
        setEndTime(moment(event.end).format("HH:mm"));
        setSelectedEventId(event.id); 
        setOpenDialog(true); 
      }}
      selectable
      resizable
      defaultView="week"
      views={['day', 'week']}
      step={60}
      timeslots={1}
      min={moment().hours(7).minutes(0).toDate()}
      max={moment().hours(20).minutes(0).toDate()}
      style={{ marginLeft: 2, flexGrow: 1 }}
      // components={{
      //   timeSlotWrapper() {
      //     return (
      //       <div style={{ display: "none" }}>
      //       </div>
      //     );
      //   }
      // }}
     />

     {/* Dialog for setting schedule */}
     <Dialog open={openDialog} onClose={handleDialogClose}>
       <DialogTitle>{selectedEventId ? "Update Working Hours" : "Set Working Hours"}</DialogTitle>
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
       </DialogContent>
       <DialogActions>
         {selectedEventId && (
           <Button color="error" onClick={handleDeleteSchedule}>Delete</Button> 
         )}
         <Button onClick={handleDialogClose}>Cancel</Button>
         <Button onClick={handleScheduleSet}>{selectedEventId ? "Update Schedule" : "Set Schedule"}</Button>
       </DialogActions>
     </Dialog>

   </Box>
  );
};

export default EmployeeScheduler;