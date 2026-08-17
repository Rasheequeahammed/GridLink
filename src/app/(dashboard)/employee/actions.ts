'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function clockInAction(client_id: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: profile } = await supabase.from('profiles').select('manager_id').eq('id', user.id).single();

  const { error } = await supabase.from('attendance').insert({
    employee_id: user.id,
    manager_id: profile?.manager_id,
    client_id: client_id || null,
    clock_in: new Date().toISOString()
  });

  if (error) return { error: error.message };
  revalidatePath('/employee', 'layout');
  return { success: true };
}

export async function clockOutAction(attendance_id: string, notes: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.from('attendance').update({
    clock_out: new Date().toISOString(),
    notes
  }).eq('id', attendance_id);

  if (error) return { error: error.message };
  revalidatePath('/employee', 'layout');
  return { success: true };
}
