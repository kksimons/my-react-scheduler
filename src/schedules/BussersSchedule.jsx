import React, { useState, useEffect } from "react";
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
  Timestamp,
} from "firebase/firestore";
import { db } from "../userAuth/firebase";
import { useUserStore } from "../stores/useUserStore";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function BussersSchedule() {
  const [events, setEvents] = useState([]);
  const [step, setStep] = useState(240);
  const [formData, setFormData] = useState({
    num_employees: "",
    shifts_per_day: "3",
    total_days: "",
    employee_types: [],
  });
  const [employeeColors, setEmployeeColors] = useState({});
  const [bussers, setBussers] = useState([]);
  const [shiftTimes, setShiftTimes] = useState({
    shift1: { start: "09:00", end: "13:00" },
    shift2: { start: "13:00", end: "17:00" },
    shift3: { start: "17:00", end: "21:00" },
  });

  const { shift1, shift2, shift3 } = shiftTimes;
  const { role } = useUserStore();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  const saveScheduleToFirestore = async (scheduleData) => {
    try {
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
        const fetchedEvents = lastSchedule.events.map((event) => ({
          ...event,
          start: event.start.toDate(),
          end: event.end.toDate(),
        }));
        setEvents(fetchedEvents);
        setEmployeeColors(lastSchedule.employeeColors || {});
      }
    } catch (error) {
      console.error("Error fetching last schedule from Firestore:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Further processing and API calls
    // Save generated events in Firestore
  };

  const exportScheduleToPDF = async () => {
    const schedulerElement = document.getElementById("scheduler");
    if (!schedulerElement) return;
    const canvas = await html2canvas(schedulerElement);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, (canvas.height * 190) / canvas.width);
    pdf.save("Bussers_Schedule.pdf");
  };

  return (
    <div>
      {/* Wrapper for the employee cards */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {bussers.map((employee) => (

            key={employee.id}
            style={{
              padding: "10px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "300px",
              backgroundColor: employeeColors[employee.id] || "#FFFFFF",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            <img src={employee.profilePic} alt={employee.name} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
              <h6>{employee.name}</h6>
              <p style={{ color: "#888" }}>
                {employee.employeeType.charAt(0).toUpperCase() + employee.employeeType.slice(1)}
              </p>

        ))}


        {/* Form and Scheduler */}
        {role === "employer" && (
          <form onSubmit={(e) => e.preventDefault()} style={{ marginBottom: "20px" }}>
            <h6>Schedule Settings</h6>
              <label>Number of Employees</label>
              <input
                type="number"
                name="num_employees"
                value={formData.num_employees}
                onChange={handleInputChange}
                style={{ width: "100%", marginBottom: "10px" }}
              />
              <label>Shifts per Day</label>
              <input
                type="number"
                name="shifts_per_day"
                value={formData.shifts_per_day}
                onChange={handleInputChange}
                style={{ width: "100%", marginBottom: "10px" }}
              />
              <label>Total Days</label>
              <input
                type="number"
                name="total_days"
                value={formData.total_days}
                onChange={handleInputChange}
                style={{ width: "100%", marginBottom: "10px" }}
              />
            <button type="submit" style={{ width: "100%", marginTop: "10px" }}>
              Generate Schedule
            </button>
          </form>
        )}

        {/* Scheduler and PDF Export Button */}
        <div id="scheduler">
          <Scheduler
            events={events}
            disableViewer
            onEventClick={() => console.log("onEventClick")}
            week={{
              weekDays: [0, 1, 2, 3, 4, 5, 6],
              weekStartOn: 1,
              startHour: 9,
              endHour: 24,
              step: step,
            }}
          />
        </div>

      <button onClick={exportScheduleToPDF} style={{ marginTop: "20px" }}>
        Export Schedule as PDF
      </button>
    </div>
    </div>
  );

}

export default BussersSchedule;