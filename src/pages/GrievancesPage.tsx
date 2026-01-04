import React, { useState } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { FileText, Plus, Clock, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function GrievancesPage() {
  const { user } = useAuth();
  const { grievances, addGrievance, updateGrievanceStatus } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !subject || !description) {
      toast({ title: 'Error', description: 'Please fill all fields.', variant: 'destructive' });
      return;
    }
    addGrievance({ userId: user?.id || '', category, subject, description, priority });
    toast({ title: 'Grievance Submitted', description: 'Your grievance has been registered.' });
    setShowForm(false);
    setCategory(''); setSubject(''); setDescription('');
  };

  const isOfficerOrAdmin = user?.role === 'officer' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title">Grievances</h1>
          <p className="page-subtitle">{isOfficerOrAdmin ? 'Review and manage grievances' : 'Raise and track your grievances'}</p>
        </div>
        {!isOfficerOrAdmin && (
          <button onClick={() => setShowForm(true)} className="btn-gov-primary">
            <Plus className="w-4 h-4" /> Raise Grievance
          </button>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-lg animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Raise New Grievance</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="gov-label">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="gov-input">
                  <option value="">Select category</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Payroll">Payroll</option>
                  <option value="Leave">Leave</option>
                  <option value="Workplace">Workplace</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="gov-label">Subject</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} className="gov-input" placeholder="Brief subject" />
              </div>
              <div>
                <label className="gov-label">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="gov-input min-h-[100px]" placeholder="Detailed description" />
              </div>
              <div>
                <label className="gov-label">Priority</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <button key={p} type="button" onClick={() => setPriority(p)} className={`px-4 py-2 rounded-lg border capitalize ${priority === p ? 'bg-primary text-primary-foreground' : 'border-border'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn-gov-primary w-full">Submit Grievance</button>
            </form>
          </div>
        </div>
      )}

      <div className="gov-card">
        <h3 className="font-semibold mb-4">{isOfficerOrAdmin ? 'All Grievances' : 'Your Grievances'}</h3>
        <div className="space-y-4">
          {grievances.map((g) => (
            <div key={g.id} className="p-4 border border-border rounded-xl">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h4 className="font-medium">{g.subject}</h4>
                  <p className="text-sm text-muted-foreground">{g.category} • {new Date(g.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <span className={`shrink-0 ${g.status === 'resolved' ? 'status-resolved' : g.status === 'in-review' ? 'status-active' : 'status-pending'}`}>
                  {g.status.replace('-', ' ')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{g.description}</p>
              <div className="space-y-2">
                {g.timeline.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="w-3 h-3 text-success" />
                    <span>{t.status}: {t.message}</span>
                  </div>
                ))}
              </div>
              {isOfficerOrAdmin && g.status !== 'resolved' && (
                <div className="flex gap-2 mt-4">
                  <button onClick={() => { updateGrievanceStatus(g.id, 'in-review', 'Under review by officer'); toast({ title: 'Updated' }); }} className="btn-gov-secondary text-xs py-1.5">Mark In Review</button>
                  <button onClick={() => { updateGrievanceStatus(g.id, 'resolved', 'Issue has been resolved'); toast({ title: 'Resolved' }); }} className="btn-gov-primary text-xs py-1.5">Mark Resolved</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
