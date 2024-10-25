import React, { useState, useEffect } from "react";
import { Box, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { Scheduler, SchedulerData } from "@bitnoi.se/react-scheduler";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export const EmployeeScheduler: React.FC<{ employees: any[] }> = ({ employees }) => {
  const [schedulerData, setSchedulerData] = useState<SchedulerData[]>([]);
  const [draggedEmployee, setDraggedEmployee] = useState<any | null>(null);

  // Convert employee data to scheduler format
  useEffect(() => {
    const convertedData: SchedulerData[] = employees.map(employee => ({
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

  // Handle dropping an employee onto the scheduler
  const handleDrop = (result: any) => {
    if (!result.destination) return; // If dropped outside

    const newScheduleEntry = {
      id: draggedEmployee.id,
      startTime: new Date(), // Set this to your desired start time
      endTime: new Date(new Date().getTime() + 60 * 60 * 1000), // Example for a one-hour shift
      title: `${draggedEmployee.employee_fname} ${draggedEmployee.employee_lname}`,
    };

    // Update schedulerData with the new shift for the dragged employee
    setSchedulerData(prevData =>
      prevData.map(emp =>
        emp.id === draggedEmployee.id 
          ? { ...emp, data: [...emp.data, newScheduleEntry] } 
          : emp
      )
    );

    console.log('Dropped employee:', draggedEmployee);
    setDraggedEmployee(null); // Reset dragged employee
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)' }}>
      {/* Employee list sidebar */}
      <Paper elevation={3} sx={{ width: '250px', overflowY: 'auto', padding: 2 }}>
        <Typography variant="h6" gutterBottom>Employees</Typography>
        <DragDropContext onDragEnd={handleDrop}>
          <Droppable droppableId="employeeList">
            {(provided) => (
              <List ref={provided.innerRef} {...provided.droppableProps}>
                {employees.map((employee, index) => (
                  <Draggable key={employee.id} draggableId={employee.id} index={index}>
                    {(provided) => (
                      <ListItem 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        button
                        onDragStart={(e) => handleDragStart(e, employee)}
                      >
                        <ListItemText 
                          primary={`${employee.employee_fname} ${employee.employee_lname}`}
                          secondary={employee.employee_position}
                        />
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </Paper>
      
      {/* Scheduler component */}
      <Box sx={{ flexGrow: 1, marginLeft: 2 }} onDragOver={(e) => e.preventDefault()}>
        <Scheduler
          data={schedulerData}
          onItemClick={(item) => console.log('Clicked item:', item)}
          config={{
            zoom: 1,
            maxRecordsPerPage: 50,
            lang: "en",
            includeTakenHoursOnWeekendsInDayView: true,
            showTooltip: true,
          }}
        />
      </Box>
    </Box>
  );
};

export default EmployeeScheduler;