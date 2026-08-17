'use client';

import { useState } from 'react';
import { updateTaskStatusAction } from './actions';
import { MapPin, Phone, Briefcase, CheckCircle, Clock } from 'lucide-react';

export default function ClientList({ clients }: { clients: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    await updateTaskStatusAction(id, newStatus);
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
    <div className="grid grid-cols-1 gap-6">
      {clients.map(client => (
        <div key={client.id} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl relative overflow-hidden">
          <h3 className="text-xl font-bold text-white mb-4 pr-24">{client.client_name}</h3>
          
          <div className="space-y-3 mb-6">
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
          </div>

          <div className="border-t border-slate-800 pt-6">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Tasks ({client.tasks?.length || 0})
            </h4>
            
            {client.tasks && client.tasks.length > 0 ? (
              <div className="space-y-3">
                {client.tasks.map((task: any) => (
                  <div key={task.id} className="bg-slate-950 rounded-xl p-4 border border-slate-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-200">{task.task_description}</p>
                      
                      <div className="mt-2 flex items-center gap-2">
                        {task.status === 'completed' && (
                          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                            Completed
                          </span>
                        )}
                        {task.status === 'in_progress' && (
                          <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
                            In Progress
                          </span>
                        )}
                        {task.status === 'pending' && (
                          <span className="inline-flex items-center rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-medium text-slate-400 border border-slate-500/20">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto shrink-0">
                      {task.status !== 'in_progress' && (
                        <button
                          onClick={() => handleStatusChange(task.id, 'in_progress')}
                          disabled={loadingId === task.id}
                          className="flex-1 sm:flex-none inline-flex h-8 px-3 items-center justify-center gap-1.5 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 text-xs font-medium transition-colors hover:bg-indigo-600/20 disabled:opacity-50"
                        >
                          <Clock className="h-3.5 w-3.5" />
                          Start
                        </button>
                      )}
                      {task.status !== 'completed' && (
                        <button
                          onClick={() => handleStatusChange(task.id, 'completed')}
                          disabled={loadingId === task.id}
                          className="flex-1 sm:flex-none inline-flex h-8 px-3 items-center justify-center gap-1.5 rounded-lg bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium transition-colors hover:bg-emerald-600/20 disabled:opacity-50"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No tasks added yet.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
