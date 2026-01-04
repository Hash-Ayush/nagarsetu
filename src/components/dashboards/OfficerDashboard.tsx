import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAppData } from '@/context/AppDataContext';
import {
  Users,
  CalendarCheck,
  FileText,
  AlertTriangle,
  TrendingUp,
  Building2,
  ArrowRight,
  Clock,
  CheckCircle,
} from 'lucide-react';

export function OfficerDashboard() {
  const { user } = useAuth();
  const { departmentStats, grievances, vacancies } = useAppData();
  
  const myDepartment = departmentStats.find(d => d.department === user?.department) || departmentStats[0];
  const allPendingGrievances = grievances.filter(g => g.status !== 'resolved');
  const deptVacancies = vacancies.filter(v => v.department === user?.department);
  const totalVacant = deptVacancies.reduce((acc, v) => acc + v.vacantPosts, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-title">Officer Dashboard</h1>
            <p className="page-subtitle">
              {user?.department} Department Overview
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
              {user?.designation}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <div className="stat-card">
          <div className="stat-icon-primary">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Employees</p>
            <p className="text-2xl font-bold text-foreground">{myDepartment.totalEmployees}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-success">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Present Today</p>
            <p className="text-2xl font-bold text-foreground">{myDepartment.presentToday}</p>
            <p className="text-xs text-success mt-1">
              {Math.round((myDepartment.presentToday / myDepartment.totalEmployees) * 100)}% attendance
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-warning">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending Grievances</p>
            <p className="text-2xl font-bold text-foreground">{myDepartment.pendingGrievances}</p>
            <Link to="/grievances" className="text-xs text-primary hover:underline">
              Review now →
            </Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-accent">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Vacant Posts</p>
            <p className="text-2xl font-bold text-foreground">{totalVacant}</p>
            <p className="text-xs text-muted-foreground">In department</p>
          </div>
        </div>
      </div>

      {/* Department Attendance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 gov-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground">Department Attendance Overview</h3>
            <Link to="/reports" className="text-sm text-primary hover:underline flex items-center gap-1">
              Full Report <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {departmentStats.map((dept) => {
              const percentage = Math.round((dept.presentToday / dept.totalEmployees) * 100);
              return (
                <div key={dept.department} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{dept.department}</span>
                    <span className="text-muted-foreground">
                      {dept.presentToday}/{dept.totalEmployees} ({percentage}%)
                    </span>
                  </div>
                  <div className="progress-bar h-3">
                    <div 
                      className={`progress-fill ${
                        percentage >= 90 ? 'bg-success' :
                        percentage >= 75 ? 'bg-warning' : 'bg-destructive'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="gov-card">
          <h3 className="font-semibold text-foreground mb-4">Today's Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="font-medium text-foreground">{myDepartment.presentToday} Present</p>
                <p className="text-xs text-muted-foreground">On duty today</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10">
              <Clock className="w-5 h-5 text-warning" />
              <div>
                <p className="font-medium text-foreground">{myDepartment.onLeave} On Leave</p>
                <p className="text-xs text-muted-foreground">Approved absence</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-info/10">
              <Building2 className="w-5 h-5 text-info" />
              <div>
                <p className="font-medium text-foreground">{deptVacancies.length} Positions</p>
                <p className="text-xs text-muted-foreground">Tracked designations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Grievances for Review */}
      <div className="gov-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Grievances Pending Review</h3>
          <Link to="/grievances" className="text-sm text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allPendingGrievances.slice(0, 5).map((grievance) => (
                <tr key={grievance.id}>
                  <td className="font-mono text-xs">{grievance.id}</td>
                  <td className="font-medium max-w-[200px] truncate">{grievance.subject}</td>
                  <td>{grievance.category}</td>
                  <td>
                    <span className={`status-badge ${
                      grievance.priority === 'high' ? 'bg-destructive/15 text-destructive' :
                      grievance.priority === 'medium' ? 'bg-warning/15 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {grievance.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`${
                      grievance.status === 'submitted' ? 'status-pending' :
                      grievance.status === 'in-review' ? 'status-active' :
                      'status-resolved'
                    }`}>
                      {grievance.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="text-muted-foreground">
                    {new Date(grievance.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td>
                    <Link to="/grievances" className="btn-gov-secondary text-xs py-1.5 px-3">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {allPendingGrievances.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="w-10 h-10 mx-auto mb-2 text-success" />
            <p>No pending grievances</p>
          </div>
        )}
      </div>
    </div>
  );
}
