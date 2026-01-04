import React, { useState } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { CalendarCheck, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function AttendancePage() {
  const { user } = useAuth();
  const { attendanceRecords, markAttendance, getTodayAttendance } = useAppData();
  const todayAttendance = getTodayAttendance();

  const handleMarkAttendance = () => {
    if (todayAttendance?.status === 'present') {
      toast({ title: 'Already Marked', description: 'Attendance already recorded for today.' });
      return;
    }
    markAttendance('present');
    toast({ title: 'Success!', description: 'Attendance marked successfully.' });
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">Track and manage your attendance records</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="gov-card text-center">
          <CalendarCheck className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="font-semibold mb-2">Today's Status</h3>
          <p className={`text-2xl font-bold capitalize ${
            todayAttendance?.status === 'present' ? 'text-success' : 'text-muted-foreground'
          }`}>
            {todayAttendance?.status || 'Not Marked'}
          </p>
          {todayAttendance?.checkIn && <p className="text-sm text-muted-foreground mt-2">Check-in: {todayAttendance.checkIn}</p>}
          <button
            onClick={handleMarkAttendance}
            disabled={todayAttendance?.status === 'present'}
            className="btn-gov-primary mt-4 w-full disabled:opacity-50"
          >
            {todayAttendance?.status === 'present' ? 'Already Marked' : 'Mark Attendance'}
          </button>
        </div>

        <div className="lg:col-span-2 gov-card">
          <h3 className="font-semibold mb-4">Attendance History</h3>
          <div className="overflow-x-auto">
            <table className="gov-table">
              <thead>
                <tr><th>Date</th><th>Status</th><th>Check In</th><th>Check Out</th></tr>
              </thead>
              <tbody>
                {attendanceRecords.slice(0, 10).map((record) => (
                  <tr key={record.id}>
                    <td>{new Date(record.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <span className={`status-badge ${
                        record.status === 'present' ? 'bg-success/15 text-success' :
                        record.status === 'absent' ? 'bg-destructive/15 text-destructive' :
                        record.status === 'leave' ? 'bg-warning/15 text-warning' : 'bg-muted text-muted-foreground'
                      }`}>{record.status}</span>
                    </td>
                    <td>{record.checkIn || '-'}</td>
                    <td>{record.checkOut || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
