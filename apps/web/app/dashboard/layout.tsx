"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  Settings,
  LogOut,
  Zap,
  Search,
  Bell,
  Plus,
  TrendingUp,
  Share2,
  BarChart2,
  Puzzle,
  LucideIcon
} from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  href: string;
}

const SidebarItem = ({ icon: Icon, label, active, href }: SidebarItemProps) => (
  <Link
    href={href}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
      active
        ? "bg-[#f05a28]/10 text-[#f05a28]"
        : "text-white/40 hover:bg-white/5 hover:text-white"
    }`}
  >
    <Icon className={`h-4 w-4 shrink-0 ${active ? "text-[#f05a28]" : "group-hover:text-white"} transition-colors`} />
    <span className="font-semibold text-sm">{label}</span>
  </Link>
);

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ full_name?: string; email?: string; role?: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-white font-syne overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 border-r border-white/[0.06] bg-[#0a0a0a] flex flex-col justify-between hidden lg:flex shrink-0">
        {/* Logo */}
        <div>
          <div className="px-5 py-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[#f05a28] flex items-center justify-center shadow-[0_0_16px_rgba(240,90,40,0.4)]">
                <Zap className="h-4 w-4 text-white fill-current" />
              </div>
              <div>
                <p className="text-sm font-black tracking-tight uppercase">Revora</p>
                <p className="text-[9px] text-white/30 uppercase tracking-[0.15em] font-bold">Growth Engine</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="p-3 space-y-0.5 mt-2">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={pathname === "/dashboard"} href="/dashboard" />
            <SidebarItem icon={Users} label="Leads" active={pathname === "/dashboard/leads"} href="/dashboard/leads" />
            <SidebarItem icon={Megaphone} label="Campaigns" active={pathname.startsWith("/dashboard/campaigns")} href="/dashboard/campaigns" />
            <SidebarItem icon={Share2} label="Outreach" active={pathname === "/dashboard/outreach"} href="/dashboard/outreach" />
            <SidebarItem icon={BarChart2} label="Analytics" active={pathname === "/dashboard/analytics"} href="/dashboard/analytics" />
            <SidebarItem icon={Puzzle} label="Integrations" active={pathname === "/dashboard/integrations"} href="/dashboard/integrations" />
            <SidebarItem icon={Settings} label="Settings" active={pathname === "/dashboard/settings"} href="/dashboard/settings" />
          </nav>
        </div>

        {/* User */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#f05a28] to-orange-600 flex items-center justify-center text-white text-xs font-black shrink-0">
              {user?.full_name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user?.full_name || "Agent"}</p>
              <p className="text-[10px] text-white/30 truncate uppercase tracking-wider">{user?.role || "Member"}</p>
            </div>
            <button onClick={handleLogout} title="Sign out" className="text-white/20 hover:text-red-400 transition-colors shrink-0">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Right Side */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b border-white/[0.06] bg-[#0a0a0a] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2 w-72">
            <Search className="h-4 w-4 text-white/30 shrink-0" />
            <input
              type="text"
              placeholder="Search leads, campaigns..."
              className="bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white transition-colors">
              <Bell className="h-4 w-4" />
            </button>
            <Link
              href="/dashboard/campaigns/new"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f05a28] text-white text-xs font-black uppercase tracking-wider hover:bg-[#d44e22] transition-colors shadow-[0_4px_16px_rgba(240,90,40,0.3)]"
            >
              <Plus className="h-3.5 w-3.5" />
              New Campaign
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#0d0d0d]">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
