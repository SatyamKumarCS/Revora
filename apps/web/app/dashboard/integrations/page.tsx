"use client";

import {
  Plus,
  Globe,
  Zap,
  Slack,
  Github,
  Mail,
  ArrowUpRight,
} from "lucide-react";

const APP_CONNECT = [
  {
    name: "Slack Cluster",
    category: "Communication",
    icon: Slack,
    status: "Connected",
    desc: "Autonomous outreach notifications and alerts.",
    color: "#4A154B",
  },
  {
    name: "GitHub Hub",
    category: "Code Base",
    icon: Github,
    status: "Active",
    desc: "Commit tracking and dev-cycle triggers.",
    color: "#24292e",
  },
  {
    name: "CRM Neural Hub",
    category: "Sales",
    icon: Zap,
    status: "Not Connected",
    desc: "Deep integration for direct outreach syncing.",
    color: "#f05a28",
  },
  {
    name: "Mail Protocol",
    category: "Email",
    icon: Mail,
    status: "Active",
    desc: "Multi-layered SMTP/API email scheduling.",
    color: "#5B6EFF",
  },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-syne text-glow">
            Integrations
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Connect your neural network to external protocols.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] text-white hover:bg-white/[0.08] font-bold text-sm transition-all">
          <Globe size={18} className="text-[#5B6EFF]" />
          Browse Marketplace
        </button>
      </div>

      {/* Categories Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        {[
          "All Protocols",
          "Communication",
          "Sales",
          "Developers",
          "Marketing",
        ].map((cat, i) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              i === 0
                ? "bg-[#5B6EFF] text-white"
                : "bg-white/[0.02] border border-white/[0.05] text-gray-500 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {APP_CONNECT.map((app) => (
          <div
            key={app.name}
            className="group p-6 rounded-[32px] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-[#5B6EFF]/30 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#5B6EFF]/5 blur-[60px] -translate-y-1/2 translate-x-1/2 rounded-full group-hover:bg-[#5B6EFF]/10 transition-colors pointer-events-none"></div>

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/[0.05] flex items-center justify-center p-3.5 relative overflow-hidden group-hover:border-[#5B6EFF]/40 transition-colors">
                  <div
                    className="absolute inset-x-0 bottom-0 h-1"
                    style={{ backgroundColor: app.color }}
                  ></div>
                  <app.icon
                    size={24}
                    className="text-white group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-none">
                    {app.name}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#5B6EFF] mt-2 opacity-60">
                    {app.category}
                  </p>
                </div>
              </div>
              <div
                className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                  app.status === "Active" || app.status === "Connected"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                }`}
              >
                {app.status}
              </div>
            </div>

            <p className="mt-6 font-medium text-sm text-gray-500 leading-relaxed max-w-[85%]">
              {app.desc}
            </p>

            <div className="mt-8 flex items-center justify-between border-t border-white/[0.03] pt-6 relative z-10">
              <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors group/link">
                Learn Protocol
                <ArrowUpRight
                  size={14}
                  className="group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform"
                />
              </button>
              {app.status === "Not Connected" ? (
                <button className="bg-[#5B6EFF] hover:bg-[#4a59cc] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_4px_10px_rgba(91,110,255,0.2)]">
                  Link Cluster
                </button>
              ) : (
                <button className="bg-white/[0.03] border border-white/[0.05] text-gray-500 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Manage
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Custom API Card */}
        <div className="p-6 rounded-[32px] border-2 border-dashed border-white/[0.05] bg-transparent flex flex-col items-center justify-center text-center space-y-4 hover:border-[#5B6EFF]/30 hover:bg-white/[0.01] transition-all group cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-gray-500 group-hover:text-[#5B6EFF] transition-colors">
            <Plus size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold">Custom Webhook</h3>
            <p className="text-xs text-gray-500 uppercase tracking-tight mt-1">
              Direct API cluster connection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
