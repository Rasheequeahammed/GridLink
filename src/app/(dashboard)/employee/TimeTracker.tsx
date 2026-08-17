'use client';

import { useState } from 'react';
import { clockInAction, clockOutAction } from './actions';
import { Play, Square, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TimeTracker({ activeSessions, tasks }: { activeSessions: any[], tasks: any[] }) {
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showNotesModal, setShowNotesModal] = useState<string | null>(null);
  const [isClockingIn, setIsClockingIn] = useState(false);

  const handleClockIn = async () => {
    if (!selectedTask && tasks.length > 0) {
      alert('Please select a task to work on.');
      return;
    }
    
    // Prevent double-clocking into the same task
    if (activeSessions.some(session => session.task_id === selectedTask)) {
      alert('You are already clocked into this task.');
      return;
    }

    setIsClockingIn(true);
    await clockInAction(selectedTask || null);
    setIsClockingIn(false);
    setSelectedTask('');
  };

  const handleClockOut = async (sessionId: string) => {
    setLoadingId(sessionId);
    await clockOutAction(sessionId, notes[sessionId] || '');
    setLoadingId(null);
    setShowNotesModal(null);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Clock In Section */}
      <div className="rounded-3xl bg-slate-900/50 p-6 border border-slate-800/50 shadow-xl flex flex-col items-center text-center">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Play className="h-5 w-5 text-emerald-400 fill-current" /> Start a Task
        </h3>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Select a task to start tracking time. You can work on multiple tasks at once.
        </p>

        <div className="w-full max-w-sm flex flex-col sm:flex-row gap-3">
          {tasks.length > 0 ? (
            <select 
              value={selectedTask} 
              onChange={e => setSelectedTask(e.target.value)}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
            >
              <option value="" disabled>-- Select Task --</option>
              {tasks.map(t => (
                <option key={t.id} value={t.id}>{t.client_name} - {t.task_description}</option>
              ))}
            </select>
          ) : (
            <p className="text-amber-400 text-sm mb-4">Your manager hasn't assigned any tasks yet.</p>
          )}

          <Button 
            onClick={handleClockIn} 
            disabled={isClockingIn || (tasks.length > 0 && !selectedTask)} 
            className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap"
          >
            Clock In
          </Button>
        </div>
      </div>

      {/* Active Sessions Section */}
      {activeSessions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-400" /> Active Sessions ({activeSessions.length})
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {activeSessions.map((session) => {
              const activeTask = tasks.find(t => t.id === session.task_id);
              
              return (
                <div key={session.id} className="rounded-2xl bg-slate-900 border border-slate-800 shadow-lg p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500/80"></div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-white">
                        {activeTask ? `${activeTask.client_name} - ${activeTask.task_description}` : 'General Task'}
                      </h4>
                      <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Clocked in at {new Date(session.clock_in).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>

                    {!showNotesModal || showNotesModal !== session.id ? (
                      <Button 
                        onClick={() => setShowNotesModal(session.id)} 
                        className="bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20"
                      >
                        <Square className="h-4 w-4 mr-2 fill-current" />
                        Clock Out
                      </Button>
                    ) : (
                      <div className="w-full sm:w-80 bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <label className="block text-xs font-medium text-slate-400 mb-2">Shift Notes (Optional)</label>
                        <textarea 
                          value={notes[session.id] || ''}
                          onChange={e => setNotes({...notes, [session.id]: e.target.value})}
                          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none mb-3"
                          rows={2}
                          placeholder="What did you work on?"
                        ></textarea>
                        <div className="flex gap-2">
                          <Button onClick={() => setShowNotesModal(null)} variant="outline" className="flex-1 h-8 text-xs border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800">Cancel</Button>
                          <Button onClick={() => handleClockOut(session.id)} disabled={loadingId === session.id} className="flex-1 h-8 text-xs bg-red-600 hover:bg-red-700">Confirm</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
