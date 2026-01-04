import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAppData } from '@/context/AppDataContext';
import {
  CalendarCheck,
  FileText,
  Wallet,
  User,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function EmployeeDashboard() {
  const { user } = useAuth();
  const { getTodayAttendance, markAttendance, grievances, payrollRecords, attendanceRecords } = useAppData();
  
  const todayAttendance = getTodayAttendance();
  const latestPayroll = payrollRecords[0];
  const pendingGrievances = grievances.filter(g => g.status !== 'resolved').length;
  
  // Calculate attendance stats for current month
  const currentMonth = new Date().getMonth();
  const monthlyAttendance = attendanceRecords.filter(r => {
    const date = new Date(r.date);
    return date.getMonth() === currentMonth;
  });
  const presentDays = monthlyAttendance.filter(r => r.status === 'present').length;
  const totalWorkDays = monthlyAttendance.filter(r => r.status !== 'holiday').length;

  const handleMarkAttendance = () => {
    if (todayAttendance?.status === 'present') {
      toast({
        title: 'Already Marked',
        description: 'Your attendance for today has already been recorded.',
      });
      return;
    }
    
    markAttendance('present');
    toast({
      title: 'Attendance Marked',
      description: 'Your attendance has been recorded successfully.',
    });
  };

  const quickActions = [
    {
      icon: CalendarCheck,
      label: 'Mark Attendance',
      color: 'bg-success/10 text-success',
      onClick: handleMarkAttendance,
      disabled: todayAttendance?.status === 'present',
    },
    {
      icon: FileText,
      label: 'Raise Grievance',
      color: 'bg-warning/10 text-warning',
      to: '/grievances',
    },
    {
      icon: Wallet,
      label: 'View Payslip',
      color: 'bg-info/10 text-info',
      to: '/payroll',
    },
    {
      icon: User,
      label: 'View Profile',
      color: 'bg-primary/10 text-primary',
      to: '/profile',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="page-header">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-title">Welcome, {user?.name?.split(' ')[0]}!</h1>
            <p className="page-subtitle">
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="px-3 py-1.5 rounded-lg bg-muted">{user?.department}</span>
            <span className="px-3 py-1.5 rounded-lg bg-muted">{user?.employeeId}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
        {quickActions.map((action, i) => (
          action.to ? (
            <Link
              key={i}
              to={action.to}
              className="quick-action"
            >
              <div className={`quick-action-icon ${action.color}`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-foreground">{action.label}</span>
            </Link>
          ) : (
            <button
              key={i}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`quick-action ${action.disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className={`quick-action-icon ${action.color}`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-foreground">{action.label}</span>
              {action.disabled && (
                <span className="text-xs text-success flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Done
                </span>
              )}
            </button>
          )
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {/* Today's Attendance */}
        <div className="stat-card">
          <div className="stat-icon-success">
            <Clock className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Today's Status</p>
            <p className="text-xl font-bold text-foreground mt-1">
              {todayAttendance?.status === 'present' ? 'Present' : 
               todayAttendance?.status === 'absent' ? 'Absent' :
               todayAttendance?.status === 'holiday' ? 'Holiday' : 'Not Marked'}
            </p>
            {todayAttendance?.checkIn && (
              <p className="text-xs text-muted-foreground mt-1">
                Check-in: {todayAttendance.checkIn}
              </p>
            )}
          </div>
        </div>

        {/* Monthly Attendance */}
        <div className="stat-card">
          <div className="stat-icon-primary">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-xl font-bold text-foreground mt-1">
              {presentDays}/{totalWorkDays} Days
            </p>
            <div className="progress-bar mt-2">
              <div 
                className="progress-fill bg-primary" 
                style={{ width: `${totalWorkDays > 0 ? (presentDays / totalWorkDays) * 100 : 0}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Pending Grievances */}
        <div className="stat-card">
          <div className="stat-icon-warning">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Active Grievances</p>
            <p className="text-xl font-bold text-foreground mt-1">{pendingGrievances}</p>
            <Link to="/grievances" className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Last Salary */}
        <div className="stat-card">
          <div className="stat-icon-accent">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Last Salary</p>
            <p className="text-xl font-bold text-foreground mt-1">
              ₹{latestPayroll?.netSalary.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {latestPayroll?.month} {latestPayroll?.year}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attendance */}
        <div className="gov-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Attendance</h3>
            <Link to="/attendance" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {attendanceRecords.slice(0, 5).map((record) => (
              <div key={record.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    record.status === 'present' ? 'bg-success' :
                    record.status === 'absent' ? 'bg-destructive' :
                    record.status === 'leave' ? 'bg-warning' : 'bg-muted-foreground'
                  }`} />
                  <span className="text-sm text-foreground">
                    {new Date(record.date).toLocaleDateString('en-IN', { 
                      weekday: 'short', 
                      day: 'numeric',
                      month: 'short' 
                    })}
                  </span>
                </div>
                <span className={`text-sm font-medium capitalize ${
                  record.status === 'present' ? 'text-success' :
                  record.status === 'absent' ? 'text-destructive' :
                  record.status === 'leave' ? 'text-warning' : 'text-muted-foreground'
                }`}>
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Grievances */}
        <div className="gov-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Active Grievances</h3>
            <Link to="/grievances" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {grievances.filter(g => g.status !== 'resolved').slice(0, 3).map((grievance) => (
              <div key={grievance.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{grievance.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1">{grievance.category}</p>
                  </div>
                  <span className={`shrink-0 ${
                    grievance.status === 'submitted' ? 'status-pending' :
                    grievance.status === 'in-review' ? 'status-active' :
                    grievance.status === 'escalated' ? 'status-badge bg-destructive/15 text-destructive' :
                    'status-resolved'
                  }`}>
                    {grievance.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
            ))}
            {grievances.filter(g => g.status !== 'resolved').length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-success" />
                <p className="text-sm">No active grievances</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
