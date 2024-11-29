import React, { useState } from "react";
import { Course } from "../utils/types";
import courseData from "../data/courseDefaultsAll.json";
import { IoIosArrowDown, IoIosArrowForward, IoIosSend } from "react-icons/io";
import "../ClassesPage.css";

interface ToolbarProps {
  tool: string;
  setTool: (tool: string) => void;
  selectedClasses: string[];
  handleClassSelection: (course: string) => void;
  handleSubmit: () => void; // Include handleSubmit prop
}

const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  setTool,
  selectedClasses,
  handleClassSelection,
  handleSubmit,
}) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleExpandRow = (course: string) => {
    setExpandedRows((prev) =>
      prev.includes(course)
        ? prev.filter((row) => row !== course)
        : [...prev, course]
    );
  };

  return (
    <div className="toolbar-container">
      {/* Classes Button */}
      {/* <button
        className={`icon-button ${tool === "class" ? "active" : ""}`}
        onClick={() => setTool("class")}
      >
        Classes
      </button> */}


      {tool === "class" && (
        <div className="class-list">
          {courseData.map((course: Course) => (
            <div
              key={course.course}
              className={`class-row ${
                selectedClasses.includes(course.course) ? "highlighted" : ""
              }`}
            >
              <div
                className="class-header"
                onClick={() => handleClassSelection(course.course)}
              >
                <span>{course.course}</span>
                <button
                  className="arrow-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpandRow(course.course);
                  }}
                >
                  {expandedRows.includes(course.course) ? (
                    <IoIosArrowDown />
                  ) : (
                    <IoIosArrowForward />
                  )}
                </button>
              </div>
              {expandedRows.includes(course.course) && (
                <div className="class-sections">
                  {course.sections.map((section, index) => (
                    <div key={index} className="section-detail">
                      <p>
                        Day 1: {section.day1.day}, {section.day1.start} -{" "}
                        {section.day1.end} ({section.day1.format})
                      </p>
                      <p>
                        Day 2: {section.day2.day}, {section.day2.start} -{" "}
                        {section.day2.end} ({section.day2.format})
                      </p>
                      <p>Professor: {section.professor}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      {/* Submit Button */}
      <button
        className="submit-button"
        onClick={handleSubmit}
      >
        <IoIosSend size={20} />
        <span>Submit</span>
      </button>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
