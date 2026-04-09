"use client";

import { useState } from "react";
import {
  Rocket,
  Users,
  Zap,
  ChevronRight,
  Plus,
  BarChart3,
  Search,
  Filter,
  X,
  Pause,
  Play,
  Trash2,
  TrendingUp,
  Calendar,
  Target,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types & Data
// ---------------------------------------------------------------------------

type CampaignStatus = "Active" | "Paused";

interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  reach: string;
  engagement: string;
  type: string;
  color: string;
  goal: string;
  leads: number;
  budget: string;
  created: string;
  progress: number;
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: "CP-001",
    name: "Q4 Hyper-Growth Protocol",
    status: "Active",
    reach: "124,000",
    engagement: "18.2%",
    type: "Automation",
    color: "#5B6EFF",
    goal: "Lead Generation",
    leads: 1240,
    budget: "$12,000",
    created: "Oct 1, 2025",
    progress: 78,
  },
  {
    id: "CP-002",
    name: "Neural Re-targeting Alpha",
    status: "Active",
    reach: "45,200",
    engagement: "12.5%",
    type: "AI Optimization",
    color: "#f05a28",
    goal: "Conversions",
    leads: 452,
    budget: "$6,500",
    created: "Nov 12, 2025",
    progress: 52,
  },
  {
    id: "CP-003",
    name: "Global Outreach v2",
    status: "Paused",
    reach: "89,000",
    engagement: "5.4%",
    type: "Email",
    color: "#94a3b8",
    goal: "Brand Awareness",
    leads: 890,
    budget: "$4,200",
    created: "Sep 20, 2025",
    progress: 35,
  },
];

// ---------------------------------------------------------------------------
// Campaign Detail Panel
// ---------------------------------------------------------------------------

