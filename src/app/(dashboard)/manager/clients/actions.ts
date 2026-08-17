'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createClientAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const client_name = formData.get('client_name') as string;
  const client_address = formData.get('client_address') as string;
  const client_contact = formData.get('client_contact') as string;
  const task_description = formData.get('task_description') as string;

  await supabase.from('clients').insert({
    manager_id: user.id,
    client_name,
    client_address,
    client_contact,
    task_description,
    status: 'pending'
  });

  revalidatePath('/manager', 'layout');
  redirect('/manager/clients');
}

export async function updateClientStatusAction(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from('clients').update({ status }).eq('id', id);
  revalidatePath('/manager', 'layout');
}
