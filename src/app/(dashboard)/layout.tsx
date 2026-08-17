import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, first_name, last_name, status')
    .eq('id', user.id)
    .single();

  if (profile?.status === 'rejected') {
    redirect('/sign-in');
  }

  async function handleSignOut() {
    'use server';
    const supabaseClient = await createClient();
    await supabaseClient.auth.signOut();
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold tracking-tight text-white">GridLink</span>
            {profile && (
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 capitalize">
                {profile.role}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {profile && (
              <span className="text-sm font-medium text-slate-300 hidden sm:inline-block">
                {profile.first_name} {profile.last_name}
              </span>
            )}
            <form action={handleSignOut}>
              <button 
                type="submit" 
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
