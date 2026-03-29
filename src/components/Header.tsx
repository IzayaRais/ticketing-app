"use client";

import { useSession } from "next-auth/react";
import { Search, Bell, Menu, Plus } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-20 bg-[#0f1115]/80 backdrop-blur-xl border-b border-[#1e2329] px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6 flex-1 max-w-xl pr-8">
        <div className="md:hidden p-2 text-[#8e99a8] hover:text-white transition-colors cursor-pointer">
          <Menu size={24} />
        </div>
        <div className="relative flex-1 group">
          <input
            type="text"
            placeholder="Search tickets, customers..."
            className="w-full bg-[#1e2329]/50 border border-[#2c343d] rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder-[#4d5766] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all group-hover:bg-[#1e2329]"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4d5766] group-focus-within:text-blue-500" size={18} />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5 px-2 py-1 bg-[#2c343d] rounded-lg border border-[#3e4854]">
            <span className="text-[10px] text-[#8e99a8] font-bold">⌘</span>
            <span className="text-[10px] text-[#8e99a8] font-bold">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="hidden lg:flex items-center gap-2 bg-gradient-to-tr from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Plus size={18} />
          <span>New Ticket</span>
        </button>

        <button className="relative p-2.5 text-[#8e99a8] hover:text-white hover:bg-white/5 rounded-xl transition-all group">
          <Bell size={22} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-[#0f1115]" />
        </button>

        <div className="h-10 w-[1px] bg-[#1e2329] mx-2" />

        <div className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-1 px-2 rounded-xl transition-all">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white tracking-tight">{session?.user?.name || "User"}</p>
            <p className="text-[11px] text-[#8e99a8] font-medium leading-none">Administrator</p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold ring-2 ring-[#1e2329] group-hover:ring-blue-500/50 transition-all">
              {session?.user?.name?.[0] || "U"}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-[3px] border-[#0f1115]" />
          </div>
        </div>
      </div>
    </header>
  );
}
