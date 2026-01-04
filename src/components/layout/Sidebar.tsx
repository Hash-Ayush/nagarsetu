import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
  Wallet,
  Users,
  BarChart3,
  Bell,
  MessageCircle,
  Settings,
  Building2,
  X,
  ClipboardList,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const employeeNavItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/attendance', icon: CalendarCheck, label: 'Attendance' },
    { to: '/grievances', icon: FileText, label: 'Grievances' },
    { to: '/payroll', icon: Wallet, label: 'Payroll' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const officerNavItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/department', icon: Building2, label: 'Department' },
    { to: '/attendance', icon: CalendarCheck, label: 'Attendance' },
    { to: '/grievances', icon: FileText, label: 'Grievances' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const adminNavItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/workforce', icon: Users, label: 'Workforce' },
    { to: '/vacancies', icon: ClipboardList, label: 'Vacancies' },
    { to: '/department', icon: Building2, label: 'Departments' },
    { to: '/grievances', icon: FileText, label: 'Grievances' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const citizenNavItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/transparency', icon: BarChart3, label: 'Transparency' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const getNavItems = () => {
    switch (user?.role) {
      case 'officer':
        return officerNavItems;
      case 'admin':
        return adminNavItems;
      case 'citizen':
        return citizenNavItems;
      default:
        return employeeNavItems;
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-sidebar z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-lg">N</span>
            </div>
            <span className="font-heading font-bold text-sidebar-foreground">NagarSetu</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-sidebar-foreground" />
          </button>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:flex items-center gap-3 p-6 border-b border-sidebar-border">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-lg">N</span>
          </div>
          <div>
            <h1 className="font-heading font-bold text-sidebar-foreground">NagarSetu</h1>
            <p className="text-xs text-sidebar-foreground/60">Municipal Platform</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Help section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <NavLink
            to="/help"
            onClick={onClose}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <MessageCircle className="w-5 h-5" />
            <span>Help & Support</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}