function CampaignPanel({
  campaign,
  onClose,
  onToggleStatus,
  onDelete,
}: {
  campaign: Campaign;
  onClose: () => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/[0.07] z-40 overflow-y-auto animate-in slide-in-from-right duration-300 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.05] flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${campaign.color}20`, border: `1px solid ${campaign.color}40` }}
            >
              <BarChart3 size={18} style={{ color: campaign.color }} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                {campaign.id}
              </p>
              <h3 className="text-sm font-bold text-white leading-tight">{campaign.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/[0.05] text-gray-500 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status + Type */}
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                campaign.status === "Active"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
              }`}
            >
              {campaign.status}
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] font-black uppercase tracking-widest text-gray-400">
              {campaign.type}
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#5B6EFF]/10 border border-[#5B6EFF]/20 text-[10px] font-black uppercase tracking-widest text-[#5B6EFF]">
              {campaign.goal}
            </span>
          </div>

          {/* Progress */}
          <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/[0.05] space-y-3">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-400 uppercase tracking-widest">Campaign Progress</span>
              <span className="text-white">{campaign.progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${campaign.progress}%`, backgroundColor: campaign.color }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Reach", value: campaign.reach, icon: Users },
              { label: "Engagement", value: campaign.engagement, icon: TrendingUp },
              { label: "Leads", value: campaign.leads.toLocaleString(), icon: Target },
              { label: "Budget", value: campaign.budget, icon: Zap },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={12} className="text-gray-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    {label}
                  </span>
                </div>
                <div className="text-lg font-bold text-white">{value}</div>
              </div>
            ))}
          </div>

          {/* Meta */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-3">
            <Calendar size={14} className="text-gray-500" />
            <span className="text-xs text-gray-400">
              Created <span className="text-white font-bold">{campaign.created}</span>
            </span>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => onToggleStatus(campaign.id)}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                campaign.status === "Active"
                  ? "bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white hover:border-amber-500"
                  : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500"
              }`}
            >
              {campaign.status === "Active" ? (
                <>
                  <Pause size={16} /> Pause Campaign
                </>
              ) : (
                <>
                  <Play size={16} /> Resume Campaign
                </>
              )}
            </button>

            <Link
              href="/dashboard/campaigns/new"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#5B6EFF] hover:bg-[#4a59cc] text-white font-black text-sm uppercase tracking-widest transition-all"
            >
              <CheckCircle2 size={16} /> Edit Campaign
            </Link>

            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-transparent border border-red-500/20 text-red-400 hover:bg-red-500/10 font-black text-xs uppercase tracking-widest transition-all"
              >
                <Trash2 size={14} /> Delete Campaign
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-3">
                <p className="text-xs text-red-400 font-bold text-center">
                  This cannot be undone. Confirm?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-2 rounded-xl bg-white/[0.05] text-white text-xs font-black uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onDelete(campaign.id);
                      onClose();
                    }}
                    className="flex-1 py-2 rounded-xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | CampaignStatus>("All");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const filtered = campaigns.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleToggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "Active" ? "Paused" : "Active" }
          : c
      )
    );
    setSelectedCampaign((prev) =>
      prev?.id === id
        ? { ...prev, status: prev.status === "Active" ? "Paused" : "Active" }
        : prev
    );
  };

  const handleDelete = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const totalReach = campaigns
    .filter((c) => c.status === "Active")
    .reduce((sum, c) => sum + parseInt(c.reach.replace(/,/g, "")), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-syne">Campaigns</h1>
          <p className="text-sm text-gray-400 mt-1">
            Deploy and monitor your autonomous operation clusters.
          </p>
        </div>
        <Link
          href="/dashboard/campaigns/new"
          className="flex items-center justify-center gap-2 bg-[#5B6EFF] hover:bg-[#4a59cc] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(91,110,255,0.4)] active:scale-95"
        >
          <Plus size={18} />
          Launch New Campaign
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Reach",
            value: `${(totalReach / 1000).toFixed(1)}k`,
            icon: Users,
            color: "#5B6EFF",
          },
          {
            label: "Avg. Engagement",
            value: "14.2%",
            icon: Zap,
            color: "#f05a28",
          },
          {
            label: "Active Nodes",
            value: `${campaigns.filter((c) => c.status === "Active").length} / ${campaigns.length}`,
            icon: Rocket,
            color: "#10b981",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/[0.1]">
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="relative">
        <div className="flex items-center gap-4 p-2 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search clusters..."
              className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-sm text-white focus:ring-0 placeholder:text-gray-600 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilter((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                filterStatus !== "All"
                  ? "bg-[#5B6EFF] text-white"
                  : "bg-white/[0.05] text-white hover:bg-white/[0.1]"
              }`}
            >
              <Filter size={16} />
              {filterStatus === "All" ? "Filter" : filterStatus}
            </button>
            {showFilter && (
              <div className="absolute right-0 top-12 w-40 bg-[#111] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-150">
                {(["All", "Active", "Paused"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setFilterStatus(s);
                      setShowFilter(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest transition-colors ${
                      filterStatus === s
                        ? "bg-[#5B6EFF] text-white"
                        : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500 font-medium">
            No campaigns match your search.
          </div>
        )}
        {filtered.map((campaign) => (
          <div
            key={campaign.id}
            className="group relative flex items-center justify-between p-5 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedCampaign(campaign)}
          >
            <div className="flex items-center gap-5">
              <div className="relative w-14 h-14 flex items-center justify-center rounded-2xl bg-black/40 border border-white/[0.05] group-hover:border-[#5B6EFF]/30 transition-colors flex-shrink-0">
                <div
                  className="absolute inset-0 opacity-20 blur-lg rounded-full"
                  style={{ backgroundColor: campaign.color }}
                />
                <BarChart3 size={24} style={{ color: campaign.color }} className="relative z-10" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-white">{campaign.name}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
                      campaign.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users size={14} /> {campaign.reach} Reach
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap size={14} /> {campaign.engagement} Eng.
                  </span>
                  <span className="text-[10px] font-mono text-gray-600">ID: {campaign.id}</span>
                </div>
                {/* progress mini bar */}
                <div className="mt-2 w-48 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${campaign.progress}%`, backgroundColor: campaign.color }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end mr-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                  Cluster Type
                </div>
                <div className="text-sm text-white/70 font-medium">{campaign.type}</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleStatus(campaign.id);
                }}
                className={`p-3 rounded-xl border transition-all ${
                  campaign.status === "Active"
                    ? "bg-white/[0.03] border-white/[0.05] text-gray-500 hover:bg-amber-500/10 hover:border-amber-500/20 hover:text-amber-400"
                    : "bg-white/[0.03] border-white/[0.05] text-gray-500 hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:text-emerald-400"
                }`}
                title={campaign.status === "Active" ? "Pause" : "Resume"}
              >
                {campaign.status === "Active" ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button className="p-3 rounded-xl bg-white/[0.05] text-white/40 hover:text-white hover:bg-[#5B6EFF] transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Detail Panel */}
      {selectedCampaign && (
        <CampaignPanel
          campaign={campaigns.find((c) => c.id === selectedCampaign.id) ?? selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
