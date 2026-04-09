"use client";

import {
  ShieldCheck,
  MoreVertical,
  Plus,
  Search,
  CheckCircle2,
} from "lucide-react";

const TEAM_MEMBERS = [
  {
    name: "Alex Rivera",
    email: "alex@revora.ai",
    role: "Admin",
    status: "Active",
    accessLevel: "Full",
    avatar: "AR",
  },
  {
    name: "Sarah Chen",
    email: "sarah@revora.ai",
    role: "Analyst",
    status: "Active",
    accessLevel: "Read-only",
    avatar: "SC",
  },
  {
    name: "Marcus Thorne",
    email: "marcus@revora.ai",
    role: "Manager",
    status: "Invite Pending",
    accessLevel: "Moderate",
    avatar: "MT",
  },
];

export default function TeamPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-syne text-glow">
            Team Nodes
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage personnel access and protocol permissions.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-[#5B6EFF] hover:bg-[#4a59cc] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_4px_15px_rgba(91,110,255,0.2)] hover:shadow-[0_4px_25px_rgba(91,110,255,0.4)] hover:scale-[1.02] active:scale-95">
          <Plus size={18} />
          Invite Member
        </button>
      </div>

      {/* Permissions Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#5B6EFF]/10 via-black/40 to-black/60 border border-white/[0.05] flex items-center justify-between group overflow-hidden relative">
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 rounded-2xl bg-[#5B6EFF]/20 border border-[#5B6EFF]/30 text-[#5B6EFF]">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="font-bold text-white">
              Advanced Security Protocols
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              SOC2 Type II multi-factor authentication is active for all
              members.
            </p>
          </div>
        </div>
        <button className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs font-black uppercase tracking-widest text-[#5B6EFF] hover:bg-white/[0.1] transition-all relative z-10">
          Audit Logs
        </button>
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#5B6EFF]/10 blur-[80px] -translate-y-1/2 translate-x-1/2 rounded-full group-hover:bg-[#5B6EFF]/20 transition-all duration-1000"></div>
      </div>

      {/* Team Table Mockup */}
      <div className="rounded-[32px] overflow-hidden border border-white/[0.05] bg-white/[0.01] backdrop-blur-xl">
        <div className="p-4 border-b border-white/[0.05] flex items-center gap-4">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 pl-10 pr-4 text-white placeholder:text-gray-600"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Member
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">
                  Protocol Role
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">
                  Access Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">
                  Settings
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {TEAM_MEMBERS.map((member) => (
                <tr
                  key={member.email}
                  className="group hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.07] flex items-center justify-center font-black text-xs text-white group-hover:border-[#5B6EFF]/30 transition-colors">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">
                          {member.name}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.1] text-[10px] font-black uppercase tracking-tighter text-gray-400">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${
                          member.status === "Active"
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }`}
                      >
                        {member.status === "Active" ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                        )}
                        {member.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2.5 rounded-xl hover:bg-white/[0.05] text-gray-500 hover:text-white transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
