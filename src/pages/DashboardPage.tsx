import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { EmployeeDashboard } from '@/components/dashboards/EmployeeDashboard';
import { OfficerDashboard } from '@/components/dashboards/OfficerDashboard';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { CitizenDashboard } from '@/components/dashboards/CitizenDashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  switch (user?.role) {
    case 'officer':
      return <OfficerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'citizen':
      return <CitizenDashboard />;
    default:
      return <EmployeeDashboard />;
  }
}
