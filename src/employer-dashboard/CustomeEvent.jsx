// import { Event as CalendarEvent } from "react-big-calendar";
import React from "react";
import moment from "moment";

const CustomEvent = ({ event, employees }) => {
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