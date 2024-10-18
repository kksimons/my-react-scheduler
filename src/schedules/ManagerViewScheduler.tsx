import "@bitnoi.se/react-scheduler/dist/style.css";
import { Scheduler, SchedulerData } from "@bitnoi.se/react-scheduler";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween"; //import a plug in for dayjs if the date is between another date 
import { useCallback, useState } from "react";
//SetStateAction
// Extend dayjs with isBetween functionality
dayjs.extend(isBetween);


/// This is our main function where we create the Scheduler component 
export function ManagerViewScheduler() {
  const [filterButtonState, setFilterButtonState] = useState(0); //Button than can change the state for "Filter" Button  
  const [isLoading] = useState(false); // This is Loading State to see if anything is loading or not, rn it's unloading so (false)
  const [range, setRange] = useState({   //set start date and end date STATE 
    startDate: new Date(),
    endDate: new Date(),
  });

  //After handle the Button, Loading, Range. We create a const to handle changing state (change start and end date)
  //We will react hook (use call back) for it. so the function will stay the same and it doesnt recreate a new function by itself everytime user change date (i need to do more research)
  //make sure the object range has the correct format which is Date. SetStateAction is just the TypeScript syntax need to do more research 
  const handleRangeChange = useCallback(
    (range: { startDate: Date; endDate: Date }) => { 
      setRange(range);
    },
    [] //dependency array, control when function get updated (date get updated)
  );

  /* 
    We take our mock data and filter it based on the date range.
    Only show projects that are within the selected dates
  */
  const filteredMockedSchedulerData = mockedSchedulerData.map((person) => ({
    ...person, 
    data: person.data.filter(
      (project) =>
        dayjs(project.startDate).isBetween(range.startDate, range. endDate) || // Project starts within range
        dayjs(project.endDate).isBetween(range.startDate, range.endDate) ||  //  ends within range
        (dayjs(project.startDate).isBefore(range.startDate, "day") && 
          dayjs(project.endDate).isAfter(range.endDate, "day")) // start and end before range
    ),
  }));

  return (
    <section>
      <Scheduler
        data={filteredMockedSchedulerData}
        isLoading={isLoading} // Whether to show a loading spinner
        onRangeChange={handleRangeChange} //what to do when range change 
        onTileClick={(clickedResource) => console.log(clickedResource)} //log when tile (time slot) is clicked
        onItemClick={(item) => console.log(item)} // Log when a project is clicked
        onFilterData={() => {
          setFilterButtonState(1); // When filter button is clicked, set its state to 1 
        }}
        onClearFilterData={() => {
          setFilterButtonState(0); // When clear filter is clicked, set state back to 0 (not pressed)
        }}
        config={{
          zoom: 0, //idk what is this it said smth like Set the zoom level to 0 ? like zoom in zoom out ? 
          filterButtonState, // Pass the current state of the filter button
        }}
      />
    </section>
  );
}


//THIS IS HARD CODE DATA 
const mockedSchedulerData: SchedulerData = [
  {
    id: "070ac5b5-8369-4cd2-8ba2-0a209130cc60",
    label: {
      icon: "https://picsum.photos/24",
      title: "Joe Doe",
      subtitle: "Frontend Developer",
    },
    data: [
      {
        id: "8b71a8a5-33dd-4fc8-9caa-b4a584ba3762",
        startDate: new Date("2023-04-13T15:31:24.272Z"),
        endDate: new Date("2023-08-28T10:28:22.649Z"),
        occupancy: 3600,
        title: "Project A",
        subtitle: "Subtitle A",
        description: "array indexing Salad West Account",
        bgColor: "rgb(254,165,177)",
      },
      {
        id: "22fbe237-6344-4c8e-affb-64a1750f33bd",
        startDate: new Date("2023-10-07T08:16:31.123Z"),
        endDate: new Date("2023-11-15T21:55:23.582Z"),
        occupancy: 2852,
        title: "Project B",
        subtitle: "Subtitle B",
        description: "Tuna Home pascal IP drive",
        bgColor: "rgb(254,165,177)",
      },
      {
        id: "3601c1cd-f4b5-46bc-8564-8c983919e3f5",
        startDate: new Date("2023-03-30T22:25:14.377Z"),
        endDate: new Date("2023-09-01T07:20:50.526Z"),
        occupancy: 1800,
        title: "Project C",
        subtitle: "Subtitle C",
        bgColor: "rgb(254,165,177)",
      },
      {
        id: "b088e4ac-9911-426f-aef3-843d75e714c2",
        startDate: new Date("2023-10-28T10:08:22.986Z"),
        endDate: new Date("2023-10-30T12:30:30.150Z"),
        occupancy: 11111,
        title: "Project D",
        subtitle: "Subtitle D",
        description: "Garden heavy an software Metal",
        bgColor: "rgb(254,165,177)",
      },
    ],
  },
];
