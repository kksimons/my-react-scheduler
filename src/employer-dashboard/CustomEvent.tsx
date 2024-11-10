import { Event as CalendarEvent } from "react-big-calendar";
import React from "react";
import moment from "moment";

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

  // Format start and end times
  // const startTime = moment(event.start).format("HH:mm");
  // const endTime = moment(event.end).format("HH:mm");
  const eventStyle = {
    // backgroundColor: employee ? "#4caf50" : "#2196f3",
    // color: "#fff",
    // padding: "2px",
    // borderRadius: "5px",
    // height: "100px",
  };

  return (
    <div style={eventStyle}>
      {/* <strong>{`${startTime} - ${endTime}`}</strong>    */}
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
