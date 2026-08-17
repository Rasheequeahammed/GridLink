import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CrewTable from './CrewTable';

export default async function CrewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: employees } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'employee')
    .in('status', ['approved', 'rejected'])
    .eq('manager_id', user?.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-5xl space-y-8 pt-6">
        <div>
          <Link 
            href="/manager" 
            className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">My Crew Directory</h1>
          <p className="text-slate-400 mt-2">Manage your approved active team members.</p>
        </div>

        <CrewTable employees={employees || []} />
      </div>
    </div>
  );
}
