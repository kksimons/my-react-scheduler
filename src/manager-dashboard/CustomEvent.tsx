import { Event as CalendarEvent } from "react-big-calendar";
import React from "react";

interface Event extends CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  employeeId: string;
  description?: string;
}

interface Employee {
  id: string;
  employee_fname: string;
  employee_lname: string;
  employee_position: string;
}

interface CustomEventProps {
  event: Event;
  employees: Employee[];
}

const CustomEvent: React.FC<CustomEventProps> = ({ event, employees }) => {
  const employee = employees.find((emp) => emp.id === event.employeeId);
  return (
    <div>
      <strong>
        {employee
          ? `${employee.employee_fname} ${employee.employee_lname}`
          : event.title}
      </strong>
      <div>{event.description}</div>
    </div>
  );
};
export default CustomEvent;
