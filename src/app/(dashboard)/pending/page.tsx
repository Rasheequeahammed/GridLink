import { ShieldAlert, MessageCircle, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PendingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let managerPhone = null;
  let managerName = null;

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('manager_id')
      .eq('id', user.id)
      .single();
      
    if (profile?.manager_id) {
      const { data: manager } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone')
        .eq('id', profile.manager_id)
        .single();
        
      if (manager) {
        managerPhone = manager.phone;
        managerName = `${manager.first_name} ${manager.last_name}`;
      }
    }
  }

  async function handleSignOut() {
    'use server';
    const supabaseClient = await createClient();
    await supabaseClient.auth.signOut();
    redirect('/sign-in');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center">
      <div className="max-w-md w-full space-y-6 rounded-3xl bg-slate-900/50 p-8 border border-slate-800/50 shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
          <ShieldAlert className="h-8 w-8 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">Approval Pending</h1>
        <p className="text-slate-400 leading-relaxed">
          Your account has been created but is awaiting administrator or manager approval. You will gain access once approved.
        </p>
        
        {managerPhone && (
          <div className="pt-4 border-t border-slate-800">
            <p className="text-sm text-slate-400 mb-4">
              Need access faster? Contact your manager, {managerName}:
            </p>
            <a 
              href={`https://wa.me/${managerPhone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 shadow-lg shadow-emerald-900/20"
            >
              <MessageCircle className="h-5 w-5" />
              Contact on WhatsApp
            </a>
          </div>
        )}

        <div className="pt-2">
          <form action={handleSignOut}>
            <button 
              type="submit"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out & Return to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
