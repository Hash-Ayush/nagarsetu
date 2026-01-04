import React from 'react';
import { useAppData } from '@/context/AppDataContext';
import { ClipboardList } from 'lucide-react';

export default function VacanciesPage() {
  const { vacancies } = useAppData();
  const total = vacancies.reduce((a, v) => ({ s: a.s + v.sanctionedPosts, f: a.f + v.filledPosts, v: a.v + v.vacantPosts }), { s: 0, f: 0, v: 0 });

  return (
    <div className="space-y-6">
      <div className="page-header"><h1 className="page-title">Vacancies</h1><p className="page-subtitle">Sanctioned vs filled posts overview</p></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="gov-card text-center"><p className="text-2xl font-bold">{total.s}</p><p className="text-sm text-muted-foreground">Sanctioned</p></div>
        <div className="gov-card text-center"><p className="text-2xl font-bold text-success">{total.f}</p><p className="text-sm text-muted-foreground">Filled</p></div>
        <div className="gov-card text-center"><p className="text-2xl font-bold text-warning">{total.v}</p><p className="text-sm text-muted-foreground">Vacant</p></div>
      </div>
      <div className="gov-card">
        <table className="gov-table">
          <thead><tr><th>Department</th><th>Designation</th><th>Sanctioned</th><th>Filled</th><th>Vacant</th><th>Fill Rate</th></tr></thead>
          <tbody>
            {vacancies.map((v) => (
              <tr key={v.id}><td>{v.department}</td><td>{v.designation}</td><td>{v.sanctionedPosts}</td><td>{v.filledPosts}</td><td className="text-warning">{v.vacantPosts}</td>
                <td><div className="progress-bar w-20 h-2"><div className="progress-fill bg-primary" style={{ width: `${(v.filledPosts / v.sanctionedPosts) * 100}%` }} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
