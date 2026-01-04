import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AttendanceRecord, Grievance, PayrollRecord, Notification, Vacancy, DepartmentStats } from '@/types';

interface AppDataContextType {
  // Attendance
  attendanceRecords: AttendanceRecord[];
  markAttendance: (status: 'present' | 'absent') => void;
  getTodayAttendance: () => AttendanceRecord | undefined;
  
  // Grievances
  grievances: Grievance[];
  addGrievance: (grievance: Omit<Grievance, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'status'>) => void;
  updateGrievanceStatus: (id: string, status: Grievance['status'], message: string) => void;
  
  // Payroll
  payrollRecords: PayrollRecord[];
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
  
  // Vacancies
  vacancies: Vacancy[];
  
  // Department Stats
  departmentStats: DepartmentStats[];
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

// Mock data
const initialAttendance: AttendanceRecord[] = [
  { id: 'att-1', userId: 'emp-001', date: '2026-01-03', status: 'present', checkIn: '09:05', checkOut: '17:30' },
  { id: 'att-2', userId: 'emp-001', date: '2026-01-02', status: 'present', checkIn: '09:00', checkOut: '17:45' },
  { id: 'att-3', userId: 'emp-001', date: '2026-01-01', status: 'holiday' },
  { id: 'att-4', userId: 'emp-001', date: '2025-12-31', status: 'present', checkIn: '09:10', checkOut: '17:30' },
  { id: 'att-5', userId: 'emp-001', date: '2025-12-30', status: 'leave' },
];

const initialGrievances: Grievance[] = [
  {
    id: 'grv-001',
    userId: 'emp-001',
    category: 'Infrastructure',
    subject: 'Office Air Conditioning Not Working',
    description: 'The AC in the Public Works department office has not been functioning for the past week. This is affecting work productivity.',
    status: 'in-review',
    priority: 'medium',
    createdAt: '2025-12-28T10:30:00',
    updatedAt: '2025-12-30T14:00:00',
    timeline: [
      { id: 't1', status: 'Submitted', message: 'Grievance registered successfully', timestamp: '2025-12-28T10:30:00' },
      { id: 't2', status: 'In Review', message: 'Assigned to Maintenance Department', timestamp: '2025-12-30T14:00:00', by: 'Officer Sharma' },
    ],
  },
  {
    id: 'grv-002',
    userId: 'emp-001',
    category: 'Payroll',
    subject: 'Travel Allowance Not Credited',
    description: 'The travel allowance for December 2025 field visits has not been credited to my account.',
    status: 'resolved',
    priority: 'low',
    createdAt: '2025-12-20T09:00:00',
    updatedAt: '2025-12-25T16:00:00',
    timeline: [
      { id: 't1', status: 'Submitted', message: 'Grievance registered successfully', timestamp: '2025-12-20T09:00:00' },
      { id: 't2', status: 'In Review', message: 'Forwarded to Accounts Section', timestamp: '2025-12-21T11:00:00', by: 'HR Department' },
      { id: 't3', status: 'Resolved', message: 'Amount credited. Please check your account.', timestamp: '2025-12-25T16:00:00', by: 'Accounts Officer' },
    ],
  },
];

const initialPayroll: PayrollRecord[] = [
  { id: 'pay-1', userId: 'emp-001', month: 'December', year: 2025, basicSalary: 45000, allowances: 12000, deductions: 5200, netSalary: 51800, status: 'paid', paidOn: '2025-12-28' },
  { id: 'pay-2', userId: 'emp-001', month: 'November', year: 2025, basicSalary: 45000, allowances: 12000, deductions: 5200, netSalary: 51800, status: 'paid', paidOn: '2025-11-28' },
  { id: 'pay-3', userId: 'emp-001', month: 'October', year: 2025, basicSalary: 45000, allowances: 11500, deductions: 5200, netSalary: 51300, status: 'paid', paidOn: '2025-10-28' },
];

const initialNotifications: Notification[] = [
  { id: 'not-1', userId: 'emp-001', title: 'Salary Credited', message: 'Your December 2025 salary of ₹51,800 has been credited.', type: 'success', read: false, createdAt: '2025-12-28T10:00:00', link: '/payroll' },
  { id: 'not-2', userId: 'emp-001', title: 'Grievance Update', message: 'Your grievance regarding AC has been assigned for review.', type: 'info', read: false, createdAt: '2025-12-30T14:00:00', link: '/grievances' },
  { id: 'not-3', userId: 'emp-001', title: 'Attendance Reminder', message: 'Please mark your attendance for today.', type: 'warning', read: true, createdAt: '2026-01-04T09:00:00', link: '/attendance' },
];

const initialVacancies: Vacancy[] = [
  { id: 'vac-1', department: 'Public Works', designation: 'Junior Engineer', sanctionedPosts: 50, filledPosts: 42, vacantPosts: 8 },
  { id: 'vac-2', department: 'Public Works', designation: 'Executive Engineer', sanctionedPosts: 10, filledPosts: 8, vacantPosts: 2 },
  { id: 'vac-3', department: 'Health', designation: 'Medical Officer', sanctionedPosts: 30, filledPosts: 22, vacantPosts: 8 },
  { id: 'vac-4', department: 'Health', designation: 'Nurse', sanctionedPosts: 100, filledPosts: 78, vacantPosts: 22 },
  { id: 'vac-5', department: 'Sanitation', designation: 'Sanitary Inspector', sanctionedPosts: 25, filledPosts: 20, vacantPosts: 5 },
  { id: 'vac-6', department: 'Sanitation', designation: 'Supervisor', sanctionedPosts: 15, filledPosts: 12, vacantPosts: 3 },
  { id: 'vac-7', department: 'Finance', designation: 'Accountant', sanctionedPosts: 20, filledPosts: 18, vacantPosts: 2 },
  { id: 'vac-8', department: 'Administration', designation: 'Clerk', sanctionedPosts: 40, filledPosts: 35, vacantPosts: 5 },
];

const initialDeptStats: DepartmentStats[] = [
  { department: 'Public Works', totalEmployees: 120, presentToday: 108, onLeave: 8, pendingGrievances: 5 },
  { department: 'Health', totalEmployees: 180, presentToday: 165, onLeave: 12, pendingGrievances: 8 },
  { department: 'Sanitation', totalEmployees: 250, presentToday: 235, onLeave: 10, pendingGrievances: 3 },
  { department: 'Finance', totalEmployees: 45, presentToday: 42, onLeave: 2, pendingGrievances: 1 },
  { department: 'Administration', totalEmployees: 60, presentToday: 55, onLeave: 4, pendingGrievances: 2 },
];

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendance);
  const [grievances, setGrievances] = useState<Grievance[]>(initialGrievances);
  const [payrollRecords] = useState<PayrollRecord[]>(initialPayroll);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [vacancies] = useState<Vacancy[]>(initialVacancies);
  const [departmentStats] = useState<DepartmentStats[]>(initialDeptStats);

  const today = new Date().toISOString().split('T')[0];

  const getTodayAttendance = useCallback(() => {
    return attendanceRecords.find(r => r.date === today);
  }, [attendanceRecords, today]);

  const markAttendance = useCallback((status: 'present' | 'absent') => {
    const existing = getTodayAttendance();
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (existing) {
      setAttendanceRecords(prev => prev.map(r => 
        r.date === today ? { ...r, status, checkIn: timeStr } : r
      ));
    } else {
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        userId: 'emp-001',
        date: today,
        status,
        checkIn: status === 'present' ? timeStr : undefined,
      };
      setAttendanceRecords(prev => [newRecord, ...prev]);
    }

    addNotification({
      userId: 'emp-001',
      title: 'Attendance Marked',
      message: `Your attendance for today has been marked as ${status}.`,
      type: 'success',
    });
  }, [getTodayAttendance, today]);

  const addGrievance = useCallback((grievance: Omit<Grievance, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'status'>) => {
    const now = new Date().toISOString();
    const newGrievance: Grievance = {
      ...grievance,
      id: `grv-${Date.now()}`,
      status: 'submitted',
      createdAt: now,
      updatedAt: now,
      timeline: [
        { id: 't1', status: 'Submitted', message: 'Grievance registered successfully', timestamp: now },
      ],
    };
    setGrievances(prev => [newGrievance, ...prev]);
    
    addNotification({
      userId: grievance.userId,
      title: 'Grievance Submitted',
      message: `Your grievance "${grievance.subject}" has been registered.`,
      type: 'info',
      link: '/grievances',
    });
  }, []);

  const updateGrievanceStatus = useCallback((id: string, status: Grievance['status'], message: string) => {
    setGrievances(prev => prev.map(g => {
      if (g.id === id) {
        const now = new Date().toISOString();
        return {
          ...g,
          status,
          updatedAt: now,
          timeline: [
            ...g.timeline,
            { id: `t${g.timeline.length + 1}`, status: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '), message, timestamp: now, by: 'Officer' },
          ],
        };
      }
      return g;
    }));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `not-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppDataContext.Provider value={{
      attendanceRecords,
      markAttendance,
      getTodayAttendance,
      grievances,
      addGrievance,
      updateGrievanceStatus,
      payrollRecords,
      notifications,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      unreadCount,
      vacancies,
      departmentStats,
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}
