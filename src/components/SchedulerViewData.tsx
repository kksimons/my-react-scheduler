// // src/components/SchedulerViewData.ts

// export interface SchedulerRowLabel {
//   icon: string; // Always a string
//   title: string;
//   subtitle: string;
// }

<<<<<<< Updated upstream
export interface SchedulerProjectData {
  id: string;
  title: string;
  subtitle: string; //optional 
  description?: string;
  startDate: Date; 
  endDate: Date;  
  occupancy: number;
  bgColor?: string; //optional 
}
=======
// export interface SchedulerProjectData {
//   id: string;
//   title: string;
//   subtitle?: string;
//   description?: string;
//   startDate: Date; 
//   endDate: Date;   
//   occupancy: number;
//   bgColor?: string;
// }
>>>>>>> Stashed changes

// export interface SchedulerRow {
//   id: string;
//   label: SchedulerRowLabel;
//   data: SchedulerProjectData[]; 
// }

// export type SchedulerDataType = SchedulerRow[];
