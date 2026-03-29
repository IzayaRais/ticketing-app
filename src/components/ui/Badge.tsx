import React from 'react';
import { TicketStatus, TicketPriority } from '@/types/ticket';

interface StatusBadgeProps {
  status: TicketStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles: Record<TicketStatus, string> = {
    'Open': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'In Progress': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Resolved': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'Closed': 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
      {status}
    </span>
  );
};

interface PriorityBadgeProps {
  priority: TicketPriority;
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const styles: Record<TicketPriority, string> = {
    'Low': 'bg-slate-500/10 text-slate-500',
    'Medium': 'bg-blue-500/10 text-blue-500',
    'High': 'bg-orange-500/10 text-orange-500',
    'Urgent': 'bg-rose-500/10 text-rose-500 ring-1 ring-rose-500/30',
  };

  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold ${styles[priority] || 'bg-slate-500/10 text-slate-500'}`}>
      {priority}
    </span>
  );
};
