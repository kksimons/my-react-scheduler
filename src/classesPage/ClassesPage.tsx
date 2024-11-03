import React, { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import Button from "@mui/material/Button";

// cribbed from: https://codepen.io/matteobruni/pen/ZEWbYzj


import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
} from "@mui/material";
import { IoMdAddCircleOutline } from "react-icons/io";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import courseDefaults from "./courseDefaults.json"; // Import default data

type DayInfo = {
  day: string;
  start: string;
  end: string;
  format: string;
};

type Section = {
  day1: DayInfo;
  day2: DayInfo;
  professor: string;
};

type Course = {
  course: string;
  sections: Section[];
};

const ClassesPage: React.FC = () => {
  const [init, setInit] = useState(false);
  const [scheduleData, setScheduleData] = useState<Course[]>([]);

  const courseOptions = [
    "CPRG 305 Software Testing and Deployment",
    "CPSY 300 Operating Systems",
    "INTP 302 Emerging Trends in Software Development",
    "ITSC 320 Software Security",
    "PROJ 309 Capstone Project",
  ];

  const daysOptions = [
    { label: "M", value: "M" },
    { label: "Tu", value: "Tu" },
    { label: "W", value: "W" },
    { label: "Th", value: "Th" },
    { label: "F", value: "F" },
    { label: "S", value: "S" },
  ];

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
    setScheduleData(courseDefaults); // Load default schedule data from JSON
  }, []);

  const handleToggle = (
    classIndex: number,
    sectionIndex: number,
    dayKey: "day1" | "day2",
    day: string
  ) => {
    setScheduleData((prev) => {
      const newSchedule = [...prev];
      newSchedule[classIndex].sections[sectionIndex][dayKey].day = day;
      return newSchedule;
    });
  };

  const handleTimeChange = (
    classIndex: number,
    sectionIndex: number,
    dayKey: "day1" | "day2",
    timeKey: "start" | "end",
    value: string
  ) => {
    setScheduleData((prev) => {
      const newSchedule = [...prev];
      newSchedule[classIndex].sections[sectionIndex][dayKey][timeKey] = value;
      return newSchedule;
    });
  };

  const handleFormatChange = (
    classIndex: number,
    sectionIndex: number,
    dayKey: "day1" | "day2",
    value: string
  ) => {
    setScheduleData((prev) => {
      const newSchedule = [...prev];
      newSchedule[classIndex].sections[sectionIndex][dayKey].format = value;
      return newSchedule;
    });
  };

  const handleSave = () => {
    localStorage.setItem("savedScheduleData", JSON.stringify(scheduleData));
    alert("Data saved locally as JSON.");
  };

  const handleSubmit = () => {
    console.log("Schedule Data:", scheduleData);
  };

  if (!init) {
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "50px" }}>
        Loading particles...
      </div>
    );
  }

  const handleAddSection = (courseIndex: number) => {
    setScheduleData((prev) => {
      const newSchedule = [...prev];
      newSchedule[courseIndex].sections.push({
        day1: { day: "", start: "", end: "", format: "in-person" },
        day2: { day: "", start: "", end: "", format: "online" },
        professor: "",
      });
      return newSchedule;
    });
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        backgroundColor: "#000000",
      }}
    >
      <Particles
        id="tsparticles"
        options={{
          background: { color: { value: "#000000" } },
          fpsLimit: 60,
          particles: {
            number: { value: 160, density: { enable: true, area: 800 } },
            color: { value: "#ff0000" },
            links: {
              enable: true,
              distance: 100,
              color: "#ffffff",
              opacity: 0.4,
              width: 1,
            },
            move: { enable: true, speed: 6, direction: "none" },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
            },
            modes: { repulse: { distance: 200 }, push: { quantity: 4 } },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: 1,
        }}
      />
      <TableContainer
        style={{
          zIndex: 2,
          position: "relative",
          margin: "20px auto",
          maxWidth: "90%",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Section</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Format</TableCell>
              <TableCell>Professor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scheduleData.map((course, courseIndex) => (
              <React.Fragment key={`course-${courseIndex}`}>
                <TableRow>
                  <TableCell colSpan={5}>
                    <FormControl fullWidth>
                      <InputLabel>Course</InputLabel>
                      <Select
                        value={course.course}
                        onChange={(e) =>
                          setScheduleData((prev) => {
                            const updated = [...prev];
                            updated[courseIndex].course = e.target
                              .value as string;
                            return updated;
                          })
                        }
                      >
                        {courseOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
                {course.sections.map((section, sectionIndex) =>
                  ["day1", "day2"].map((dayKey) => (
                    <TableRow key={`${courseIndex}-${sectionIndex}-${dayKey}`}>
                      <TableCell>{`Section ${sectionIndex + 1} - ${
                        section[dayKey as "day1" | "day2"].day
                      }`}</TableCell>
                      <TableCell>
                        <ToggleButtonGroup
                          exclusive
                          value={section[dayKey as "day1" | "day2"].day}
                          onChange={(_, day) =>
                            handleToggle(
                              courseIndex,
                              sectionIndex,
                              dayKey as "day1" | "day2",
                              day
                            )
                          }
                        >
                          {daysOptions.map((day) => (
                            <ToggleButton key={day.value} value={day.value}>
                              {day.label}
                            </ToggleButton>
                          ))}
                        </ToggleButtonGroup>
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="time"
                          value={section[dayKey as "day1" | "day2"].start}
                          onChange={(e) =>
                            handleTimeChange(
                              courseIndex,
                              sectionIndex,
                              dayKey as "day1" | "day2",
                              "start",
                              e.target.value
                            )
                          }
                          style={{ marginBottom: "8px" }}
                        />
                        <TextField
                          type="time"
                          value={section[dayKey as "day1" | "day2"].end}
                          onChange={(e) =>
                            handleTimeChange(
                              courseIndex,
                              sectionIndex,
                              dayKey as "day1" | "day2",
                              "end",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <ToggleButtonGroup
                          exclusive
                          value={section[dayKey as "day1" | "day2"].format}
                          onChange={(_, format) =>
                            handleFormatChange(
                              courseIndex,
                              sectionIndex,
                              dayKey as "day1" | "day2",
                              format
                            )
                          }
                        >
                          <ToggleButton value="in-person">
                            In-Person
                          </ToggleButton>
                          <ToggleButton value="online">Online</ToggleButton>
                        </ToggleButtonGroup>
                      </TableCell>
                      {dayKey === "day1" && (
                        <TableCell rowSpan={2}>
                          <TextField
                            value={section.professor}
                            onChange={(e) =>
                              setScheduleData((prev) => {
                                const updated = [...prev];
                                updated[courseIndex].sections[
                                  sectionIndex
                                ].professor = e.target.value;
                                return updated;
                              })
                            }
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
                {/* Add Section Button */}
                <TableRow>
                  <TableCell colSpan={5} style={{ textAlign: "center" }}>
                    <IconButton onClick={() => handleAddSection(courseIndex)}>
                      <AiOutlinePlus />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "20px",
          }}
        >
          <Button
            variant="contained"
            onClick={handleSave}
            style={{ backgroundColor: "#000", color: "#fff" }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            style={{ backgroundColor: "#000", color: "#fff" }}
          >
            Submit
          </Button>
        </div>
      </TableContainer>
    </div>
  );
};

export default ClassesPage;
