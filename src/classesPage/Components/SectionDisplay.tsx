import React from 'react';
import { Course } from '../utils/types';

interface SectionDisplayProps {
  sections: { [courseName: string]: Course['sections'] };
}

const SectionDisplay: React.FC<SectionDisplayProps> = ({ sections }) => {
  return (
    <div className="section-dropdown section-dropdown-open">
      {Object.entries(sections).map(([courseName, courseSections]) => (
        <div key={courseName} className="course-section">
          <h3>{courseName}</h3>
          <div className="section-list">
            {courseSections.map((section, index) => (
              <div key={index} className="dropdown-item section-detail">
                <p>Day 1: {section.day1.day}, {section.day1.start} - {section.day1.end} ({section.day1.format})</p>
                <p>Day 2: {section.day2.day}, {section.day2.start} - {section.day2.end} ({section.day2.format})</p>
                <p>Professor: {section.professor}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionDisplay;
