import React, { useState, useCallback } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import moment from 'moment';

const AutoGenerateSchedule = ({ employees, addSchedule, hasOverlappingSchedule, setEvents }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [params, setParams] = useState({
    numberOfWeeks: 2,
    employeesPerShift: 1
  });

  const handleGenerateClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleParamChange = (e) => {
    setParams({ ...params, [e.target.name]: parseInt(e.target.value) });
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

    while (scheduleStartDate.isBefore(scheduleEndDate)) {
      const dailyEmployees = [...employees];

      for (const shift of shifts) {
        const shiftStart = moment(scheduleStartDate).set(shift.start);
        const shiftEnd = moment(scheduleStartDate).set(shift.end);

        const availableEmployees = dailyEmployees.filter(
          (employee) =>
            !hasOverlappingSchedule(
              employee.id,
              shiftStart.toDate(),
              shiftEnd.toDate()
            ) && employee.employee_availability.includes(shift.type)
        );

        for (let i = 0; i < params.employeesPerShift && i < availableEmployees.length; i++) {
          const selectedEmployeeIndex = Math.floor(Math.random() * availableEmployees.length);
          const selectedEmployee = availableEmployees[selectedEmployeeIndex];

          const newEvent = {
            title: `${selectedEmployee.employee_fname} ${selectedEmployee.employee_lname}`,
            start: shiftStart.toDate(),
            end: shiftEnd.toDate(),
            employeeId: selectedEmployee.id,
            description: `Auto-generated ${shift.type} shift`,
          };

          const docRefId = await addSchedule(
            newEvent.title,
            newEvent.start,
            newEvent.end,
            newEvent.employeeId,
            newEvent.description
          );
          newEvents.push({ ...newEvent, id: docRefId });

          // Remove the scheduled employee from the daily pool
          const dailyIndex = dailyEmployees.findIndex(emp => emp.id === selectedEmployee.id);
          if (dailyIndex !== -1) {
            dailyEmployees.splice(dailyIndex, 1);
          }

          // Remove the scheduled employee from available employees
          availableEmployees.splice(selectedEmployeeIndex, 1);
        }
      }
      scheduleStartDate.add(1, "day");
    }
    setEvents((prevEvents) => [...prevEvents, ...newEvents]);
    handleDialogClose();
  }, [employees, addSchedule, hasOverlappingSchedule, setEvents, params]);

  return (
    <>
      <Button onClick={handleGenerateClick} variant="contained" size='small' color="primary">
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
            onChange={handleParamChange}
            margin="normal"
          />
          <TextField
            name="employeesPerShift"
            label="Employees Per Shift"
            type="number"
            fullWidth
            value={params.employeesPerShift}
            onChange={handleParamChange}
            margin="normal"
          />
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