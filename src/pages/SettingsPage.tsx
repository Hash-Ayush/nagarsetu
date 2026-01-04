import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="page-header"><h1 className="page-title">Settings</h1><p className="page-subtitle">Manage your preferences</p></div>
      <div className="grid gap-4">
        {[
          { icon: User, title: 'Profile Settings', desc: 'Update personal information' },
          { icon: Bell, title: 'Notifications', desc: 'Configure notification preferences' },
          { icon: Shield, title: 'Security', desc: 'Change password and security settings' },
        ].map((s) => (
          <div key={s.title} className="gov-card-interactive flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><s.icon className="w-6 h-6 text-primary" /></div>
            <div><h3 className="font-medium">{s.title}</h3><p className="text-sm text-muted-foreground">{s.desc}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
