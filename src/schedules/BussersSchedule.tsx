import { useState, useEffect } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Paper,
} from "@mui/material";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../userAuth/firebase"; // Import Firebase Firestore instance
import { useUserStore } from "../stores/useUserStore"; // Zustand store to access user role
import { Timestamp } from "firebase/firestore";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
  admin_id: string; // Use `userId` which is a string in Firestore
  editable: boolean;
}

export default function BussersSchedule() {
  const [events, setEvents] = useState<Event[]>([]);
  const [step, setStep] = useState(240); // Default step for 3 shifts
  const [formData, setFormData] = useState<FormData>({
    num_employees: "",
    shifts_per_day: "3", // Default to 3 shifts
    total_days: "",
    employee_types: [],
  });
  const [employeeColors, setEmployeeColors] = useState<{ [key: string]: string }>({});
  const [bussers, setBussers] = useState<any[]>([]);
  const [shiftTimes, setShiftTimes] = useState({
    shift1: { start: "09:00", end: "13:00" },
    shift2: { start: "13:00", end: "17:00" },
    shift3: { start: "17:00", end: "21:00" },
  });

  const { shift1, shift2, shift3 } = shiftTimes;
  const { role } = useUserStore(); // Zustand store to get user role

  // Fetch busser data from Firestore
  useEffect(() => {
    const fetchBussers = async () => {
      try {
        const bussersQuery = query(
          collection(db, "employees"),
          where("employeeType", "==", "busser")
        );
        const querySnapshot = await getDocs(bussersQuery);
        const fetchedBussers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBussers(fetchedBussers);
        setFormData((prev) => ({
          ...prev,
          num_employees: fetchedBussers.length.toString(),
          employee_types: fetchedBussers.map(() => "full_time"),
        }));
        await fetchLastScheduleFromFirestore();
      } catch (error) {
        console.error("Error fetching bussers from Firestore:", error);
      }
    };
    fetchBussers();
  }, []);

  useEffect(() => {
    if (formData.shifts_per_day === "2") {
      setStep(360);
      setShiftTimes({
        shift1: { start: "09:00", end: "15:00" },
        shift2: { start: "15:00", end: "21:00" },
        shift3: { start: "", end: "" },
      });
    } else if (formData.shifts_per_day === "3") {
      setStep(240);
      setShiftTimes({
        shift1: { start: "09:00", end: "13:00" },
        shift2: { start: "13:00", end: "17:00" },
        shift3: { start: "17:00", end: "21:00" },
      });
    }
  }, [formData.shifts_per_day]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const saveScheduleToFirestore = async (scheduleData: {
    events: Event[];
    employeeColors: { [key: string]: string };
  }) => {
    try {
      if (!scheduleData.events || !Array.isArray(scheduleData.events)) {
        throw new Error("Invalid event data. No events to save.");
      }

      const scheduleCollectionRef = collection(db, "busserSchedules");
      const eventsWithTimestamp = scheduleData.events.map((event) => ({
        ...event,
        start: Timestamp.fromDate(new Date(event.start)),
        end: Timestamp.fromDate(new Date(event.end)),
      }));

      await addDoc(scheduleCollectionRef, {
        events: eventsWithTimestamp,
        employeeColors: scheduleData.employeeColors,
        timestamp: Timestamp.now(),
      });
      console.log("Schedule saved for bussers.");
    } catch (error) {
      console.error("Error saving schedule to Firestore:", error);
    }
  };

  const fetchLastScheduleFromFirestore = async () => {
    try {
      const scheduleQuery = query(
        collection(db, "busserSchedules"),
        orderBy("timestamp", "desc"),
        limit(1)
      );

      const querySnapshot = await getDocs(scheduleQuery);
      if (!querySnapshot.empty) {
        const lastSchedule = querySnapshot.docs[0].data();
        const fetchedEvents = lastSchedule.events.map((event: any) => {
          const startDate = event.start.toDate();
          const endDate = event.end.toDate();
          return {
            ...event,
            start: startDate,
            end: endDate,
          };
        });

        setEvents(fetchedEvents);
        setEmployeeColors(lastSchedule.employeeColors || {});
        console.log("Fetched last schedule from Firestore:", lastSchedule);
      } else {
        console.log("No previous schedule found.");
      }
    } catch (error) {
      console.error("Error fetching last schedule from Firestore:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      num_employees: bussers.length,
      shifts_per_day: parseInt(formData.shifts_per_day, 10),
      total_days: parseInt(formData.total_days, 10),
      employee_types: bussers.map((employee) => employee.workType),
    };

    const response = await fetch("http://localhost:80/api/v1/scheduler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const newEvents: Event[] = [];
    const newEmployeeColors: { [key: string]: string } = {};

    const employeeIdMapping = bussers.reduce(
      (acc, busser, index) => ({ ...acc, [index]: busser.id }),
      {}
    );

    data.schedules.forEach((dayObj: any, outerIndex: number) => {
      Object.keys(dayObj).forEach((dayKey, dayIndex) => {
        const shifts = dayObj[dayKey];
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + dayIndex);

        shifts.forEach((item: any, shiftIndex: number) => {
          let shiftStartHour, shiftEndHour;

          if (item.shift === 0) {
            shiftStartHour = shift1.start;
            shiftEndHour = shift1.end;
          } else if (item.shift === 1) {
            shiftStartHour = shift2.start;
            shiftEndHour = shift2.end;
          } else if (item.shift === 2 && formData.shifts_per_day === "3") {
            shiftStartHour = shift3.start;
            shiftEndHour = shift3.end;
          } else {
            return;
          }

          const shiftStart = new Date(currentDate);
          const [startHour, startMinute] = shiftStartHour.split(":");
          shiftStart.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

          const shiftEnd = new Date(currentDate);
          const [endHour, endMinute] = shiftEndHour.split(":");
          shiftEnd.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

          const employeeId = employeeIdMapping[item.employee];
          const uniqueEventId = `day${outerIndex + 1}-shift${item.shift}-emp${employeeId}-${shiftIndex}`;

          const newEvent: Event = {
            event_id: uniqueEventId,
            title: `${bussers[employeeId].name} - ${shiftStartHour} - ${shiftEndHour}`,
            start: shiftStart,
            end: shiftEnd,
            color: generateRandomColor(),
            admin_id: "userId", // Replace with actual user ID if needed
            editable: true,
          };

          newEvents.push(newEvent);
          newEmployeeColors[employeeId] = newEvent.color || generateRandomColor();
        });
      });
    });

    setEvents(newEvents);
    setEmployeeColors(newEmployeeColors);
    await saveScheduleToFirestore({ events: newEvents, employeeColors: newEmployeeColors });
  };

  const exportScheduleToPDF = async () => {
    const input = document.getElementById("schedule");
    if (input) {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      const imgWidth = 190; // Adjust the width according to your PDF layout
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("schedule.pdf");
    } else {
      console.error("Schedule container not found!");
    }
  };

  return (
    <div>
      {/* Render Cook Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
        {bussers.map((employee) => (
          <Paper
            key={employee.id}
            elevation={3}
            sx={{
              padding: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: "300px",
              backgroundColor: employeeColors[employee.id] || "#FFFFFF",
            }}
          >
            <Avatar
              src={employee.profilePic}
              alt={employee.name}
              sx={{ width: 56, height: 56 }}
            />
            <Box>
              <Typography variant="h6">{employee.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {employee.employeeType.charAt(0).toUpperCase() +
                  employee.employeeType.slice(1)}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Only show the form for managers (role === "employer") */}
      {role === "employer" && (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Number of Employees"
            name="num_employees"
            value={formData.num_employees}
            onChange={handleInputChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Shifts per Day"
            name="shifts_per_day"
            value={formData.shifts_per_day}
            onChange={handleInputChange}
            select
            fullWidth
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
          </TextField>
          <TextField
            label="Total Days"
            name="total_days"
            value={formData.total_days}
            onChange={handleInputChange}
            type="number"
            fullWidth
            margin="normal"
          />
                   <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "20px" }}
            fullWidth
          >
            Generate Schedule
          </Button>
        </form>
      )}

      <div id="schedule" style={{ marginTop: "20px" }}>
        <Scheduler
          events={events}
          disableViewer
          onEventClick={() => {
            console.log("onEventClick");
          }}
          week={{
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            weekStartOn: 1,
            startHour: 9,
            endHour: 24,
            step: step,
          }}
        />
      </div>

      <Button
        variant="contained"
        color="secondary"
        onClick={exportScheduleToPDF}
        style={{ marginTop: "20px" }}
      >
        Export Schedule as PDF
      </Button>

    </div>
  );
}
