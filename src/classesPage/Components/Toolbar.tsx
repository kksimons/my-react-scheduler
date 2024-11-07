import React, { useState } from "react";
import { Course } from "../utils/types";
import courseData from "../data/courseDefaultsAll.json";

interface ToolbarProps {
  tool: string;
  setTool: (tool: string) => void;
  selectedClasses: string[];
  handleClassSelection: (course: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  setTool,
  selectedClasses,
  handleClassSelection,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="toolbar">
      <button
        aria-label="Classes"
        onClick={() => {
          setTool("class");
          toggleDropdown();
        }}
      >
        <svg width="16" height="16">
          <use href="#class" />
        </svg>
        <span>Classes</span>
      </button>
      <button aria-label="Section" onClick={() => setTool("section")}>
        <svg width="16" height="16">
          <use href="#section" />
        </svg>
        <span>Section</span>
      </button>
      <button aria-label="Submit" onClick={() => setTool("submit")}>
        <svg width="16" height="16">
          <use href="#submit" />
        </svg>
        <span>Submit</span>
      </button>

      {tool === "class" && (
        <div className={`dropdown ${dropdownOpen ? "dropdown-open" : "dropdown-closed"}`}>
          {courseData.map((course: Course) => (
            <div
              key={course.course}
              className={`dropdown-item ${selectedClasses.includes(course.course) ? "highlighted" : ""}`}
              onClick={() => handleClassSelection(course.course)}
            >
              {course.course}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Toolbar;
