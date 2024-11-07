export interface Section {
  day1: { day: string; start: string; end: string; format?: string };
  day2: { day: string; start: string; end: string; format?: string };
  professor: string;
}

export interface Course {
  course: string;
  sections: Section[];
}

export interface ApiResponse {
  schedules: {
    course: string;
    day1: { day: string; start: string; end: string; format: string };
    day2: { day: string; start: string; end: string; format: string };
    professor: string;
  }[];
}

export interface Event {
  event_id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
}
