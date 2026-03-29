export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TicketCategory = 'Bug' | 'Feature Request' | 'Technical Support' | 'Billing' | 'Other';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: string;
  updatedAt: string;
  creator: {
    name: string;
    avatar?: string;
  };
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
}
