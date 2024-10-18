// src/components/SchedulerViewData.ts

export interface SchedulerRowLabel {
  icon: string; // Always a string
  title: string;
  subtitle: string;
}

export interface SchedulerProjectData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  startDate: Date; // Should be a Date object
  endDate: Date;   // Should be a Date object
  occupancy: number;
  bgColor?: string;
}

export interface SchedulerRow {
  id: string;
  label: SchedulerRowLabel;
  data: SchedulerProjectData[]; // Ensure this matches the expected type
}

export type SchedulerDataType = SchedulerRow[];
