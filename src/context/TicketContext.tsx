'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Ticket, TicketStats } from '../types';

interface TicketContextType {
  tickets: Ticket[];
  stats: TicketStats;
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  getTicketById: (id: string) => Ticket | undefined;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Load initial data from localStorage if available
  useEffect(() => {
    const savedTickets = localStorage.getItem('tickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }
  }, []);

  // Save to localStorage whenever tickets change
  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets]);

  const addTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTicket: Ticket = {
      ...ticketData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now,
    };
    setTickets([...tickets, newTicket]);
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets(tickets.map(t => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)));
  };

  const deleteTicket = (id: string) => {
    setTickets(tickets.filter(t => t.id !== id));
  };

  const getTicketById = (id: string) => {
    return tickets.find(t => t.id === id);
  };

  const stats: TicketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    pending: tickets.filter(t => t.status === 'pending').length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
  };

  return (
    <TicketContext.Provider value={{ tickets, stats, addTicket, updateTicket, deleteTicket, getTicketById }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
