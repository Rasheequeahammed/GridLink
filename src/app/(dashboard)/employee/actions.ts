'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function clockInAction(task_id: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  if (!task_id) return { error: 'Task is required' };

  const { error } = await supabase.from('attendance').insert({
    employee_id: user.id,
    task_id: task_id,
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
