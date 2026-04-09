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
  LayoutGrid,
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
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
      active 
        ? "bg-[#5B6EFF] text-white shadow-[0_10px_25px_rgba(91,110,255,0.3)] scale-[1.02]" 
        : "text-white/40 hover:bg-white/5 hover:text-white"
    }`}
  >
    <Icon className={`h-5 w-5 ${active ? "text-white" : "group-hover:text-[#5B6EFF]"} transition-colors`} />
    <span className="font-bold text-sm tracking-wide">{label}</span>
  </Link>
);

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ full_name?: string; email?: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (token === "mock_token") {
      setUser({ full_name: "Alex Rivera", email: "alex@revora.ai" });
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#5B6EFF]/30 font-syne">
      {/* Sidebar — fixed so the body can scroll freely */}
      <aside className="fixed left-0 top-0 h-screen w-72 border-r border-white/5 bg-black/40 backdrop-blur-xl p-6 flex-col justify-between z-20 hidden lg:flex">
        <div className="space-y-10">
          <Link href="/" className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-xl bg-[#5B6EFF] flex items-center justify-center shadow-[0_0_20px_rgba(91,110,255,0.4)]">
              <Zap className="h-6 w-6 text-white fill-current" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">REVORA</span>
          </Link>

          <nav className="space-y-2">
            <SidebarItem icon={LayoutDashboard} label="Overview" active={pathname === "/dashboard"} href="/dashboard" />
            <SidebarItem icon={Megaphone} label="Campaigns" active={pathname.startsWith("/dashboard/campaigns")} href="/dashboard/campaigns" />
            <SidebarItem icon={Users} label="Team" active={pathname === "/dashboard/team"} href="/dashboard/team" />
            <SidebarItem icon={LayoutGrid} label="Integrations" active={pathname === "/dashboard/integrations"} href="/dashboard/integrations" />
            <SidebarItem icon={Settings} label="Settings" active={pathname === "/dashboard/settings"} href="/dashboard/settings" />
          </nav>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#5B6EFF] to-orange-400 p-px">
                <div className="h-full w-full rounded-full bg-[#050505] flex items-center justify-center overflow-hidden">
                  <Users className="h-5 w-5 text-white/40" />
                </div>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user?.full_name || "Agent"}</p>
                <p className="text-[10px] text-white/30 truncate">{user?.email || "offline"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 text-xs font-black uppercase tracking-widest"
            >
              <LogOut className="h-3 w-3" />
              Terminate Link
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content — offset by sidebar width, body scrolls naturally */}
      <main className="lg:ml-72 min-h-screen">
        {/* Sticky top fade */}
        <div className="sticky top-0 h-16 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none z-10 -mb-16"></div>

        <div className="p-8 pt-8 pb-16">
          {children}
        </div>

        {/* Decorative blobs — fixed so they don't affect scroll height */}
        <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[#5B6EFF]/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
        <div className="fixed bottom-0 left-72 w-[400px] h-[400px] bg-[#5B6EFF]/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      </main>
    </div>
  );
}
