import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import ClientList from './ClientList';

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
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
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Clients & Tasks</h1>
              <p className="text-slate-400 mt-2">Manage work sites and track task statuses.</p>
            </div>
            <Link 
              href="/manager/clients/new" 
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 shadow-lg shadow-indigo-900/20 shrink-0"
            >
              <Plus className="h-4 w-4" />
              Add New Client
            </Link>
          </div>
        </div>

        <ClientList clients={clients || []} />
      </div>
    </div>
  );
}
