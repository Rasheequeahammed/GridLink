'use client';

import { useState } from 'react';
import { Clock, User, Briefcase, Filter, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AttendanceLog({ 
  attendance, 
  employees, 
  clients 
}: { 
  attendance: any[], 
  employees: any[], 
  clients: any[] 
}) {
  const [employeeFilter, setEmployeeFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');

  // Format a timestamp to duration
  const getDuration = (clockIn: string, clockOut: string | null) => {
    if (!clockOut) return 'In Progress';
    const diff = new Date(clockOut).getTime() - new Date(clockIn).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Format date
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Format time
  const formatTime = (isoString: string | null) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Merge data for display
  const enrichedLogs = attendance.map(log => {
    const emp = employees.find(e => e.id === log.employee_id);
    const cli = clients.find(c => c.id === log.client_id);
    return {
      ...log,
      employee_name: emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown Employee',
      client_name: cli ? cli.client_name : 'General Task',
    };
  });

  // Apply filters
  const filteredLogs = enrichedLogs.filter(log => {
    const matchEmp = employeeFilter === 'all' || log.employee_id === employeeFilter;
    const matchClient = clientFilter === 'all' || log.client_id === clientFilter;
    return matchEmp && matchClient;
  });

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      alert("No data to export.");
      return;
    }
    
    const headers = ['Date', 'Employee', 'Client/Task', 'Clock In', 'Clock Out', 'Duration', 'Notes'];
    const rows = filteredLogs.map(log => [
      `"${formatDate(log.clock_in)}"`,
      `"${log.employee_name}"`,
      `"${log.client_name}"`,
      `"${formatTime(log.clock_in)}"`,
      `"${formatTime(log.clock_out)}"`,
      `"${getDuration(log.clock_in, log.clock_out)}"`,
      `"${(log.notes || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportTextReport = () => {
    if (filteredLogs.length === 0) return;

    const clientName = clientFilter !== 'all' 
      ? clients.find(c => c.id === clientFilter)?.client_name || 'Selected Client' 
      : 'All Clients';

    let totalMs = 0;
    filteredLogs.forEach(log => {
      if (log.clock_out) {
        totalMs += new Date(log.clock_out).getTime() - new Date(log.clock_in).getTime();
      }
    });
    const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
    const totalMins = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));

    const uniqueEmployees = Array.from(new Set(filteredLogs.map(l => l.employee_name)));

    let report = `CLIENT REPORT: ${clientName.toUpperCase()}\n`;
    report += `====================================================\n`;
    report += `Total Days/Shifts Worked: ${filteredLogs.length}\n`;
    report += `Total Time Spent: ${totalHours}h ${totalMins}m\n`;
    report += `Employees Involved: ${uniqueEmployees.join(', ')}\n\n`;
    
    report += `WORK NOTES:\n`;
    report += `----------------------------------------------------\n`;
    
    filteredLogs.forEach(log => {
      if (log.notes) {
         report += `- [${formatDate(log.clock_in)}] ${log.employee_name}: ${log.notes}\n`;
      }
    });
    
    if (!filteredLogs.some(l => l.notes)) {
      report += `(No notes were recorded for these shifts)\n`;
    }

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Client_Report_${clientName.replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate totals for filtered view
  const totalCompletedShifts = filteredLogs.filter(l => l.clock_out).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 items-start lg:items-center">
        <div className="flex items-center gap-2 text-slate-400 font-medium px-2 shrink-0">
          <Filter className="h-4 w-4" /> Filters
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
          <select 
            value={employeeFilter}
            onChange={e => setEmployeeFilter(e.target.value)}
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
          >
            <option value="all">All Employees</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>
            ))}
          </select>

          <select 
            value={clientFilter}
            onChange={e => setClientFilter(e.target.value)}
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
          >
            <option value="all">All Clients / Tasks</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.client_name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 w-full lg:w-auto shrink-0">
          {clientFilter !== 'all' && (
            <Button 
              onClick={handleExportTextReport}
              disabled={filteredLogs.length === 0}
              variant="outline"
              className="flex-1 lg:flex-none border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10"
            >
              <FileText className="h-4 w-4 mr-2" />
              Client Report (.txt)
            </Button>
          )}
          <Button 
            onClick={handleExportCSV}
            disabled={filteredLogs.length === 0}
            className="flex-1 lg:flex-none bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-900/20"
          >
            <Download className="h-4 w-4 mr-2" />
            CSV Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400 mb-1">Total Logs Shown</p>
          <p className="text-2xl font-bold text-white">{filteredLogs.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400 mb-1">Completed Shifts</p>
          <p className="text-2xl font-bold text-white">{totalCompletedShifts}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400 mb-1">Currently Active</p>
          <p className="text-2xl font-bold text-emerald-400">{filteredLogs.length - totalCompletedShifts}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Client/Task</th>
                <th className="px-6 py-4">Time Log</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No attendance records found for these filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="transition-colors hover:bg-slate-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(log.clock_in)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-500" />
                        <span className="font-medium text-white">{log.employee_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-slate-500" />
                        <span className="text-indigo-300">{log.client_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatTime(log.clock_in)} - {formatTime(log.clock_out)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!log.clock_out ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                          Active Now
                        </span>
                      ) : (
                        <span className="font-medium text-slate-300">{getDuration(log.clock_in, log.clock_out)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 min-w-[200px]">
                      <span className="text-slate-400 italic line-clamp-2">
                        {log.notes || '--'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
