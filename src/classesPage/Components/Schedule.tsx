import { Scheduler } from "@aldabil/react-scheduler";
import { Event } from "../utils/types";

interface ScheduleProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const Schedule: React.FC<ScheduleProps> = ({ events, onEventClick }) => (
  <Scheduler
    events={events}
    view="week"
    onEventClick={(event) => onEventClick(event as Event)}
    week={{
      weekDays: [0, 1, 2, 3, 4, 5],
      weekStartOn: 1,
      startHour: 8,
      endHour: 22,
      step: 60,
    }}
  />
);

export default Schedule;
