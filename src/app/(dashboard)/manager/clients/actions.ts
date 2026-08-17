'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createClientAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const client_name = formData.get('client_name') as string;
  const client_address = formData.get('client_address') as string;
  const client_contact = formData.get('client_contact') as string;
  const task_description = formData.get('task_description') as string;

  // 1. Check if the client already exists for this manager
  let { data: existingClient } = await supabase
    .from('clients')
    .select('id')
    .eq('manager_id', user.id)
    .ilike('client_name', client_name)
    .single();

  let clientId = existingClient?.id;

  // 2. If client does not exist, create it
  if (!clientId) {
    const { data: newClient, error: clientError } = await supabase
      .from('clients')
      .insert({
        manager_id: user.id,
        client_name,
        client_address,
        client_contact,
        status: 'active'
      })
      .select('id')
      .single();
      
    if (clientError) return { error: 'Failed to create client.' };
    clientId = newClient.id;
  }

  // 3. Check for duplicate task for this client
  const { data: existingTask } = await supabase
    .from('tasks')
    .select('id')
    .eq('client_id', clientId)
    .ilike('task_description', task_description)
    .single();

  if (existingTask) {
    // Return to the form with an error (handled in the component)
    return { error: 'This task already exists for this client!' };
  }

  // 4. Insert the new task
  await supabase.from('tasks').insert({
    client_id: clientId,
    task_description,
    status: 'pending'
  });

  revalidatePath('/manager', 'layout');
  redirect('/manager/clients');
}

export async function updateTaskStatusAction(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from('tasks').update({ status }).eq('id', id);
  revalidatePath('/manager', 'layout');
}
