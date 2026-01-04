import React from 'react';
import { useAppData } from '@/context/AppDataContext';
import { Bell, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppData();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="page-header flex items-center justify-between">
        <div><h1 className="page-title">Notifications</h1><p className="page-subtitle">Stay updated with system alerts</p></div>
        <button onClick={markAllNotificationsRead} className="btn-gov-secondary"><CheckCheck className="w-4 h-4" /> Mark all read</button>
      </div>
      <div className="gov-card">
        <div className="space-y-2">
          {notifications.map((n) => (
            <div key={n.id} onClick={() => { markNotificationRead(n.id); if (n.link) navigate(n.link); }}
              className={`p-4 rounded-xl cursor-pointer transition-colors ${!n.read ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${n.type === 'success' ? 'bg-success' : n.type === 'warning' ? 'bg-warning' : 'bg-info'}`} />
                <div className="flex-1"><p className="font-medium">{n.title}</p><p className="text-sm text-muted-foreground">{n.message}</p></div>
                <span className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
