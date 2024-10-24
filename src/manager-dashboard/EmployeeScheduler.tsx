import React, { useState, useEffect } from "react";
import { Box, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { Scheduler, SchedulerData } from "@bitnoi.se/react-scheduler";

export const EmployeeScheduler: React.FC<{ employees: any[] }> = ({ employees }) => {
  const [schedulerData, setSchedulerData] = useState<SchedulerData>([]);
  const [draggedEmployee, setDraggedEmployee] = useState<any | null>(null);

  // Convert employee data to scheduler format
  useEffect(() => {
    const convertedData: SchedulerData = employees.map(employee => ({
      id: employee.id || Math.random().toString(),
      label: {
        title: `${employee.employee_fname} ${employee.employee_lname}`,
        subtitle: employee.employee_position
      },
      data: [] // Start with an empty schedule for each employee
    }));
    setSchedulerData(convertedData);
  }, [employees]);

  // Handle the start of dragging an employee
  const handleDragStart = (e: React.DragEvent, employee: any) => {
    setDraggedEmployee(employee);
  };

  // Prevent default to allow drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle dropping an employee onto the scheduler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedEmployee) {
      // Here you would implement the logic to add the dragged employee to the schedule
      console.log('Dropped employee:', draggedEmployee);
      // TODO: Update schedulerData with the new shift
      setDraggedEmployee(null);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)' }}>
      {/* Employee list sidebar */}
      <Paper elevation={3} sx={{ width: '250px', overflowY: 'auto', padding: 2 }}>
        <Typography variant="h6" gutterBottom>Employees</Typography>
        <List>
          {employees.map((employee) => (
            <ListItem
              key={employee.id}
              button
              draggable
              onDragStart={(e: React.DragEvent<Element>) => handleDragStart(e, employee)}
            >
              <ListItemText 
                primary={`${employee.employee_fname} ${employee.employee_lname}`}
                secondary={employee.employee_position}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      
      {/* Scheduler component */}
      <Box sx={{ flexGrow: 1, marginLeft: 2 }} onDragOver={handleDragOver} onDrop={handleDrop}>
        <Scheduler
          data={schedulerData}
          onItemClick={(item) => console.log('Clicked item:', item)}
          config={{
            zoom: 1,
            maxRecordsPerPage: 50,
            lang: "en",
            includeTakenHoursOnWeekendsInDayView: true,
            showTooltip: true
          }}
        />
      </Box>
    </Box>
  );
};