import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ManagerTable from './ManagerTable';

export default async function AdminDirectoryPage() {
  const supabase = await createClient();
  
  const { data: managers } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'manager')
    .in('status', ['approved', 'rejected'])
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-5xl space-y-8 pt-6">
        <div>
          <Link 
            href="/admin" 
            className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">Managers Directory</h1>
          <p className="text-slate-400 mt-2">Manage all registered Electrician Managers across the platform.</p>
        </div>

        <ManagerTable managers={managers || []} />
      </div>
    </div>
  );
}
