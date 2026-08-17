import { createClient } from '@/lib/supabase/server';
import EmployeeCard from './EmployeeCard';
import Link from 'next/link';
import { Users } from 'lucide-react';

export default async function ManagerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: employees } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'employee')
    .eq('status', 'pending')
    .eq('manager_id', user?.id);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-4xl space-y-8 pt-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Manager Dashboard</h1>
            <p className="text-slate-400 mt-2">Approve your pending crew members.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link 
              href="/manager/clients" 
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-700 border border-slate-700 shrink-0"
            >
              Clients & Tasks
            </Link>
            <Link 
              href="/manager/attendance" 
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-700 border border-slate-700 shrink-0"
            >
              Attendance Log
            </Link>
            <Link 
              href="/manager/crew" 
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 shadow-lg shadow-indigo-900/20 shrink-0"
            >
              <Users className="h-4 w-4" />
              View My Crew
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {(!employees || employees.length === 0) ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 text-center text-slate-400">
              No employees pending approval.
            </div>
          ) : (
            employees.map(emp => (
              <EmployeeCard key={emp.id} employee={emp} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
