'use client';

import { useState } from 'react';
import { Clock, User, Briefcase, Filter, Download, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AttendanceLog({ 
  attendance, 
  employees, 
  tasks 
}: { 
  attendance: any[], 
  employees: any[], 
  tasks: any[] 
}) {
  const [employeeFilter, setEmployeeFilter] = useState<string>('all');
  const [taskFilter, setTaskFilter] = useState<string>('all');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

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
    const task = tasks.find(t => t.id === log.task_id);
    return {
      ...log,
      employee_name: emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown Employee',
      client_name: task ? task.clients?.client_name : 'General Client',
      task_description: task ? task.task_description : 'General Task',
    };
  });

  // Apply filters
  const filteredLogs = enrichedLogs.filter(log => {
    const matchEmp = employeeFilter === 'all' || log.employee_id === employeeFilter;
    const matchTask = taskFilter === 'all' || log.task_id === taskFilter;
    
    let matchDate = true;
    if (fromDate || toDate) {
      const logDate = log.clock_in.split('T')[0];
      if (fromDate && logDate < fromDate) matchDate = false;
      if (toDate && logDate > toDate) matchDate = false;
    }
    
    return matchEmp && matchTask && matchDate;
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

    const taskName = taskFilter !== 'all' 
      ? tasks.find(t => t.id === taskFilter)?.task_description || 'Selected Task' 
      : 'All Tasks';

    let totalMs = 0;
    filteredLogs.forEach(log => {
      if (log.clock_out) {
        totalMs += new Date(log.clock_out).getTime() - new Date(log.clock_in).getTime();
      }
    });
    const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
    const totalMins = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));

    const uniqueEmployees = Array.from(new Set(filteredLogs.map(l => l.employee_name)));

    let report = `TASK REPORT: ${taskName.toUpperCase()}\n`;
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
    link.setAttribute("download", `Task_Report_${taskName.replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate totals for filtered view
  const totalCompletedShifts = filteredLogs.filter(l => l.clock_out).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-between w-full text-slate-400 font-medium px-2 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filters
          </div>
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        {showFilters && (
          <div className="flex flex-col lg:flex-row gap-4 mt-4 items-start lg:items-center">
            <div className="flex flex-col xl:flex-row gap-4 w-full lg:w-auto flex-1">
          <div className="flex items-center gap-2 flex-1 xl:max-w-[320px]">
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="flex-1 min-w-0 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 [color-scheme:dark]"
              title="From Date"
            />
            <span className="text-slate-500 text-sm">to</span>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="flex-1 min-w-0 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 [color-scheme:dark]"
              title="To Date"
            />
          </div>
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
            value={taskFilter}
            onChange={e => setTaskFilter(e.target.value)}
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
          >
            <option value="all">All Clients / Tasks</option>
            {tasks.map(t => (
              <option key={t.id} value={t.id}>{t.clients?.client_name} - {t.task_description}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
          {taskFilter !== 'all' && (
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
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3 md:p-5">
          <p className="text-[10px] sm:text-sm text-slate-400 mb-1 leading-tight">Total Logs</p>
          <p className="text-lg sm:text-2xl font-bold text-white">{filteredLogs.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3 md:p-5">
          <p className="text-[10px] sm:text-sm text-slate-400 mb-1 leading-tight">Completed</p>
          <p className="text-lg sm:text-2xl font-bold text-white">{totalCompletedShifts}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3 md:p-5">
          <p className="text-[10px] sm:text-sm text-slate-400 mb-1 leading-tight">Active</p>
          <p className="text-lg sm:text-2xl font-bold text-emerald-400">{filteredLogs.length - totalCompletedShifts}</p>
        </div>
      </div>

      <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
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
                        <span className="text-indigo-300">{log.client_name} - {log.task_description}</span>
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

      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-500">
            No attendance records found for these filters.
          </div>
        ) : (
          filteredLogs.map(log => (
            <div key={log.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{log.employee_name}</h3>
                    <p className="text-sm text-slate-400 flex items-center gap-1 mt-0.5">
                      <Briefcase className="h-3.5 w-3.5" />
                      <span className="truncate">{log.client_name} - {log.task_description}</span>
                    </p>
                  </div>
                </div>
                {!log.clock_out && (
                  <span className="shrink-0 inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                    Active
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/50">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Clock In</p>
                  <p className="text-sm text-slate-300 font-medium">{formatTime(log.clock_in)}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{formatDate(log.clock_in)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Clock Out</p>
                  <p className="text-sm text-slate-300 font-medium">{log.clock_out ? formatTime(log.clock_out) : '--:--'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{log.clock_out ? formatDate(log.clock_out) : '--'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                <span className="text-sm text-slate-400">Total Duration:</span>
                <span className="text-sm font-medium text-white">
                  {log.clock_out ? getDuration(log.clock_in, log.clock_out) : 'In Progress'}
                </span>
              </div>

              {log.notes && (
                <div className="pt-3 border-t border-slate-800/50">
                  <p className="text-xs text-slate-500 mb-1">Notes</p>
                  <p className="text-sm text-slate-400 italic bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                    "{log.notes}"
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
