import React, { useState, useCallback } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import moment from 'moment';
import EmployeeScheduler from './EmployeeScheduler';

const positions = ['Server', 'Busser', 'Cook', 'Host'];

const positionColors = {
  Server: '#FF5733', // Red
  Busser: '#33FF57', // Green
  Cook: '#3357FF', // Blue
  Host: '#F1C40F', // Yellow
};

const AutoGenerateSchedule = ({ employees, addSchedule, hasOverlappingSchedule, setEvents, updateEmployeeHours }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [params, setParams] = useState({
    numberOfWeeks: 1,
    employeesPerDay: {
      Monday: {},
      Tuesday: {},
      Wednesday: {},
      Thursday: {},
      Friday: {},
      Saturday: {},
      Sunday: {}
    }
  });

  // Initialize employee counts for each position
  positions.forEach(position => {
    Object.keys(params.employeesPerDay).forEach(day => {
      if (!params.employeesPerDay[day][position]) {
        params.employeesPerDay[day][position] = 0; // Default to 0 if not already set
      }
    });
  });

  const handleGenerateClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleParamChange = (day, position, value) => {
    setParams(prev => ({
      ...prev,
      employeesPerDay: {
        ...prev.employeesPerDay,
        [day]: {
          ...prev.employeesPerDay[day],
          [position]: parseInt(value) || 0 // Ensure it defaults to 0 if not a valid number
        }
      }
    }));
  };

  const getMaxHours = (employeeType) => {
    return employeeType === 'Full-Time' ? 40 : 24;
  };

  const autoGenerateSchedule = useCallback(async () => {
    const scheduleStartDate = moment().startOf("week").add(1, "weeks");
    const scheduleEndDate = moment(scheduleStartDate).add(params.numberOfWeeks, "weeks");
    const newEvents = [];

    const shifts = [
      { type: "Morning", start: { hour: 7, minute: 0 }, end: { hour: 13, minute: 0 } },
      { type: "Evening", start: { hour: 13, minute: 0 }, end: { hour: 19, minute: 0 } },
      { type: "Closing", start: { hour: 16, minute: 0 }, end: { hour: 22, minute: 0 } }
    ];

    // Initialize employee hours for the week
    const employeeHours = employees.reduce((acc, employee) => {
      acc[employee.id] = {
        maxHours: getMaxHours(employee.employee_type),
        scheduledHours: 0
      };
      return acc;
    }, {});

    while (scheduleStartDate.isBefore(scheduleEndDate)) {
      const dayName = scheduleStartDate.format('dddd'); // Get current day name
      const dailyEmployees = [...employees];

      for (const shift of shifts) {
        const shiftStart = moment(scheduleStartDate).set(shift.start);
        const shiftEnd = moment(scheduleStartDate).set(shift.end);
        const shiftDuration = moment.duration(shiftEnd.diff(shiftStart)).asHours();

        // Schedule based on user-defined requirements
        await Promise.all(positions.map(async position => {
          const requiredCount = params.employeesPerDay[dayName][position];

          // Filter available employees based on position and availability
          const availableEmployees = dailyEmployees.filter(
            (employee) =>
              employee.employee_position === position &&
              !hasOverlappingSchedule(
                employee.id,
                shiftStart.toDate(),
                shiftEnd.toDate()
              ) && 
              employee.employee_availability.includes(shift.type) &&
              (employeeHours[employee.id].scheduledHours + shiftDuration) <= employeeHours[employee.id].maxHours
          );

          for (let i = 0; i < requiredCount && i < availableEmployees.length; i++) {
            const selectedEmployeeIndex = Math.floor(Math.random() * availableEmployees.length);
            const selectedEmployee = availableEmployees[selectedEmployeeIndex];

            const newEvent = {
              title: `${selectedEmployee.employee_fname} ${selectedEmployee.employee_lname} (${position})`,
              start: shiftStart.toDate(),
              end: shiftEnd.toDate(),
              employeeId: selectedEmployee.id,
              description: `Auto-generated ${shift.type} shift - ${position}`,
              color: positionColors[position], // Assign color based on position
            };

            const docRefId = await addSchedule(
              newEvent.title,
              newEvent.start,
              newEvent.end,
              newEvent.employeeId,
              newEvent.description
            );
            newEvents.push({ ...newEvent, id: docRefId });

            // Update scheduled hours for the employee
            employeeHours[selectedEmployee.id].scheduledHours += shiftDuration;

            // Remove the scheduled employee from the daily pool
            dailyEmployees.splice(dailyEmployees.findIndex(emp => emp.id === selectedEmployee.id), 1);
          }
        }));
      }

      scheduleStartDate.add(1, "day");
    }

    setEvents((prevEvents) => [...prevEvents, ...newEvents]);

    // Update employee hours in the UI
    Object.entries(employeeHours).forEach(([employeeId, hours]) => {
      const remainingHours = hours.maxHours - hours.scheduledHours;
      updateEmployeeHours(employeeId, remainingHours);
    });

    handleDialogClose();
  }, [employees, addSchedule, hasOverlappingSchedule, setEvents, params, updateEmployeeHours]);

  return (
    <>
      <Button 
      onClick={handleGenerateClick} 
      variant="contained" 
      size="small" 
      color="primary"
      sx={{
        marginTop: '60px',    // Adds space above the button
        marginBottom: '6px', // Adds space below the button
        marginLeft: '6px',   //Adds space to the left of the button
        height: '94%',       // Adjust button height
        width: '175px',       // Adjust button width
        border: '3px solid #6200ea',  // Add border (purple color, adjust as needed)
        borderRadius: '5px',     // Rounded corners (optional)
        padding: '10px 20px',    // Optional padding for extra spacing inside the button 
        backgroundColor: "primary", 
        '&:hover': {
          backgroundColor: '#4b00c7', // Darker purple on hover
          borderColor: '#4b00c7',     // Darker border color on hover
        } 
      }}
      >
        Generate Auto Schedule
      </Button>

      

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Auto Generate Schedule</DialogTitle>
        <DialogContent>
          <TextField
            name="numberOfWeeks"
            label="Number of Weeks"
            type="number"
            fullWidth
            value={params.numberOfWeeks}
            onChange={(e) => setParams({ ...params, numberOfWeeks: parseInt(e.target.value) })}
            margin="normal"
          />
          {Object.keys(params.employeesPerDay).map(day => (
            <div key={day}>
              <h4>{day}</h4>
              {positions.map(position => (
                <TextField
                  key={`${day}-${position}`}
                  label={`${position}s Required`}
                  type="number"
                  fullWidth
                  value={params.employeesPerDay[day][position]}
                  onChange={(e) => handleParamChange(day, position, e.target.value)}
                  margin="normal"
                />
              ))}
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={autoGenerateSchedule} color="primary">Generate</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AutoGenerateSchedule;