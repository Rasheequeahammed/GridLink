import { createClient } from '@/lib/supabase/server';
import { ShieldAlert, MessageCircle, Info } from 'lucide-react';
import TimeTracker from './TimeTracker';

export default async function EmployeeDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let managerData: any = null;
  let activeSessions: any[] = [];
  let activeTasks: any[] = [];

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

      const { data: attendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', user.id)
        .is('clock_out', null)
        .order('clock_in', { ascending: false });

      activeSessions = attendance || [];

      const { data: tasks } = await supabase
        .from('tasks')
        .select('id, task_description, clients!inner(client_name, manager_id)')
        .eq('clients.manager_id', profile.manager_id)
        .neq('status', 'completed');
        
      activeTasks = tasks?.map((t: any) => ({
        id: t.id,
        task_description: t.task_description,
        client_name: t.clients.client_name
      })) || [];
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 pb-24">
      <div className="mx-auto max-w-xl space-y-8 pt-8">
        <div>
          <h1 className="text-3xl font-bold text-white text-center mb-8">Employee Hub</h1>
          
          <div className="rounded-[2rem] bg-slate-900/80 p-8 border border-slate-800/80 shadow-xl mb-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="bg-indigo-500/10 p-2 rounded-lg">
                <Info className="h-5 w-5 text-indigo-400" />
              </div>
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
          
          <TimeTracker activeSessions={activeSessions} tasks={activeTasks} />
        </div>
      </div>
    </div>
  );
}
