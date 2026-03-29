'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  trend?: string;
}

export const StatsCard = ({ label, value, icon: Icon, color, trend }: StatsCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 flex items-start space-x-4 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className={`p-3 rounded-xl bg-opacity-10`} style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <div className="flex items-baseline space-x-2">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
          {trend && (
            <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              {trend}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
