'use client';

import { Button } from '@/components/ui/button';
import { approveManagerAction, rejectManagerAction } from './actions';
import { useState } from 'react';
import { Check, X } from 'lucide-react';

export default function ManagerCard({ manager }: { manager: any }) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await approveManagerAction(manager.id);
    setLoading(false);
  };

  const handleReject = async () => {
    if (!confirm(`Are you sure you want to reject ${manager.first_name}?`)) return;
    setLoading(true);
    await rejectManagerAction(manager.id);
    setLoading(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6 gap-4">
      <div>
        <h3 className="text-lg font-medium text-white">{manager.first_name} {manager.last_name}</h3>
        <p className="text-slate-400 text-sm">{manager.email}</p>
        {manager.phone && <p className="text-slate-500 text-sm mt-1">{manager.phone}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <Button 
          variant="outline" 
          className="bg-transparent border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400"
          onClick={handleReject}
          disabled={loading}
        >
          <X className="w-4 h-4 mr-2" />
          Reject
        </Button>
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20 text-white"
          onClick={handleApprove}
          disabled={loading}
        >
          <Check className="w-4 h-4 mr-2" />
          Approve
        </Button>
      </div>
    </div>
  );
}
