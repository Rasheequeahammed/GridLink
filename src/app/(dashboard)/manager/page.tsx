import { createClient } from '@/lib/supabase/server';
import EmployeeCard from './EmployeeCard';
import Link from 'next/link';
import { Users, Briefcase, Clock, PlusCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 pb-24">
      <div className="mx-auto max-w-xl space-y-8 pt-8">
        <div>
          <h1 className="text-3xl font-bold text-white text-center mb-8">Manager Hub</h1>
          
          {/* Mobile App Grid */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <Link href="/manager/clients" className="flex flex-col items-center justify-center bg-slate-900/80 border border-slate-800/80 rounded-[2rem] p-6 aspect-square transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-95 shadow-xl">
              <div className="bg-indigo-500/10 p-5 rounded-2xl mb-4">
                <Briefcase className="h-10 w-10 text-indigo-400" />
              </div>
              <span className="font-semibold text-white tracking-wide">Tasks</span>
            </Link>

            <Link href="/manager/attendance" className="flex flex-col items-center justify-center bg-slate-900/80 border border-slate-800/80 rounded-[2rem] p-6 aspect-square transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-95 shadow-xl">
              <div className="bg-emerald-500/10 p-5 rounded-2xl mb-4">
                <Clock className="h-10 w-10 text-emerald-400" />
              </div>
              <span className="font-semibold text-white tracking-wide">Logs</span>
            </Link>

            <Link href="/manager/crew" className="flex flex-col items-center justify-center bg-slate-900/80 border border-slate-800/80 rounded-[2rem] p-6 aspect-square transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-95 shadow-xl">
              <div className="bg-amber-500/10 p-5 rounded-2xl mb-4">
                <Users className="h-10 w-10 text-amber-400" />
              </div>
              <span className="font-semibold text-white tracking-wide">My Crew</span>
            </Link>

            <Link href="/manager/clients/new" className="flex flex-col items-center justify-center bg-indigo-600 border border-indigo-500/80 rounded-[2rem] p-6 aspect-square transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 shadow-xl shadow-indigo-900/20">
              <div className="bg-white/20 p-5 rounded-2xl mb-4">
                <PlusCircle className="h-10 w-10 text-white" />
              </div>
              <span className="font-semibold text-white tracking-wide">New Task</span>
            </Link>
          </div>
          
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-bold text-white">Pending Approvals</h2>
            {employees && employees.length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {employees.length}
              </span>
            )}
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
