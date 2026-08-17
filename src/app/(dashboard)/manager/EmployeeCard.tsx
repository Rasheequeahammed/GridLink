'use client';

import { Button } from '@/components/ui/button';
import { approveEmployeeAction, rejectEmployeeAction } from './actions';
import { useState } from 'react';
import { MessageCircle, Check, X } from 'lucide-react';

export default function EmployeeCard({ employee }: { employee: any }) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await approveEmployeeAction(employee.id);
    setLoading(false);
  };

  const handleApproveAndWhatsApp = async () => {
    setLoading(true);
    await approveEmployeeAction(employee.id);
    
    if (employee.phone) {
      const message = encodeURIComponent(`Hi ${employee.first_name}, your GridLink account has been approved!`);
      const phone = employee.phone.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
    setLoading(false);
  };

  const handleReject = async () => {
    if (!confirm(`Are you sure you want to reject ${employee.first_name}?`)) return;
    setLoading(true);
    await rejectEmployeeAction(employee.id);
    setLoading(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6 gap-4">
      <div>
        <h3 className="text-lg font-medium text-white">{employee.first_name} {employee.last_name}</h3>
        <p className="text-slate-400 text-sm">{employee.email}</p>
        {employee.phone && <p className="text-slate-500 text-sm mt-1">{employee.phone}</p>}
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
          className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
          onClick={handleApprove}
          disabled={loading}
        >
          <Check className="w-4 h-4 mr-2" />
          Approve Only
        </Button>
        {employee.phone && (
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20 text-white"
            onClick={handleApproveAndWhatsApp}
            disabled={loading}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Approve & Notify
          </Button>
        )}
      </div>
    </div>
  );
}
