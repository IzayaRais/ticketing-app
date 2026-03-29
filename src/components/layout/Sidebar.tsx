'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  Settings, 
  Users, 
  LogOut,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CreateTicketModal } from '../dashboard/CreateTicketModal';


const NAV_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'My Tickets', icon: TicketIcon, href: '/tickets' },
  { name: 'Team Hub', icon: Users, href: '/team' },
  { name: 'Support Settings', icon: Settings, href: '/settings' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <aside className="w-64 glass border-r h-screen hidden md:flex flex-col sticky top-0 z-40">

      <div className="p-8 pb-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
          <TicketIcon className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black bg-gradient-to-r from-maroon-700 to-maroon-500 bg-clip-text text-transparent">
            Antorip 2026
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Farewell Edition</p>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-8 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-primary-500/10 text-primary-500 font-semibold' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-0 w-1 h-6 bg-primary-500 rounded-r-full"
                />
              )}
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-500' : 'group-hover:scale-110 transition-transform'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
        
        <div className="pt-8 px-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="font-semibold">Create Ticket</span>
          </button>
        </div>
      </nav>

      <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800">

        <Link 
          href="/help" 
          className="flex items-center space-x-3 px-4 py-3 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Support Center</span>
        </Link>
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-rose-500 hover:bg-rose-500/5 rounded-xl transition-colors mt-1">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
      </aside>
      <CreateTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};


