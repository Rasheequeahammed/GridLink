'use client';

import { useState } from 'react';
import { updateClientStatusAction } from './actions';
import { MapPin, Phone, Briefcase, CheckCircle, Clock } from 'lucide-react';

export default function ClientList({ clients }: { clients: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    await updateClientStatusAction(id, newStatus);
    setLoadingId(null);
  };

  if (!clients || clients.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 text-center text-slate-400">
        You haven't added any clients or tasks yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {clients.map(client => (
        <div key={client.id} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl relative overflow-hidden">
          {client.status === 'completed' && (
            <div className="absolute top-0 right-0 p-4">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                Completed
              </span>
            </div>
          )}
          {client.status === 'in_progress' && (
            <div className="absolute top-0 right-0 p-4">
              <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400 border border-amber-500/20">
                In Progress
              </span>
            </div>
          )}

          <h3 className="text-xl font-bold text-white mb-4 pr-24">{client.client_name}</h3>
          
          <div className="space-y-3 mb-6 flex-1">
            {client.client_contact && (
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-300">{client.client_contact}</span>
              </div>
            )}
            {client.client_address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-300">{client.client_address}</span>
              </div>
            )}
            {client.task_description && (
              <div className="flex items-start gap-3">
                <Briefcase className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-300">{client.task_description}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t border-slate-800">
            {client.status !== 'in_progress' && (
              <button
                onClick={() => handleStatusChange(client.id, 'in_progress')}
                disabled={loadingId === client.id}
                className="flex-1 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 text-sm font-medium transition-colors hover:bg-indigo-600/20 disabled:opacity-50"
              >
                <Clock className="h-4 w-4" />
                Start Work
              </button>
            )}
            {client.status !== 'completed' && (
              <button
                onClick={() => handleStatusChange(client.id, 'completed')}
                disabled={loadingId === client.id}
                className="flex-1 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium transition-colors hover:bg-emerald-600/20 disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                Mark Complete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
