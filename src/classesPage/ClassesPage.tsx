import React, { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import Button from "@mui/material/Button";
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
import { AiOutlinePlus } from "react-icons/ai";
import courseDefaults from "./courseDefaults3.json";
import { Scheduler } from "@aldabil/react-scheduler";

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

type ApiResponse = {
  schedules: {
    course: string;
    day1: DayInfo;
    day2: DayInfo;
    professor: string;
  }[];
};

interface Event {
  event_id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
}

// hardcoding these for now
const colorMapping: { [key: string]: string } = {
  "Software Testing and Deployment": "#3498db",
  "Operating Systems": "#e74c3c",
  "Emerging Trends in Software Development": "#2ecc71",
  "Software Security": "#f1c40f",
  "Capstone Project": "#9b59b6",
  "Technical Communcations I": "#3498db",
  "Introduction to Network Systems": "#e74c3c",
  "Web Development 1": "#2ecc71",
  "Object-Oriented Programming 1": "#f1c40f",
  "Mathematics for Technolgists": "#9b59b6",
  "Object-Oriented Programming 2": "#3498db",
  "Database Design and Programming": "#e74c3c",
  "Software Analysis and Design": "#2ecc71",
  "User Experience and Design": "#f1c40f",
  "Critical Thinking": "#9b59b6",
  "Mobile Application Development": "#3498db",
  "Object-Oriented Programming 3": "#e74c3c",
  "Web Development 3": "#2ecc71",
  "Database Programming": "#f1c40f",
  "Software Projects: Analysis, Design, and Management": "#9b59b6",
};

const ClassesPage: React.FC = () => {
  const [init, setInit] = useState(false);
  const [scheduleData, setScheduleData] = useState<Course[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [excludeWeekend, setExcludeWeekend] = useState<boolean>(true); // Default to exclude weekends

  const dayOfWeekMap: { [key: string]: number } = {
    M: 1,
    Tu: 2,
    W: 3,
    Th: 4,
    F: 5,
    S: 6,
    Su: 0,
  };

  //hardcoding these for now
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
    setScheduleData(courseDefaults); // we're loading hardcoded data for now
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

  const handleSubmit = async () => {
    console.log(
      "Submitting data to API:",
      JSON.stringify({ courses: scheduleData, exclude_weekend: excludeWeekend }, null, 2)
    );

    try {
      const response = await fetch(
        "http://localhost:80/api/v1/class-scheduler",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courses: scheduleData, exclude_weekend: excludeWeekend }),
        }
      );

      if (response.ok) {
        const result: ApiResponse = await response.json();
        console.log(
          "Received response from API:", 
          JSON.stringify(result, null, 2)
        );
        alert("Schedule submitted successfully!");

        // Parse response to event format
        const parsedEvents = result.schedules
          .flatMap((scheduleEntry, index) => {
            return ["day1", "day2"].map((dayKey) => {
              const { day, start, end, format } =
                scheduleEntry[dayKey as "day1" | "day2"];
              const dayOfWeek = dayOfWeekMap[day];

              if (dayOfWeek === undefined) {
                console.warn(
                  `Invalid day value: ${day} in entry key: ${scheduleEntry.course}`
                );
                return null; // Skip invalid day entries
              }

              // Set a fixed reference date (e.g., 2024-11-04, which is a Monday)
              const referenceDate = new Date("2024-11-04T00:00:00");
              const startDate = new Date(referenceDate);
              startDate.setDate(referenceDate.getDate() + dayOfWeek - 1);
              const [startHour, startMinute] = start.split(":").map(Number);
              startDate.setHours(startHour, startMinute);

              const endDate = new Date(startDate);
              const [endHour, endMinute] = end.split(":").map(Number);
              endDate.setHours(endHour, endMinute);

              // let's get rid of the course code and put whether it's online or not in the title
              const courseName = scheduleEntry.course.replace(/^[A-Z]+\s+\d+\s+/,'');
              const isOnline = format === "online" ? " (Online)" : " (In-Person)";

              console.log(
                `Parsed Event - Course: ${courseName}, Day: ${day}, Start: ${startDate}, End: ${endDate}`
              );

              return {
                event_id: `${index}-${dayKey}`,
                title: `${courseName}${isOnline} - ${scheduleEntry.professor}`,
                start: startDate,
                end: endDate,
                color: colorMapping[courseName] || "#000000", // default to black I guess?
              } as Event;
            });
          })
          .filter((event): event is Event => event !== null);

        setEvents(parsedEvents);
      } else {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        alert(`Failed to submit schedule: ${response.status}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while submitting the schedule.");
    }
  };

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

  if (!init) {
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "50px" }}>
        Loading particles...
      </div>
    );
  }

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
            number: { value: 160, density: { enable: true } },
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
        {/* Form Inputs */}
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
                            updated[courseIndex].course = e.target.value as string;
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
                          <ToggleButton value="in-person">In-Person</ToggleButton>
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

        {/* Weekend Toggle */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <ToggleButtonGroup
            value={excludeWeekend}
            exclusive
            onChange={(_, value) => {
              if (value !== null) {
                setExcludeWeekend(value);
              }
            }}
          >
            <ToggleButton value={true}>Exclude Weekends</ToggleButton>
            <ToggleButton value={false}>Include Weekends</ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div style={{ marginTop: "20px" }}>
          <Scheduler
            events={events}
            view="week"
            onEventClick={(event) => alert(`Clicked on event: ${event.title}`)}
            week={{
              weekDays: [0, 1, 2, 3, 4, 5],
              weekStartOn: 1,
              startHour: 7,
              endHour: 20,
              step: 60,
            }}
          />
        </div>
      </TableContainer>
    </div>
  );
};

export default ClassesPage;
