export type INCUPTag = 'Interest' | 'Novelty' | 'Challenge' | 'Urgency' | 'Passion';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  createdAt: string; // ISO string
  dueDate: string; // ISO string
  completed: boolean;
  health: number; // 0 to 7 (days left)
  tags: INCUPTag[];
  subTasks: SubTask[];
  isToday: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  color: string;
}

export interface UserStats {
  xp: number;
  level: number;
}
