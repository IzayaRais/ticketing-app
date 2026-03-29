'use client';

import React from 'react';
import { Bell, Search, User, Settings as SettingsIcon, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';


export const Header = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="h-20 glass border-b px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex-1 max-w-lg">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search tickets, customers, or knowledge base..."
            className="w-full bg-slate-100 dark:bg-slate-900/50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 pl-8">
        <div className="flex items-center space-x-1 border-r border-slate-200 dark:border-slate-800 pr-4 mr-4">
          <button onClick={toggleTheme} className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
          </button>
          <button className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-3 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded-xl transition-all pr-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-amber-400 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <User className="text-white w-6 h-6" />
          </div>
          <div className="hidden lg:block text-right">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Alex Rivera</p>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">Senior Analyst</p>
          </div>
        </div>
      </div>
    </header>
  );
};
