'use client';

import { useState } from 'react';
import { rejectEmployeeAction, approveEmployeeAction } from '../actions';
import { X, Phone, Mail, CheckCircle } from 'lucide-react';

export default function CrewTable({ employees }: { employees: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSuspend = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to suspend ${name}? They will lose access immediately.`)) return;
    
    setLoadingId(id);
    await rejectEmployeeAction(id);
    setLoadingId(null);
  };

  const handleUnblock = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to unblock ${name} and restore their access?`)) return;
    
    setLoadingId(id);
    await approveEmployeeAction(id);
    setLoadingId(null);
  };

  if (!employees || employees.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 text-center text-slate-400">
        You do not have any crew members yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {employees.map((emp) => (
              <tr key={emp.id} className={`transition-colors hover:bg-slate-800/50 ${emp.status === 'rejected' ? 'opacity-75' : ''}`}>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{emp.first_name} {emp.last_name}</div>
                  <div className="text-xs text-slate-500 capitalize">{emp.role}</div>
                </td>
                <td className="px-6 py-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-slate-500" />
                    <span>{emp.email}</span>
                  </div>
                  {emp.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-slate-500" />
                      <span>{emp.phone}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {emp.status === 'approved' ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 border border-red-500/20">
                      Suspended
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {emp.status === 'approved' ? (
                    <button
                      onClick={() => handleSuspend(emp.id, `${emp.first_name} ${emp.last_name}`)}
                      disabled={loadingId === emp.id}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-red-500/20 bg-transparent px-3 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                    >
                      <X className="h-3 w-3" />
                      {loadingId === emp.id ? 'Wait...' : 'Suspend'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnblock(emp.id, `${emp.first_name} ${emp.last_name}`)}
                      disabled={loadingId === emp.id}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-emerald-500/20 bg-transparent px-3 text-xs font-medium text-emerald-500 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400 disabled:opacity-50"
                    >
                      <CheckCircle className="h-3 w-3" />
                      {loadingId === emp.id ? 'Wait...' : 'Unblock'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
