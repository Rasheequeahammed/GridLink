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
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-4xl space-y-8 pt-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 mt-2">Approve pending Electrician Managers.</p>
          </div>
          <Link 
            href="/admin/managers" 
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 shadow-lg shadow-indigo-900/20 shrink-0"
          >
            <Users className="h-4 w-4" />
            View Managers Directory
          </Link>
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
