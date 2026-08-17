import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClientAction } from '../actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function NewClientPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-2xl space-y-8 pt-6">
        <div>
          <Link 
            href="/manager/clients" 
            className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Link>
          <h1 className="text-3xl font-bold text-white">Add New Client</h1>
          <p className="text-slate-400 mt-2">Create a new work site or task for your crew.</p>
        </div>

        <div className="rounded-3xl bg-slate-900/80 p-8 shadow-2xl border border-slate-800/50 backdrop-blur-xl">
          <form action={createClientAction} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Client Name *</label>
              <Input name="client_name" required placeholder="e.g. Acme Corp Office" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Address</label>
              <Input name="client_address" placeholder="e.g. 123 Business Ave, Suite 100" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Contact Phone/Email</label>
              <Input name="client_contact" placeholder="e.g. John Doe (555-0199)" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Task Description</label>
              <textarea 
                name="task_description" 
                rows={4}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                placeholder="e.g. Full electrical wiring and light fixture installation."
              ></textarea>
            </div>

            <Button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">
              Create Client Task
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
