export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  phoneNumber: string; // For WhatsApp OTP simulation
  avatar?: string;
}

export interface OvertimeEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  clockIn: string; // HH:mm
  clockOut: string; // HH:mm
  durationHours: number;
  taskDescription: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface DateRange {
  startDate: string;
  endDate: string;
}
