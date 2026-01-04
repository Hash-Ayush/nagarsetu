import React from 'react';
import { useAppData } from '@/context/AppDataContext';
import {
  Building2,
  Users,
  TrendingUp,
  CheckCircle,
  BarChart3,
  FileText,
} from 'lucide-react';

export function CitizenDashboard() {
  const { departmentStats, vacancies } = useAppData();
  
  const totalEmployees = departmentStats.reduce((acc, d) => acc + d.totalEmployees, 0);
  const totalPresent = departmentStats.reduce((acc, d) => acc + d.presentToday, 0);
  const avgAttendance = Math.round((totalPresent / totalEmployees) * 100);
  const totalVacancies = vacancies.reduce((acc, v) => acc + v.vacantPosts, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Transparency Dashboard</h1>
        <p className="page-subtitle">
          Public view of municipal workforce performance
        </p>
      </div>

      {/* Notice Banner */}
      <div className="bg-info/10 border border-info/30 rounded-xl p-4 flex items-start gap-3">
        <FileText className="w-5 h-5 text-info shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-foreground">Citizen Portal</p>
          <p className="text-sm text-muted-foreground mt-1">
            This is a read-only view of department-level performance metrics. 
            Individual employee data is not displayed to protect privacy.
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <div className="stat-card">
          <div className="stat-icon-primary">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Workforce</p>
            <p className="text-2xl font-bold text-foreground">{totalEmployees}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-success">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average Attendance</p>
            <p className="text-2xl font-bold text-foreground">{avgAttendance}%</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-accent">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Departments</p>
            <p className="text-2xl font-bold text-foreground">{departmentStats.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-warning">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Open Positions</p>
            <p className="text-2xl font-bold text-foreground">{totalVacancies}</p>
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="gov-card">
        <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Department-wise Attendance Today
        </h3>
        
        <div className="space-y-4">
          {departmentStats.map((dept) => {
            const percentage = Math.round((dept.presentToday / dept.totalEmployees) * 100);
            return (
              <div key={dept.department} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{dept.department}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{dept.totalEmployees} employees</span>
                    <span className={`font-semibold ${
                      percentage >= 90 ? 'text-success' :
                      percentage >= 75 ? 'text-warning' : 'text-destructive'
                    }`}>
                      {percentage}%
                    </span>
                  </div>
                </div>
                <div className="progress-bar h-4 rounded-lg">
                  <div 
                    className={`progress-fill rounded-lg ${
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

      {/* Transparency Note */}
      <div className="bg-muted/50 rounded-xl p-6 text-center">
        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-success" />
        <h3 className="font-semibold text-foreground mb-2">Committed to Transparency</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          NagarSetu is committed to providing citizens with transparent access to 
          municipal workforce data. All metrics are updated in real-time to ensure 
          accuracy and accountability.
        </p>
      </div>
    </div>
  );
}
