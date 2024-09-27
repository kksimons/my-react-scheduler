// App.tsx

import { useState } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import './ScheduleView.css';

//possible colors for an event to get assigned when it comes in
const colors = ['#50b500', '#007BFF', '#FFC107', '#900000', '#28a745'];

// Form data types
interface FormData {
  num_employees: string;
  shifts_per_day: string;
  total_days: string;
  employee_types: string[];
}

// Event types
interface Event {
  event_id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  admin_id: number;
  editable: boolean;
}

export default function App() {
  // Define the type for events array
  const [events, setEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState<FormData>({
    num_employees: "",
    shifts_per_day: "",
    total_days: "",
    employee_types: [],
  });

  // Update form data based on input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // If the number of employees changes, adjust the employee_types array accordingly
    if (name === "num_employees") {
      const numEmployees = parseInt(value, 10) || 0;
      setFormData({
        ...formData,
        num_employees: value,
        employee_types: new Array(numEmployees).fill("full_time"),  // Default to full_time?
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle changes in the employee types so each employee gets an employee_type
  const handleEmployeeTypeChange = (index: number, value: string) => {
    const updatedEmployeeTypes = [...formData.employee_types];
    updatedEmployeeTypes[index] = value;
    setFormData({
      ...formData,
      employee_types: updatedEmployeeTypes,
    });
  };

  // Define the type for the form submission handler: the api expects num_employees, shifts_per_day, total_days, and an array of employee_types
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      num_employees: parseInt(formData.num_employees, 10),
      shifts_per_day: parseInt(formData.shifts_per_day, 10),
      total_days: parseInt(formData.total_days, 10),
      employee_types: formData.employee_types,
    };
    
    // Make the POST request to the API; remember to have the docker running
    // docker run -p 80:5000 kksimons/scheduler:latest
    const response = await fetch("http://localhost:80/api/v1/scheduler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log(data);

    // Convert the API response to scheduler events
    const newEvents: Event[] = [];

    // Iterate over the entire schedules array
    data.schedules.forEach((dayObj: any, outerIndex: number) => {
      // Iterate over each "Day X" key
      Object.keys(dayObj).forEach((dayKey, dayIndex) => {
        const shifts = dayObj[dayKey];

        // Increment the base date by the dayIndex (to correctly map Day 1, Day 2, etc.)
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + dayIndex);

        // Iterate over the shifts in the day object that comes back inside of the schedule array
        shifts.forEach((item: any) => {
          const shiftStartHour = item.shift === 0 ? 6 : 12;
          const shiftEndHour = item.shift === 0 ? 12 : 17;

          // Create the start and end time for the shift based on the current date
          const shiftStart = new Date(currentDate);
          shiftStart.setHours(shiftStartHour, 0, 0, 0);

          const shiftEnd = new Date(currentDate);
          shiftEnd.setHours(shiftEndHour, 0, 0, 0);

          newEvents.push({
            event_id: `day${outerIndex + 1}-shift${item.shift}-emp${item.employee}`,
            title: `Employee ${item.employee} Shift ${item.shift}`,
            start: shiftStart,
            end: shiftEnd,
            color: colors[item.employee % colors.length],
            admin_id: item.employee,
            editable: true,
          });
        });
      });
    });

    setEvents(newEvents);
};

  return (
    // <div style={{ display: "grid", gridTemplateColumns: "1fr 4fr", height: "100vh" }}>
    //   <div style={{background: "black", maxWidth: "100"}}>
    //     <form onSubmit={handleSubmit} style={{ marginRight: "20px" }}>
    //       <h3>Schedule Settings</h3>
    //       <div>
    //         <label>Number of Employees:</label>
    //         <input
    //           type="number"
    //           name="num_employees"
    //           value={formData.num_employees}
    //           onChange={handleInputChange}
    //         />
    //       </div>
    //       <div>
    //         <label>Shifts per Day:</label>
    //         <input
    //           type="number"
    //           name="shifts_per_day"
    //           value={formData.shifts_per_day}
    //           onChange={handleInputChange}
    //         />
    //       </div>
    //       <div>
    //         <label>Total Days:</label>
    //         <input
    //           type="number"
    //           name="total_days"
    //           value={formData.total_days}
    //           onChange={handleInputChange}
    //         />
    //       </div>
    //       <div>
    //         <h4>Assign Employee Types</h4>
    //         {formData.employee_types.map((type, index) => (
    //           <div key={index}>
    //             <label>Employee {index + 1}:</label>
    //             <select
    //               value={type}
    //               onChange={(e) => handleEmployeeTypeChange(index, e.target.value)}
    //             >
    //               <option value="full_time">Full Time</option>
    //               <option value="part_time">Part Time</option>
    //             </select>
    //           </div>
    //         ))}
    //       </div>
    //       <button type="submit">Generate Schedule</button>
    //     </form>
    //   </div>
    //   <div> 
    //     <Scheduler
    //       events={events}
    //       disableViewer
    //       onEventClick={() => {
    //         console.log("onEventClick");
    //       }}
    //       week={{
    //         weekDays: [0, 1, 2, 3, 4, 5, 6],
    //         weekStartOn: 1,
    //         startHour: 5,
    //         endHour: 24,
    //         step: 60,
    //       }}
    //     />
    //   </div>
    // </div>

    <div className="scheduler-view-container">
      <div className="scheduler-sidebar-and-view"> 
        <div className="employee-setting-sidebar">
          <form onSubmit={handleSubmit} className="schedule-form">
            <h3>Schedule Settings</h3>
            <div>
              <label>Number of Employees:</label>
              <input
                type="number"
                name="num_employees"
                value={formData.num_employees}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Shifts per Day:</label>
              <input
                type="number"
                name="shifts_per_day"
                value={formData.shifts_per_day}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Total Days:</label>
              <input
                type="number"
                name="total_days"
                value={formData.total_days}
                onChange={handleInputChange}
              />
            </div>
            <div className="assign-employee-type">
              <h3>Assign Employee Types</h3>
              {formData.employee_types.map((type, index) => (
                <div key={index}>
                  <label>Employee {index + 1}:</label>
                  <select
                    value={type}
                    onChange={(e) => handleEmployeeTypeChange(index, e.target.value)}
                  >
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                  </select>
                </div>
              ))}
            </div>
            <div className="generate-button">
              <button type="submit">Generate Schedule</button>
            </div>
          </form>
        </div>
        <div className="scheduler-view-only"> 
            <Scheduler
              events={events}
              disableViewer
              onEventClick={() => {
                console.log("onEventClick");
              }}
              week={{
                weekDays: [0, 1, 2, 3, 4, 5, 6],
                weekStartOn: 1,
                startHour: 5,
                endHour: 24,
                step: 100,
              }}
            />
        </div>
      </div>
    </div>
  );
}


//for reference
// export interface WeekProps {
//     weekDays: WeekDays[];
//     weekStartOn: WeekDays;
//     startHour: DayHours;
//     endHour: DayHours;
//     step: number;
//     cellRenderer?(props: CellRenderedProps): JSX.Element;
//     headRenderer?(day: Date): JSX.Element;
//     hourRenderer?(hour: string): JSX.Element;
//     navigation?: boolean;
//     disableGoToDay?: boolean;
// }
