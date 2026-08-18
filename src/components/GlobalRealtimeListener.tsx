'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function GlobalRealtimeListener() {
  const router = useRouter();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase.channel('global_dashboard_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, () => {
        router.refresh();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        router.refresh();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => {
        router.refresh();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        router.refresh();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);

  // This component doesn't render anything visible
  return null;
}
