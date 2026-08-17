'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignInPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      alert(error.message);
      setIsLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, status')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        if (profile.status === 'rejected') {
          await supabase.auth.signOut();
          alert('Your account has been suspended by your manager. Access is denied.');
          setIsLoading(false);
          return;
        } else if (profile.status === 'pending') {
          router.push('/pending');
        } else {
          router.push(`/${profile.role}`);
        }
      } else {
         router.push('/');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-slate-900/80 p-8 shadow-2xl border border-slate-800/50 backdrop-blur-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-400">Sign in to your account.</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-5">
          <Input 
            type="email" 
            placeholder="Email Address" 
            required 
            onChange={e => setFormData({...formData, email: e.target.value})} 
          />
          <Input 
            type="password" 
            placeholder="Password" 
            required 
            onChange={e => setFormData({...formData, password: e.target.value})} 
          />
          <Button type="submit" disabled={isLoading} className="w-full mt-4">
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don&apos;t have an account?{' '}
            <a href="/sign-up" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
