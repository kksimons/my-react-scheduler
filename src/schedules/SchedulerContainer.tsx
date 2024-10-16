// src/schedules/SchedulerContainer.tsx

import React, { useState, useEffect } from 'react';
import SchedulerHeader from './SchedulerHeader';
import SchedulerContent from './SchedulerContent';
import SchedulerLoader from './SchedulerLoader';
import { SchedulerData, ViewType, DATE_FORMAT } from 'react-big-scheduler-stch';
import 'react-big-scheduler-stch/lib/css/style.css';
import dayjs from 'dayjs';
import 'antd/dist/reset.css'; // Use 'antd/dist/antd.css' if using Ant Design v4

const SchedulerContainer: React.FC = () => {
  const [schedulerData, setSchedulerData] = useState<SchedulerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updateFlag, setUpdateFlag] = useState<boolean>(false); // To force re-render

  useEffect(() => {
    // Initialize SchedulerData
    const sched = new SchedulerData(
      dayjs().format(DATE_FORMAT),
      ViewType.Week,
      false, // Show agenda
      false  // Event perspective
    );

    // Set locales if necessary
    sched.setSchedulerLocale('en'); // Change to your desired locale
    sched.setCalendarPopoverLocale('en');

    // Set resources
    sched.setResources([
      { id: 'r0', name: 'Resource0', groupOnly: true },
      { id: 'r1', name: 'Resource1' },
      { id: 'r2', name: 'Resource2', parentId: 'r0' },
      { id: 'r3', name: 'Resource3', parentId: 'r4' },
      { id: 'r4', name: 'Resource4', parentId: 'r2' },
    ]);

    // Set events
    const events = [
      {
        id: 1,
        start: '2024-04-01 09:30:00',
        end: '2024-04-02 17:30:00',
        resourceId: 'r1',
        title: 'Event 1',
        bgColor: '#D9D9D9',
        resizable: true,
        exdates: [], // Ensure exdates are present
      },
      {
        id: 2,
        start: '2024-04-03 12:30:00',
        end: '2024-04-04 17:30:00',
        resourceId: 'r2',
        title: 'Event 2',
        resizable: false,
        bgColor: '#FF5733',
        exdates: [], // Ensure exdates are present
      },
      // Add more events as needed
    ];

    sched.setEvents(events);

    // Optional: Set additional configurations
    sched.config.schedulerWidth = '100%'; // Responsive
    sched.config.schedulerContentHeight = '600px'; // Fixed height
    sched.config.dragAndDropEnabled = true; // Enable drag-and-drop

    // Set the scheduler data
    setSchedulerData(sched);
    setLoading(false);
  }, []);

  // Callback functions for Scheduler
  const prevClick = (schedData: SchedulerData) => {
    schedData.prev();
    setUpdateFlag(!updateFlag); // Toggle to force re-render
  };

  const nextClick = (schedData: SchedulerData) => {
    schedData.next();
    setUpdateFlag(!updateFlag); // Toggle to force re-render
  };

  const onSelectDate = (schedData: SchedulerData, date: string) => {
    schedData.setDate(date);
    setUpdateFlag(!updateFlag); // Toggle to force re-render
  };

  const onViewChange = (
    schedData: SchedulerData,
    view: { viewType: ViewType; showAgenda: boolean; isEventPerspective: boolean }
  ) => {
    schedData.setViewType(
      view.viewType,
      view.showAgenda,
      view.isEventPerspective
    );
    setUpdateFlag(!updateFlag); // Toggle to force re-render
  };

  const eventClicked = (_schedData: SchedulerData, event: any) => {
    alert(`You clicked an event: ${event.title}`);
  };

  // Render loading state if scheduler data is not yet initialized
  if (loading || !schedulerData) {
    return <SchedulerLoader />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <SchedulerHeader 
        onViewChange={(viewType: ViewType) => {
          schedulerData.setViewType(viewType, false, false);
          setUpdateFlag(!updateFlag); // Toggle to force re-render
        }}
        currentView={schedulerData.viewType}
        onPrevClick={() => prevClick(schedulerData)}
        onNextClick={() => nextClick(schedulerData)}
      />
      <SchedulerContent
        schedulerData={schedulerData}
        prevClick={prevClick}
        nextClick={nextClick}
        onSelectDate={onSelectDate}
        onViewChange={onViewChange}
        eventItemClick={eventClicked}
      />
    </div>
  );
};

export default SchedulerContainer;
