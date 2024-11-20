import React, { useState, useRef } from "react";
import { Course } from "../utils/types";
import courseData from "../data/courseDefaultsAll.json";
import { SiGoogleclassroom } from "react-icons/si";
import { TbPuzzleFilled } from "react-icons/tb";
import { IoIosSend } from "react-icons/io";
import "../ClassesPage.css";

interface ToolbarProps {
  tool: string;
  setTool: (tool: string) => void;
  selectedClasses: string[];
  handleClassSelection: (course: string) => void;
  handleSubmit: () => void; // Add handleSubmit prop
}

const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  setTool,
  selectedClasses,
  handleClassSelection,
  handleSubmit, // Destructure handleSubmit prop
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isHoldingSubmit, setIsHoldingSubmit] = useState(false);
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Handle press and hold for submit button
  const handleMouseDown = () => {
    setIsHoldingSubmit(true);
    holdTimeout.current = setTimeout(() => {
      handleSubmit(); // Call handleSubmit after 2 seconds
      setIsHoldingSubmit(false);
    }, 2000); // 2-second hold
  };

  const handleMouseUp = () => {
    setIsHoldingSubmit(false);
    if (holdTimeout.current) clearTimeout(holdTimeout.current);
  };

  return (
    <div className="toolbar-container">
      {/* Classes Button with Tooltip */}
      <div className="tooltip-container">
        <button
          className={`icon-button ${tool === "class" ? "active" : ""}`}
          aria-label="Classes"
          onClick={() => {
            setTool("class");
            toggleDropdown();
          }}
        >
          <SiGoogleclassroom size={20} />
        </button>
        <span className="tooltip">Classes</span>
      </div>

      {/* Section Button with Tooltip */}
      <div className="tooltip-container">
        <button
          className={`icon-button ${tool === "section" ? "active" : ""}`}
          aria-label="Section"
          onClick={() => setTool("section")}
        >
          <TbPuzzleFilled size={20} />
        </button>
        <span className="tooltip">Section</span>
      </div>

      {/* Submit Button with Tooltip and Hold Action */}
      <div className="tooltip-container">
        <button
          className={`icon-button ${tool === "submit" ? "active" : ""}`}
          aria-label="Submit"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <IoIosSend size={20} />
          {isHoldingSubmit && <div className="progress-circle"></div>}
        </button>
        <span className="tooltip">Press and hold to submit</span>
      </div>

      {tool === "class" && (
        <div
          className={`dropdown ${dropdownOpen ? "dropdown-open" : "dropdown-closed"}`}
        >
          {courseData.map((course: Course) => (
            <div
              key={course.course}
              className={`dropdown-item ${
                selectedClasses.includes(course.course) ? "highlighted" : ""
              }`}
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
