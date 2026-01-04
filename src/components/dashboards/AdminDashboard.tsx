import React from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '@/context/AppDataContext';
import {
  Users,
  Building2,
  ClipboardList,
  FileText,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  UserPlus,
  BarChart3,
  PieChart,
} from 'lucide-react';

export function AdminDashboard() {
  const { departmentStats, vacancies, grievances } = useAppData();
  
  const totalEmployees = departmentStats.reduce((acc, d) => acc + d.totalEmployees, 0);
  const totalPresent = departmentStats.reduce((acc, d) => acc + d.presentToday, 0);
  const totalVacancies = vacancies.reduce((acc, v) => acc + v.vacantPosts, 0);
  const totalSanctioned = vacancies.reduce((acc, v) => acc + v.sanctionedPosts, 0);
  const pendingGrievances = grievances.filter(g => g.status !== 'resolved').length;
  
  const attendanceRate = Math.round((totalPresent / totalEmployees) * 100);
  const filledRate = Math.round(((totalSanctioned - totalVacancies) / totalSanctioned) * 100);

  // Group vacancies by department
  const vacancyByDept = vacancies.reduce((acc, v) => {
    if (!acc[v.department]) {
      acc[v.department] = { sanctioned: 0, filled: 0, vacant: 0 };
    }
    acc[v.department].sanctioned += v.sanctionedPosts;
    acc[v.department].filled += v.filledPosts;
    acc[v.department].vacant += v.vacantPosts;
    return acc;
  }, {} as Record<string, { sanctioned: number; filled: number; vacant: number }>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">System-wide analytics and management</p>
          </div>
          <div className="flex gap-2">
            <Link to="/workforce" className="btn-gov-primary">
              <UserPlus className="w-4 h-4" />
              Manage Users
            </Link>
          </div>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <div className="stat-card">
          <div className="stat-icon-primary">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Workforce</p>
            <p className="text-2xl font-bold text-foreground">{totalEmployees.toLocaleString()}</p>
            <p className="text-xs text-success mt-1">+12 this month</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-success">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Today's Attendance</p>
            <p className="text-2xl font-bold text-foreground">{attendanceRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">{totalPresent} present</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-accent">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Posts Filled</p>
            <p className="text-2xl font-bold text-foreground">{filledRate}%</p>
            <p className="text-xs text-warning mt-1">{totalVacancies} vacancies</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-warning">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Open Grievances</p>
            <p className="text-2xl font-bold text-foreground">{pendingGrievances}</p>
            <Link to="/grievances" className="text-xs text-primary hover:underline">
              Review now →
            </Link>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vacancy Analysis */}
        <div className="gov-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Vacancy Analysis by Department
            </h3>
            <Link to="/vacancies" className="text-sm text-primary hover:underline flex items-center gap-1">
              Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {Object.entries(vacancyByDept).map(([dept, data]) => {
              const fillRate = Math.round((data.filled / data.sanctioned) * 100);
              return (
                <div key={dept} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{dept}</span>
                    <span className="text-muted-foreground">
                      {data.filled}/{data.sanctioned} filled ({data.vacant} vacant)
                    </span>
                  </div>
                  <div className="progress-bar h-3">
                    <div 
                      className={`progress-fill ${
                        fillRate >= 90 ? 'bg-success' :
                        fillRate >= 70 ? 'bg-warning' : 'bg-destructive'
                      }`}
                      style={{ width: `${fillRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Performance */}
        <div className="gov-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Department Performance
            </h3>
            <Link to="/reports" className="text-sm text-primary hover:underline flex items-center gap-1">
              Full Report <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Employees</th>
                  <th>Attendance</th>
                  <th>Grievances</th>
                </tr>
              </thead>
              <tbody>
                {departmentStats.map((dept) => (
                  <tr key={dept.department}>
                    <td className="font-medium">{dept.department}</td>
                    <td>{dept.totalEmployees}</td>
                    <td>
                      <span className={`status-badge ${
                        (dept.presentToday / dept.totalEmployees) >= 0.9 ? 'bg-success/15 text-success' :
                        (dept.presentToday / dept.totalEmployees) >= 0.75 ? 'bg-warning/15 text-warning' :
                        'bg-destructive/15 text-destructive'
                      }`}>
                        {Math.round((dept.presentToday / dept.totalEmployees) * 100)}%
                      </span>
                    </td>
                    <td>
                      {dept.pendingGrievances > 0 ? (
                        <span className="status-pending">{dept.pendingGrievances} pending</span>
                      ) : (
                        <span className="text-success text-sm">✓ Clear</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/workforce" className="quick-action">
          <div className="quick-action-icon bg-primary/10 text-primary">
            <UserPlus className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium">Add User</span>
        </Link>
        <Link to="/vacancies" className="quick-action">
          <div className="quick-action-icon bg-accent/10 text-accent">
            <ClipboardList className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium">Manage Vacancies</span>
        </Link>
        <Link to="/reports" className="quick-action">
          <div className="quick-action-icon bg-info/10 text-info">
            <BarChart3 className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium">View Reports</span>
        </Link>
        <Link to="/settings" className="quick-action">
          <div className="quick-action-icon bg-warning/10 text-warning">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium">System Settings</span>
        </Link>
      </div>
    </div>
  );
}
