import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Scheduler, SchedulerData, LocaleType } from "@bitnoi.se/react-scheduler";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import enDayjsTranslations from "dayjs/locale/en";

dayjs.extend(isBetween);

const langs: LocaleType[] = [
  {
    id: "en",
    lang: {
      feelingEmpty: "I feel so empty...",
      free: "Free",
      loadNext: "Next",
      loadPrevious: "Previous",
      over: "over",
      taken: "Taken",
      topbar: {
        filters: "Filters",
        next: "next",
        prev: "prev",
        today: "Today",
        view: "View"
      },
      search: "search",
      week: "week"
    },
    translateCode: "en-EN",
    dayjsTranslations: enDayjsTranslations
  }
];

export const EmployeeScheduler: React.FC<{ employees: any[] }> = ({ employees }) => {
  const [schedulerData, setSchedulerData] = useState<SchedulerData>([]);
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7))
  });

  useEffect(() => {
    try {
      const convertedData : SchedulerData = employees.map(employee => ({
        id: employee.id || Math.random().toString(),
        label: {
          title: `${employee.employee_fname} ${employee.employee_lname}`,
          subtitle: employee.employee_position
        },
        data: (employee.employee_availability || '').split(', ').map((shift: string, index: number) => {
          const shiftDate = new Date();
          shiftDate.setDate(shiftDate.getDate() + index); // Spread shifts over different days
          return {
            id: `${employee.id}-${shift}`,
            startDate: getShiftStartTime(shift, shiftDate),
            endDate: getShiftEndTime(shift, shiftDate),
            title: shift,
            subtitle: employee.employee_position,
            description: `${employee.employee_fname} ${employee.employee_lname}`,
            bgColor: employee.employee_system === "Dining Side" ? "rgb(254,165,177)" : "rgb(155,220,255)"
          };
        })
      }));
      
      setSchedulerData(convertedData);
    } catch (error) {
      console.error("Error converting employee data:", error);
    }
  }, [employees]);

  const getShiftStartTime = (shift: string, date: Date) => {
    const shiftDate = new Date(date);
    switch(shift) {
      case 'Morning': return new Date(shiftDate.setHours(8, 0, 0, 0));
      case 'Afternoon': return new Date(shiftDate.setHours(16, 0, 0, 0));
      case 'Closing': return new Date(shiftDate.setHours(20, 0, 0, 0));
      default: return new Date(shiftDate.setHours(9, 0, 0, 0));
    }
  };

  const getShiftEndTime = (shift: string, date: Date) => {
    const shiftDate = new Date(date);
    switch(shift) {
      case 'Morning': return new Date(shiftDate.setHours(16, 0, 0, 0));
      case 'Afternoon': return new Date(shiftDate.setHours(24, 0, 0, 0));
      case 'Closing': return new Date(shiftDate.setHours(28, 0, 0, 0));
      default: return new Date(shiftDate.setHours(17, 0, 0, 0));
    }
  };

  const handleRangeChange = (newRange: { startDate: Date; endDate: Date }) => {
    setRange(newRange);
  };

  const filteredSchedulerData: SchedulerData = schedulerData.map(person => ({
    ...person,
    data: person.data.filter(
      (shift) =>
        dayjs(shift.startDate).isBetween(range.startDate, range.endDate, null, '[]') ||
        dayjs(shift.endDate).isBetween(range.startDate, range.endDate, null, '[]') ||
        (dayjs(shift.startDate).isBefore(range.startDate) &&
         dayjs(shift.endDate).isAfter(range.endDate))
    )
  }));

  return (
    <Box style={{ height: '500px', marginTop: '20px' }}>
      <Scheduler
        data={filteredSchedulerData}
        onRangeChange={handleRangeChange}
        onItemClick={(item) => console.log('Clicked item:', item)}
        onTileClick={(resource) => console.log('Clicked resource:', resource)}
        config={{
          zoom: 1,
          maxRecordsPerPage: 50,
          lang: "en",
          includeTakenHoursOnWeekendsInDayView: true,
          showTooltip: true,
          translations: langs
        }}
      />
    </Box>
  );
};