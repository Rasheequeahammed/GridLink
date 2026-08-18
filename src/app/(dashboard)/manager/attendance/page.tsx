import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AttendanceLog from './AttendanceLog';

export default async function AttendancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  // Fetch employees
  const { data: employees } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .eq('manager_id', user.id);

  const employeeIds = employees?.map(e => e.id) || [];

  // Fetch attendance
  let attendance = [];
  if (employeeIds.length > 0) {
    const { data } = await supabase
      .from('attendance')
      .select('*')
      .in('employee_id', employeeIds)
      .order('clock_in', { ascending: false });
    attendance = data || [];
  }

  // Fetch tasks and clients
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, clients!inner(id, client_name, manager_id)')
    .eq('clients.manager_id', user.id);

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6 md:space-y-8 pt-4 md:pt-6">
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
          tasks={tasks || []} 
        />
      </div>
    </div>
  );
}
