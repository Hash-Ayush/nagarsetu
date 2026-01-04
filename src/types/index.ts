export type UserRole = 'employee' | 'officer' | 'admin' | 'citizen';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  employeeId: string;
  avatar?: string;
  joinDate: string;
  phone: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  status: 'present' | 'absent' | 'leave' | 'holiday';
  checkIn?: string;
  checkOut?: string;
}

export interface Grievance {
  id: string;
  userId: string;
  category: string;
  subject: string;
  description: string;
  status: 'submitted' | 'in-review' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  timeline: GrievanceTimelineItem[];
}

export interface GrievanceTimelineItem {
  id: string;
  status: string;
  message: string;
  timestamp: string;
  by?: string;
}

export interface PayrollRecord {
  id: string;
  userId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid';
  paidOn?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Vacancy {
  id: string;
  department: string;
  designation: string;
  sanctionedPosts: number;
  filledPosts: number;
  vacantPosts: number;
}

export interface DepartmentStats {
  department: string;
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  pendingGrievances: number;
}
