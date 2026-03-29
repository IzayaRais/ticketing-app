'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Ticket, TicketStats } from '@/types/ticket';
import { v4 as uuidv4 } from 'uuid';

interface TicketContextType {
  tickets: Ticket[];
  stats: TicketStats;
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'creator'>) => void;
  updateTicketStatus: (id: string, status: Ticket['status']) => void;
  getTicketById: (id: string) => Ticket | undefined;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

// Mock data
const MOCK_TICKETS: Ticket[] = [
  {
    id: '1',
    title: 'Authentication Loop on Login Screen',
    description: 'When logging in, some users are redirected back to the login page repeatedly.',
    status: 'In Progress',
    priority: 'Urgent',
    category: 'Bug',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    creator: { name: 'Sarah Chen' },
  },
  {
    id: '2',
    title: 'Feature: Dark Mode Toggle',
    description: 'Add a dark mode toggle to the user dashboard for better viewing experience.',
    status: 'Resolved',
    priority: 'Medium',
    category: 'Feature Request',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
    creator: { name: 'David Smith' },
  },
  {
    id: '3',
    title: 'Slow API Response on Ticket Creation',
    description: 'The API takes more than 3 seconds to return success when creating a new ticket.',
    status: 'Open',
    priority: 'High',
    category: 'Technical Support',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    creator: { name: 'John Doe' },
  },
];

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);


  const stats: TicketStats = React.useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter((t: Ticket) => t.status === 'Open').length,
      inProgress: tickets.filter((t: Ticket) => t.status === 'In Progress').length,
      resolved: tickets.filter((t: Ticket) => t.status === 'Resolved').length,
    };
  }, [tickets]);


  const addTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'creator'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creator: { name: 'Current User' }, // Mock current user
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const updateTicketStatus = (id: string, status: Ticket['status']) => {
    setTickets((prev: Ticket[]) => 
      prev.map((t: Ticket) => t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t)
    );
  };

  const getTicketById = (id: string) => tickets.find((t: Ticket) => t.id === id);


  return (
    <TicketContext.Provider value={{ tickets, stats, addTicket, updateTicketStatus, getTicketById }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) throw new Error('useTickets must be used within a TicketProvider');
  return context;
};
