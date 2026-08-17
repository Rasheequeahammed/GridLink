import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AttendanceLog from './AttendanceLog';

export default async function AttendancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  // Fetch all related data manually to avoid Supabase FK resolution issues
  const { data: attendance } = await supabase
    .from('attendance')
    .select('*')
    .eq('manager_id', user.id)
    .order('clock_in', { ascending: false });

  const { data: employees } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .eq('manager_id', user.id);

  const { data: clients } = await supabase
    .from('clients')
    .select('id, client_name')
    .eq('manager_id', user.id);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-6xl space-y-8 pt-6">
        <div>
          <Link 
            href="/manager" 
            className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold text-white">Attendance & Timesheets</h1>
          <p className="text-slate-400 mt-2">Monitor daily logs and track hours across your crew and clients.</p>
        </div>

        <AttendanceLog 
          attendance={attendance || []} 
          employees={employees || []} 
          clients={clients || []} 
        />
      </div>
    </div>
  );
}
