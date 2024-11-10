import { useState, useEffect, Fragment, useRef } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
// import { db } from "@userAuth/firebase";
import { Timestamp } from "firebase/firestore";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaTableColumns } from "react-icons/fa6";
import { MdTableRows } from "react-icons/md";

  // // Define the form submission handler
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const payload = {
  //     num_employees: servers.length, // Number of servers
  //     shifts_per_day: parseInt(formData.shifts_per_day, 10),
  //     total_days: parseInt(formData.total_days, 10),
  //     employee_types: servers.map((employee) => employee.workType), // Employee types
  //   };

  //   try {
  //     const response = await fetch("http://localhost:80/api/v1/scheduler", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await response.json();

  //     if (!data.schedules || !Array.isArray(data.schedules)) {
  //       throw new Error("No schedules found in API response.");
  //     }

  //     const newEvents: Event[] = [];
  //     const newEmployeeColors: { [key: string]: string } = {}; // Temporary object to store colors

  //     // Map the employee index from the API to the actual userId from Firestore
  //     const employeeIdMapping = servers.reduce(
  //       (acc, server, index) => ({ ...acc, [index]: server.id }),
  //       {}
  //     );

import type { SchedulerRef } from "@aldabil/react-scheduler/types"
import React from "react";
// import db from "@userAuth/firebase";

export function ServersSchedule() {
  

  return (
    <Scheduler
        view="month"
        events={[
          {
            event_id: 1,
            title: "Event 1",
            start: new Date("2021/5/2 09:30"),
            end: new Date("2021/5/2 10:30"),
          },
          {
            event_id: 2,
            title: "Event 2",
            start: new Date("2021/5/4 10:00"),
            end: new Date("2021/5/4 11:00"),
          },
        ]}
    />
  );

}
export default ServersSchedule;