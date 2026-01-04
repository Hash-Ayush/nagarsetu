import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, Building2, Briefcase, Calendar, Hash } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const fields = [
    { icon: Hash, label: 'Employee ID', value: user?.employeeId },
    { icon: Mail, label: 'Email', value: user?.email },
    { icon: Phone, label: 'Phone', value: user?.phone },
    { icon: Building2, label: 'Department', value: user?.department },
    { icon: Briefcase, label: 'Designation', value: user?.designation },
    { icon: Calendar, label: 'Join Date', value: user?.joinDate },
  ];

  return (
    <div className="space-y-6">
      <div className="page-header"><h1 className="page-title">My Profile</h1></div>
      <div className="gov-card">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center"><User className="w-10 h-10 text-primary" /></div>
          <div><h2 className="text-xl font-bold">{user?.name}</h2><p className="text-muted-foreground capitalize">{user?.role}</p></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.label} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <f.icon className="w-5 h-5 text-primary" />
              <div><p className="text-xs text-muted-foreground">{f.label}</p><p className="font-medium">{f.value}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
