import React, { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import courseData from "./data/courseDefaultsAll.json";
import "./ClassesPage.css";
import { CircularProgress } from "@mui/material";
import { ApiResponse, Course, Event } from "./utils/types";
import Schedule from "./Components/Schedule";
import Toolbar from "./Components/Toolbar";
import SectionDisplay from "./Components/SectionDisplay";
import { FiRefreshCw, FiDownload, FiMail } from "react-icons/fi";
import html2canvas from "html2canvas";

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
  "Web Development 2": "#2ecc71",
  "Database Programming": "#f1c40f",
  "Software Projects: Analysis, Design and Management": "#9b59b6",
};

const ClassesPage: React.FC = () => {
  const [tool, setTool] = useState("class");
  const [init, setInit] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  const handleClassSelection = (course: string) => {
    setSelectedClasses((prev) =>
      prev.includes(course)
        ? prev.filter((c) => c !== course)
        : [...prev, course]
    );
  };

  const selectedSections = selectedClasses.reduce((acc, className) => {
    const course = courseData.find((c: Course) => c.course === className);
    if (course) {
      acc[className] = course.sections;
    }
    return acc;
  }, {} as { [courseName: string]: Course["sections"] });

  const handleSubmit = async () => {
    setLoading(true);
    const submissionData = selectedClasses
      .map((courseName) => {
        const course = courseData.find((c: Course) => c.course === courseName);
        return course
          ? { course: course.course, sections: course.sections }
          : null;
      })
      .filter((course) => course !== null);

    try {
      const response = await fetch(
        "http://localhost:80/api/v1/class-scheduler",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courses: submissionData }),
        }
      );

      if (response.ok) {
        const data: ApiResponse = await response.json();
        setEvents(parseApiResponse(data));
      } else {
        alert("Failed to submit schedule.");
      }
    } catch (error) {
      console.error("Error submitting schedule:", error);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const parseApiResponse = (data: ApiResponse): Event[] => {
    const dayOfWeekMap: { [key: string]: number } = {
      M: 1,
      Tu: 2,
      W: 3,
      Th: 4,
      F: 5,
    };
    const referenceDate = new Date("2024-11-25T00:00:00");

    return data.schedules
      .flatMap((schedule, index) => {
        return (["day1", "day2"] as const).map((dayKey) => {
          const dayInfo = schedule[dayKey];
          const dayOfWeek =
            dayOfWeekMap[dayInfo.day as keyof typeof dayOfWeekMap];
          if (dayOfWeek === undefined) return null;

          const startDate = new Date(referenceDate);
          startDate.setDate(referenceDate.getDate() + dayOfWeek - 1);
          const [startHour, startMinute] = dayInfo.start.split(":").map(Number);
          startDate.setHours(startHour, startMinute);

          const endDate = new Date(startDate);
          const [endHour, endMinute] = dayInfo.end.split(":").map(Number);
          endDate.setHours(endHour, endMinute);

          const courseName = schedule.course.replace(/^[A-Z]+\s+\d+\s+/, "");
          const format =
            dayInfo.format === "online" ? " (Online)" : " (In-Person)";

          return {
            event_id: `${index}-${dayKey}`,
            title: `${courseName}${format} - ${schedule.professor}`,
            start: startDate,
            end: endDate,
            color: colorMapping[courseName] || "#000",
          };
        });
      })
      .filter((event): event is Event => event !== null);
  };

  useEffect(() => {
    initParticlesEngine(loadSlim).then(() => setInit(true));
  }, []);

  // seems to load quickly, the example had it so I kept just in case I guess, not that it's pretty to look at if it's loading I imagine
  if (!init)
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "50px" }}>
        Loading particles...
      </div>
    );

  // using html2cavas like Mitchell had set up before to send just the scheduler component (point it at class)
  const handleDownload = async () => {
    const scheduleElement = document.querySelector(
      ".schedule-container"
    ) as HTMLElement;
    if (scheduleElement) {
      const canvas = await html2canvas(scheduleElement);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "schedule.png";
      link.click();
    }
  };

  // mailto doesn't let us attach the file, but we can remind them to I guess?
  const handleEmail = async () => {
    const email = prompt("Enter the email address:");
    if (email) {
      const subject = encodeURIComponent("Your Schedule");
      const body = encodeURIComponent(
        "Remember to download and attach the schedule you created!"
      );
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Particles
        id="tsparticles"
        options={{
          background: { color: { value: "#000000" } },
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
            move: { enable: true, speed: 6 },
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
        }}
      />

      <div style={{ position: "relative", zIndex: 1, padding: "20px" }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <CircularProgress />
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="schedule-container">
              <Schedule
                events={events}
                onEventClick={(event) =>
                  alert(`Clicked on event: ${event.title}`)
                }
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => window.location.reload()}
                className="action-button"
              >
                <FiRefreshCw size={20} />
              </button>
              <button onClick={handleDownload} className="action-button">
                <FiDownload size={20} />
              </button>
              <button onClick={handleEmail} className="action-button">
                <FiMail size={20} />
              </button>
            </div>
          </>
        ) : (
          <>
            <Toolbar
              tool={tool}
              setTool={setTool}
              selectedClasses={selectedClasses}
              handleClassSelection={handleClassSelection}
              handleSubmit={handleSubmit} // Pass handleSubmit as a prop now so we can get the animation
            />
            {tool === "section" && selectedClasses.length > 0 && (
              <SectionDisplay sections={selectedSections} />
            )}
            {tool === "submit" && (
              <button onClick={handleSubmit}>Submit Schedule</button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ClassesPage;
