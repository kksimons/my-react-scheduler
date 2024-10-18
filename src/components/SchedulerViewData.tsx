// src/components/SchedulerViewData.ts

export interface SchedulerRowLabel {
  icon: string; // Always a string
  title: string;
  subtitle: string;
}

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

export interface SchedulerRow {
  id: string;
  label: SchedulerRowLabel;
  data: SchedulerProjectData[]; // Ensure this matches the expected type
}

export type SchedulerDataType = SchedulerRow[];
