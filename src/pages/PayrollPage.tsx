import React from 'react';
import { useAppData } from '@/context/AppDataContext';
import { Wallet, Download, CheckCircle } from 'lucide-react';

export default function PayrollPage() {
  const { payrollRecords } = useAppData();
  const latest = payrollRecords[0];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Payroll</h1>
        <p className="page-subtitle">View your salary details and history</p>
      </div>

      {latest && (
        <div className="gov-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Latest Payslip - {latest.month} {latest.year}</h3>
            <button className="btn-gov-secondary"><Download className="w-4 h-4" /> Download PDF</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-muted/50 rounded-xl"><p className="text-sm text-muted-foreground">Basic Salary</p><p className="text-xl font-bold">₹{latest.basicSalary.toLocaleString()}</p></div>
            <div className="p-4 bg-success/10 rounded-xl"><p className="text-sm text-muted-foreground">Allowances</p><p className="text-xl font-bold text-success">+₹{latest.allowances.toLocaleString()}</p></div>
            <div className="p-4 bg-destructive/10 rounded-xl"><p className="text-sm text-muted-foreground">Deductions</p><p className="text-xl font-bold text-destructive">-₹{latest.deductions.toLocaleString()}</p></div>
            <div className="p-4 bg-primary/10 rounded-xl"><p className="text-sm text-muted-foreground">Net Salary</p><p className="text-xl font-bold text-primary">₹{latest.netSalary.toLocaleString()}</p></div>
          </div>
          <div className="flex items-center gap-2 text-sm text-success"><CheckCircle className="w-4 h-4" /> Paid on {latest.paidOn}</div>
        </div>
      )}

      <div className="gov-card">
        <h3 className="font-semibold mb-4">Payment History</h3>
        <table className="gov-table">
          <thead><tr><th>Month</th><th>Basic</th><th>Allowances</th><th>Deductions</th><th>Net</th><th>Status</th></tr></thead>
          <tbody>
            {payrollRecords.map((p) => (
              <tr key={p.id}>
                <td>{p.month} {p.year}</td>
                <td>₹{p.basicSalary.toLocaleString()}</td>
                <td className="text-success">+₹{p.allowances.toLocaleString()}</td>
                <td className="text-destructive">-₹{p.deductions.toLocaleString()}</td>
                <td className="font-semibold">₹{p.netSalary.toLocaleString()}</td>
                <td><span className="status-active">{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
