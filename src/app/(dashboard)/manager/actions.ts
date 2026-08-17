'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function approveEmployeeAction(id: string) {
  const supabase = await createClient();
  await supabase.from('profiles').update({ status: 'approved' }).eq('id', id);
  revalidatePath('/manager', 'layout');
}

export async function rejectEmployeeAction(id: string) {
  const supabase = await createClient();
  await supabase.from('profiles').update({ status: 'rejected' }).eq('id', id);
  revalidatePath('/manager', 'layout');
}
