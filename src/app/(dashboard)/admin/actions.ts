'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function approveManagerAction(id: string) {
  const supabase = await createClient();
  await supabase.from('profiles').update({ status: 'approved' }).eq('id', id);
  revalidatePath('/admin', 'layout');
}

export async function rejectManagerAction(id: string) {
  const supabase = await createClient();
  await supabase.from('profiles').update({ status: 'rejected' }).eq('id', id);
  revalidatePath('/admin', 'layout');
}
