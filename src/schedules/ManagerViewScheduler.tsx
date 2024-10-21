//Code provided with assistance from ChatGPT, a language model developed by OpenAI.


import React, { useState, useEffect } from 'react';
import { Scheduler } from '@bitnoi.se/react-scheduler';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../userAuth/firebase'; // Adjust the path to your Firebase config

// Define types matching those expected by the Scheduler component
type SchedulerProjectData = {
  id: string;
  startDate: Date;
  endDate: Date;
  occupancy: number; // Required
  title: string;
  subtitle: string;
  description?: string;
  bgColor: string; // Required
};

type SchedulerRowLabel = {
  icon: string; // Required
  title: string;
  subtitle: string;
};

type SchedulerRow = {
  id: string;
  label: SchedulerRowLabel;
  data: SchedulerProjectData[];  // hold multiple SchedulerProjectData objects
};

type SchedulerData = SchedulerRow[]; 

export function ManagerViewScheduler() {
  const [employeeData, setEmployeeData] = useState<SchedulerData>([]); 
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEmployees = async () => { //anonymoys function 
      try {
        const employeeCollection = collection(db, 'employee-info'); //reference to a collection in your Firestore database.
        const employeeSnapshot = await getDocs(employeeCollection); //GetDocs() attempts to provide up-to-date data when possible by waiting for data from the server,

        const employees: SchedulerData = employeeSnapshot.docs.map((doc): SchedulerRow => {
          const data = doc.data();

          const firstName = data.employeeFname;
          const lastName = data.employeeLname;
          const position = data.employeePosition;

          // Convert Firestore Timestamps to JavaScript Dates
          const shiftStartDate = data.shiftStartDate
            ? data.shiftStartDate.toDate() //if start shift then make new date 
            : new Date(); // Default to current date if not available
          const shiftEndDate = data.shiftEndDate
            ? data.shiftEndDate.toDate()
            : new Date(); // Default to current date if not available

          // Calculate occupancy working hour (in seconds). for ex: shift starts from 8 to 4pm then 8x60x60x1000 then /1000milisecond = second 
          const occupancy = Math.floor( //math floor will round number 
            (shiftEndDate.getTime() - shiftStartDate.getTime()) / 1000
          );

          const schedulerProjectData: SchedulerProjectData[] = [
            {
              id: `${doc.id}-shift`,
              startDate: shiftStartDate,
              endDate: shiftEndDate,
              occupancy: occupancy > 0 ? occupancy : 3600, // Provide a default if occupancy is zero, but i dont like it and wants to remove the 3600 
              title: `Shift for ${position}`,
              subtitle: position,
              bgColor: 'rgb(254,165,177)', 
            },
          ];

          const schedulerRow: SchedulerRow = {
            id: doc.id, // Firebase UID
            label: {
              title: `${firstName} ${lastName}`,
              subtitle: position,
              icon: '', // Provide an empty string or a valid icon URL
            },
            data: schedulerProjectData,
          };

          return schedulerRow;
        });

        setEmployeeData(employees);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching employees: ', error);
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div>
      <Scheduler
        data={employeeData}
        isLoading={isLoading}
        onRangeChange={() => {}}
        onTileClick={(clickedResource) => console.log(clickedResource)}
        onItemClick={(item) => console.log(item)}
        config={{ zoom: 0 }}
      />
    </div>
  );
}

export default ManagerViewScheduler;
