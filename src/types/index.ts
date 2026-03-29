export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'open' | 'pending' | 'resolved' | 'closed';
export type Category = 'bug' | 'feature' | 'question' | 'task';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface TicketStats {
  total: number;
  open: number;
  pending: number;
  resolved: number;
}
