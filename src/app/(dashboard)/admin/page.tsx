import { createClient } from '@/lib/supabase/server';
import ManagerCard from './ManagerCard';
import Link from 'next/link';
import { Users } from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  const { data: managers } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'manager')
    .eq('status', 'pending');

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 pb-24">
      <div className="mx-auto max-w-xl space-y-8 pt-8">
        <div>
          <h1 className="text-3xl font-bold text-white text-center mb-8">Admin Hub</h1>
          
          <div className="grid grid-cols-1 gap-4 mb-10">
            <Link href="/admin/managers" className="flex items-center gap-6 bg-slate-900/80 border border-slate-800/80 rounded-[2rem] p-6 transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-95 shadow-xl">
              <div className="bg-indigo-500/10 p-5 rounded-2xl shrink-0">
                <Users className="h-10 w-10 text-indigo-400" />
              </div>
              <div>
                <span className="block font-bold text-xl text-white tracking-wide mb-1">Manager Directory</span>
                <span className="text-sm text-slate-400">View and manage all approved electrician managers.</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-bold text-white">Pending Approvals</h2>
            {managers && managers.length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {managers.length}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {(!managers || managers.length === 0) ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 text-center text-slate-400">
              No managers pending approval.
            </div>
          ) : (
            managers.map(manager => (
              <ManagerCard key={manager.id} manager={manager} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
