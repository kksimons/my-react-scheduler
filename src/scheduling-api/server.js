

const express = require('express');
const moment = require('moment');
const cors = require('cors');

const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());

let employees = [];
let schedules = [];

// Helper functions 
const getMaxHours = (employeeType) => {
    employeeType === "Full-Time" ? 40 : 24;
}

const hasOverlappingSchedule = (employeeId, start, end) => {
    return schedules.some(schedule => 
      schedule.employeeId === employeeId &&
      ((moment(start).isBetween(schedule.start, schedule.end, null, '[]')) ||
       (moment(end).isBetween(schedule.start, schedule.end, null, '[]')) ||
       (moment(schedule.start).isBetween(start, end, null, '[]')))
    );
  };

  // API Endpoints
  app.post('/api/employees', (req, res) => {
    const newEmployee = req.body();
    employees.push(newEmployee);
    res.status(201).json(newEmployee);
  })

  app.get('/api/generate-schedule', (req, res) => {
    const { numberOfWeeks, employeePerDay, isKitchen } = req.body;
    const positions = isKitchen ? ["Cook"] : ["Server", "Busser", "Host"];
    const scheduleStartDate = moment().startOf("week").add(1, "weeks");
    const scheduleEndDate = moment(scheduleStartDate).add(numberOfWeeks, "weeks");
    const newEvents = [];   
  })