"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Ticket, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Plus,
  LayoutDashboard
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Tickets", href: "/tickets", icon: Ticket },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0f1115] border-r border-[#1e2329] sticky top-0 flex flex-col">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Ticket className="text-white w-6 h-6" />
        </div>
        <span className="text-white font-bold text-xl tracking-tight">Vortex</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#4d5766] font-bold mb-4 px-4">Main Menu</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600/10 to-transparent text-blue-500 border-l-2 border-blue-500"
                  : "text-[#8e99a8] hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1e2329]">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-4 px-4 py-3 w-full text-[#8e99a8] hover:text-[#ff4b4b] hover:bg-[#ff4b4b]/5 rounded-xl transition-all group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
