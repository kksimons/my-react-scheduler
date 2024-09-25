import { useState } from "react";
import { Scheduler } from "@aldabil/react-scheduler";

// Define a type for your form data
interface FormData {
  num_employees: string;
  shifts_per_day: string;
  total_days: string;
  employee_types: string[];
}

// Define a type for the events
interface Event {
  event_id: string;
  title: string;
  start: Date;
  end: Date;
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
        employee_types: new Array(numEmployees).fill("full_time"),  // Default to full_time
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle changes in the employee types
  const handleEmployeeTypeChange = (index: number, value: string) => {
    const updatedEmployeeTypes = [...formData.employee_types];
    updatedEmployeeTypes[index] = value;
    setFormData({
      ...formData,
      employee_types: updatedEmployeeTypes,
    });
  };

  // Define the type for the form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const payload = {
      num_employees: parseInt(formData.num_employees, 10),
      shifts_per_day: parseInt(formData.shifts_per_day, 10),
      total_days: parseInt(formData.total_days, 10),
      employee_types: formData.employee_types,
    };
    
    // Make the POST request to the API
    const response = await fetch("http://localhost:80/api/v1/scheduler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Convert the API response to scheduler events
    const newEvents: Event[] = [];
    const schedules = data.schedules[0];

    Object.keys(schedules).forEach((day, index) => {
      schedules[day].forEach((shift: any) => {
        newEvents.push({
          event_id: `${day}-${shift.shift}`,
          title: `Employee ${shift.employee} Shift ${shift.shift}`,
          start: new Date(new Date().setDate(new Date().getDate() + index)),
          end: new Date(new Date().setDate(new Date().getDate() + index + 1)),
        });
      });
    });

    setEvents(newEvents); // Update the Scheduler with the new events
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <form onSubmit={handleSubmit} style={{ marginRight: "20px" }}>
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
        <div>
          <h4>Assign Employee Types</h4>
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
        <button type="submit">Generate Schedule</button>
      </form>

      <Scheduler
        events={events} // We now use dynamic events from API response
        disableViewer
        onEventClick={() => {
          console.log("onEventClick");
        }}
      />
    </div>
  );
}
