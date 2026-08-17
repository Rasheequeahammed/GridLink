'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();
  const [role, setRole] = useState<'manager' | 'employee'>('employee');
  const [managers, setManagers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', managerId: '', phone: ''
  });

  useEffect(() => {
    async function fetchManagers() {
      const { data } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('role', 'manager')
        .eq('status', 'approved');
      if (data) setManagers(data);
    }
    fetchManagers();
  }, [supabase]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (authError || !authData.user) {
      alert(authError?.message || 'Error signing up');
      setIsLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      role: role,
      status: 'pending',
      manager_id: role === 'employee' ? formData.managerId : null,
    });

    if (profileError) {
      alert('Profile creation failed. Error: ' + profileError.message);
      setIsLoading(false);
      return;
    }

    router.push('/pending');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-slate-900/80 p-8 shadow-2xl border border-slate-800/50 backdrop-blur-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">Join GridLink</h2>
          <p className="mt-2 text-sm text-slate-400">Create your account to continue.</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              placeholder="First Name" 
              required 
              onChange={e => setFormData({...formData, firstName: e.target.value})} 
            />
            <Input 
              placeholder="Last Name" 
              required 
              onChange={e => setFormData({...formData, lastName: e.target.value})} 
            />
          </div>
          
          <Input 
            type="email" 
            placeholder="Email Address" 
            required 
            onChange={e => setFormData({...formData, email: e.target.value})} 
          />

          <Input 
            type="tel" 
            placeholder="WhatsApp Number (with country code)" 
            required 
            onChange={e => setFormData({...formData, phone: e.target.value})} 
          />
          
          <Input 
            type="password" 
            placeholder="Password" 
            required 
            onChange={e => setFormData({...formData, password: e.target.value})} 
          />

          <div className="space-y-3 pt-2">
            <label className="text-sm font-medium text-slate-300">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('employee')}
                className={`h-12 rounded-xl border transition-all ${role === 'employee' ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
              >
                Employee
              </button>
              <button
                type="button"
                onClick={() => setRole('manager')}
                className={`h-12 rounded-xl border transition-all ${role === 'manager' ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
              >
                Manager
              </button>
            </div>
          </div>

          {role === 'employee' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Select your Manager</label>
              <select 
                required
                className="flex h-12 w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 text-sm text-slate-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                onChange={e => setFormData({...formData, managerId: e.target.value})}
              >
                <option value="" className="bg-slate-900 text-slate-400">Choose a manager...</option>
                {managers.map(m => (
                  <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                    {m.first_name} {m.last_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full mt-4">
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <a href="/sign-in" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
