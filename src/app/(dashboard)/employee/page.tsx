import { createClient } from '@/lib/supabase/server';
import { ShieldAlert, MessageCircle, Info } from 'lucide-react';

export default async function EmployeeDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let managerData = null;

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('manager_id')
      .eq('id', user.id)
      .single();

    if (profile?.manager_id) {
      const { data: manager } = await supabase
        .from('profiles')
        .select('first_name, last_name, email, phone')
        .eq('id', profile.manager_id)
        .single();

      managerData = manager;
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-4xl space-y-8 pt-12">
        <div>
          <h1 className="text-3xl font-bold text-white">Employee Dashboard</h1>
          <p className="text-slate-400 mt-2">Welcome back. View your active tasks and schedules below.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-slate-900/50 p-8 border border-slate-800/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Info className="h-5 w-5 text-indigo-400" />
              Your Manager
            </h2>
            
            {managerData ? (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Name</p>
                  <p className="text-lg font-medium text-white">{managerData.first_name} {managerData.last_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-base text-slate-300">{managerData.email}</p>
                </div>
                
                {managerData.phone && (
                  <div className="pt-4 border-t border-slate-800">
                    <a 
                      href={`https://wa.me/${managerData.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-emerald-700 shadow-lg shadow-emerald-900/20"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Contact on WhatsApp
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-400">No manager assigned to your profile.</p>
            )}
          </div>
          
          <div className="rounded-3xl bg-slate-900/50 p-8 border border-slate-800/50 shadow-xl flex flex-col items-center justify-center text-center border-dashed">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50 mb-4">
              <ShieldAlert className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-300">No active tasks</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-[250px]">
              Your manager hasn't assigned any schedules or tasks to you yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
