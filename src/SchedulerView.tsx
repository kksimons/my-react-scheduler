// App.tsx

import { useState } from "react";
import { Scheduler } from "@aldabil/react-scheduler";

// possible colors for an event to get assigned when it comes in
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

export default function SchedulerView() {
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

    if (name === "num_employees") {
      const numEmployees = parseInt(value, 10) || 0;
      setFormData({
        ...formData,
        num_employees: value,
        employee_types: new Array(numEmployees).fill("full_time"),
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      num_employees: parseInt(formData.num_employees, 10),
      shifts_per_day: parseInt(formData.shifts_per_day, 10),
      total_days: parseInt(formData.total_days, 10),
      employee_types: formData.employee_types,
    };

    const response = await fetch("http://localhost:80/api/v1/scheduler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log(data);

    const newEvents: Event[] = [];

    data.schedules.forEach((dayObj: any, outerIndex: number) => {
      Object.keys(dayObj).forEach((dayKey, dayIndex) => {
        const shifts = dayObj[dayKey];
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + dayIndex);

        shifts.forEach((item: any) => {
          const shiftStartHour = item.shift === 0 ? 6 : 12;
          const shiftEndHour = item.shift === 0 ? 12 : 17;

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
    <div className="flex h-screen">
      {/* Employee Settings - Left side (20%) */}
      <div className="w-1/5 p-4 bg-gray-100">
        <form onSubmit={handleSubmit}>
          <h3 className="text-xl font-semibold mb-4">Schedule Settings</h3>
          <div className="mb-4">
            <label className="block mb-1">Number of Employees:</label>
            <input
              type="number"
              name="num_employees"
              value={formData.num_employees}
              onChange={handleInputChange}
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Shifts per Day:</label>
            <input
              type="number"
              name="shifts_per_day"
              value={formData.shifts_per_day}
              onChange={handleInputChange}
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Total Days:</label>
            <input
              type="number"
              name="total_days"
              value={formData.total_days}
              onChange={handleInputChange}
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
          </div>
          <div>
            <h4 className="text-lg font-medium mb-2">Assign Employee Types</h4>
            {formData.employee_types.map((type, index) => (
              <div key={index} className="mb-2">
                <label className="block">Employee {index + 1}:</label>
                <select
                  value={type}
                  onChange={(e) => handleEmployeeTypeChange(index, e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                </select>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Generate Schedule
          </button>
        </form>
      </div>

      {/* Scheduler - Right side (80%) */}
      <div className="w-4/5 p-4">
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
            step: 60,
          }}
        />
      </div>
    </div>
  );
}
