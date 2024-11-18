// import { Event as CalendarEvent } from "react-big-calendar";
import React from "react";
import moment from "moment";

const CustomEvent = ({ event, employees }) => {
  const employee = employees.find((emp) => emp.id === event.employeeId);

  return (
    <div>
      <div>
        {employee
          ? `${employee.employee_fname} ${employee.employee_lname}`
          : event.title}
      </div>
      <div>{event.description}</div>
    </div>
  );
};

export default CustomEvent;