import React, { useState, useCallback } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import moment from 'moment';

const AutoGenerateSchedule = ({ employees, addSchedule, hasOverlappingSchedule, setEvents, updateEmployeeHours, isKitchen }) => {
  const positions = isKitchen ? ['Cook'] : ['Server', 'Busser', 'Host'];

  const initializeEmployeesPerDay = () => {
    const initial = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    days.forEach(day => {
      initial[day] = {};
      positions.forEach(position => {
        initial[day][position] = 0;
      });
    });
    return initial;
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [params, setParams] = useState({
    numberOfWeeks: 1,
    employeesPerDay: initializeEmployeesPerDay(),
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
          [position]: parseInt(value) || 0, // Ensure it defaults to 0 if not a valid number
        },
      },
    }));
  };

  const getMaxHours = employeeType => {
    return employeeType === 'Full-Time' ? 40 : 24;
  };

  const autoGenerateSchedule = useCallback(async () => {
    try {
    console.log("autoGenerateSchedule function called.")
    const scheduleStartDate = moment().startOf('week').add(1, 'weeks');
    const scheduleEndDate = moment(scheduleStartDate).add(params.numberOfWeeks, 'weeks');
    const newEvents = [];

    // Define shifts based on schedule type
    const shifts = isKitchen
      ? [
          { type: 'Morning', start: { hour: 7, minute: 0 }, end: { hour: 13, minute: 0 } },
          { type: 'Evening', start: { hour: 13, minute: 0 }, end: { hour: 19, minute: 0 } },
          { type: 'Closing', start: { hour: 18, minute: 0 }, end: { hour: 22, minute: 0 } },
        ]
      : [
          { type: 'Morning', start: { hour: 8, minute: 0 }, end: { hour: 14, minute: 0 } },
          { type: 'Evening', start: { hour: 14, minute: 0 }, end: { hour: 20, minute: 0 } },
          { type: 'Closing', start: { hour: 18, minute: 0 }, end: { hour: 22, minute: 0 } },
        ];

    // Initialize employee hours for the week
    const employeeHours = employees.reduce((acc, employee) => {
      acc[employee.id] = {
        maxHours: getMaxHours(employee.employee_type),
        scheduledHours: 0,
      };
      return acc;
    }, {});

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

       

    while (scheduleStartDate.isBefore(scheduleEndDate)) {
      const dayName = scheduleStartDate.format('dddd'); // Get current day name
      console.log(`Processing date: ${scheduleStartDate.format('YYYY-MM-DD')} (${dayName})`);

      const dailyEmployees = [...employees];

      for (const shift of shifts) {
        console.log(`  Processing shift: ${shift.type}`);
        const shiftStart = moment(scheduleStartDate).set(shift.start);
        const shiftEnd = moment(scheduleStartDate).set(shift.end);
        const shiftDuration = moment.duration(shiftEnd.diff(shiftStart)).asHours();

        // Determine positions based on schedule type
        // const positions = isKitchen ? ['Cook'] : ['Host', 'Server', 'Busser'];

        await Promise.all(
          positions.map(async position => {
            try {
              console.log(`    Processing position: ${position}`);
            const requiredCount = params.employeesPerDay[dayName][position];
            console.log(`    Required count for ${position} on ${dayName}:`, requiredCount);

            // Skip if no employees required for this position on this day
            if (!requiredCount || requiredCount <= 0) return;

            // Filter available employees based on position and availability
            const availableEmployees = dailyEmployees.filter(
              employee => {
                const availability = Array.isArray(employee.employee_availability) ? employee.employee_availability : [employee.employee_availability];
                
                return (
                  employee.employee_position === position &&
                  employee.employee_system === (isKitchen ? 'Kitchen Side' : 'Dining Side') &&
                  !hasOverlappingSchedule(employee.id, shiftStart.toDate(), shiftEnd.toDate()) &&
                  availability.includes(shift.type) &&
                  employeeHours[employee.id].scheduledHours + shiftDuration <= employeeHours[employee.id].maxHours
                );
              }

            );
            console.log(`    Available employees for ${position} on ${dayName}:`, availableEmployees);

            for (let i = 0; i < requiredCount && availableEmployees.length > 0; i++) {
              // Randomly select an available employee
              const selectedEmployeeIndex = Math.floor(Math.random() * availableEmployees.length);
              const selectedEmployee = availableEmployees[selectedEmployeeIndex];

              const newEvent = {
                title: `${selectedEmployee.employee_fname} ${selectedEmployee.employee_lname} (${position})`,
                start: shiftStart.toDate(),
                end: shiftEnd.toDate(),
                employeeId: selectedEmployee.id,
                description: `Auto-generated ${shift.type} shift - ${position}`,
                position: selectedEmployee.employee_position,
              };

              
        // Create a new schedule batch
        // const batchRef = await addDoc(collection(db, 'scheduleBatches'), {
        //   startDate: scheduleStartDate.toDate(),
        //   endDate: scheduleEndDate.toDate(),
        //   status: 'Draft',
        //   scheduleType: isKitchen ? 'Kitchen Side' : 'Dining Side',
        //   createdAt: new Date(),
        // });

        // const batchId = batchRef.id;

              const addedEvent = await addSchedule(
                newEvent.title,
                newEvent.start,
                newEvent.end,
                newEvent.employeeId,
                newEvent.description,
                isKitchen,
                // batchId 
              );

              if (addedEvent) {
                newEvents.push(addedEvent);
              }

              // Update scheduled hours for the employee
              employeeHours[selectedEmployee.id].scheduledHours += shiftDuration;

              // Remove the scheduled employee from the daily pool
              availableEmployees.splice(selectedEmployeeIndex, 1);
              dailyEmployees.splice(
                dailyEmployees.findIndex(emp => emp.id === selectedEmployee.id),
                1
              );
            }
          } catch (error) {
            console.error(`Error scheduling position ${position} on ${dayName}:`, error);
          }
          })
        );
      }

      scheduleStartDate.add(1, 'day');
    }
console.log("Generated events: ", newEvents);
    setEvents(prevEvents => [...prevEvents, ...newEvents]);

    // Update employee hours in the UI
    Object.entries(employeeHours).forEach(([employeeId, hours]) => {
      const remainingHours = hours.maxHours - hours.scheduledHours;
      updateEmployeeHours(employeeId, remainingHours);
    });
      // Close the dialog after generating the schedule
      handleDialogClose();

      alert('Schedule generated successfully!');
  } catch (error) {
    console.error('Error in autoGenerateSchedule:', error);
    alert('An error occurred while generating the schedule.');
  }
  }, [employees, addSchedule, hasOverlappingSchedule, setEvents, params, updateEmployeeHours, isKitchen]);

  return (
    <>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Auto Generate Schedule</DialogTitle>
        <DialogContent>
          <TextField
            name="numberOfWeeks"
            label="Number of Weeks"
            type="number"
            fullWidth
            value={params.numberOfWeeks}
            onChange={e => setParams({ ...params, numberOfWeeks: parseInt(e.target.value) })}
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
                  onChange={e => handleParamChange(day, position, e.target.value)}
                  margin="normal"
                />
              ))}
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={() => {console.log('Generate button clicked'); autoGenerateSchedule()}} color="primary">
            Generate
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AutoGenerateSchedule;
