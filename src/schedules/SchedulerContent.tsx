// src/schedules/SchedulerContent.tsx

import React from 'react';
import Scheduler, { SchedulerData } from 'react-big-scheduler-stch';

interface SchedulerContentProps {
  schedulerData: SchedulerData;
  prevClick: (schedulerData: SchedulerData) => void;
  nextClick: (schedulerData: SchedulerData) => void;
  onSelectDate: (schedulerData: SchedulerData, date: string) => void;
  onViewChange: (schedulerData: SchedulerData, view: any) => void;
  eventItemClick: (schedulerData: SchedulerData, event: any) => void;
}

const SchedulerContent: React.FC<SchedulerContentProps> = ({
  schedulerData,
  prevClick,
  nextClick,
  onSelectDate,
  onViewChange,
  eventItemClick,
}) => {
  return (
    <Scheduler
      schedulerData={schedulerData}
      prevClick={prevClick}
      nextClick={nextClick}
      onSelectDate={onSelectDate}
      onViewChange={onViewChange}
      eventItemClick={eventItemClick}
      // Add more props as needed
    />
  );
};

export default SchedulerContent;
