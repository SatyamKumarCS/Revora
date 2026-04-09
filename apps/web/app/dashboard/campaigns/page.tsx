"use client";

import { useEffect, useState } from "react";
import { Plus, ChevronRight } from "lucide-react";
import Link from "next/link";
import Boneyard from "../../../components/Boneyard";

interface Campaign {
  id: string;
  campaign_name: string;
  product_name: string;
  product_description: string;
  goal: string;
  lead_sources: string[];
  lead_limit: number;
  status: "active" | "paused" | "archived";
  has_icp: boolean;
  lead_count: number;
}

type TabType = "all" | "active" | "paused" | "archived";

const STATUS_STYLES: Record<string, string> = {
  active:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  paused:   "bg-yellow-500/10  text-yellow-400  border-yellow-500/20",
  archived: "bg-white/5        text-white/25    border-white/10",
};
const DOT_STYLES: Record<string, string> = {
  active:   "bg-emerald-400",
  paused:   "bg-yellow-400",
  archived: "bg-white/25",
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState<TabType>("all");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaign/`, { cache: "no-store" });
        if (!res.ok) return;
        const data: Campaign[] = await res.json();
        setCampaigns(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered =
    tab === "all"
      ? campaigns
      : campaigns.filter((c) => (c.status || "active") === tab);

  const tabs: { id: TabType; label: string }[] = [
    { id: "all",      label: "All Campaigns" },
    { id: "active",   label: "Active" },
    { id: "paused",   label: "Paused" },
    { id: "archived", label: "Archived" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-syne">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Campaigns</h1>
        <p className="text-sm text-white/40 mt-1">Manage and monitor your growth initiatives across all channels.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/[0.06]">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-bold transition-all relative ${
              tab === t.id ? "text-white" : "text-white/30 hover:text-white/60"
            }`}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f05a28] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Campaign Cards */}
      {loading ? (
        <div className="space-y-4">
          <Boneyard cards={2} lines={4} />
          <Boneyard cards={2} lines={4} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-white/30 text-sm">
          {tab === "all" ? (
            <>No campaigns yet. <Link href="/dashboard/campaigns/new" className="text-[#f05a28] hover:underline">Create your first →</Link></>
          ) : (
            `No ${tab} campaigns.`
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((c) => {
            const status   = (c.status || "active") as "active" | "paused" | "archived";
            const progress = c.lead_limit > 0 ? Math.round((c.lead_count / c.lead_limit) * 100) : 0;
            const source   = c.lead_sources?.[0]?.toUpperCase() || "HUNTER";

            return (
              <div
                key={c.id}
                className="rounded-2xl bg-[#141414] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
              >
                {/* Card Header */}
                <div className="px-5 pt-5 pb-4 flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f05a28] mb-2">{source}</p>
                    <h3 className="text-lg font-bold text-white leading-tight">{c.campaign_name}</h3>
                    <p className="text-xs text-white/30 mt-0.5 font-medium truncate max-w-[220px]">{c.product_name}</p>
                  </div>

                  {/* Badge — read-only on the list page */}
                  <div className="mt-1 shrink-0">
                    {!c.has_icp ? (
                      <Link
                        href={`/dashboard/campaigns/${c.id}/icp`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-colors"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                        Incomplete
                      </Link>
                    ) : (
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_STYLES[status]}`}>
                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${DOT_STYLES[status]}`} />
                        {status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Metrics */}
                <div className="px-5 pb-4 grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04]">
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/25 mb-1.5">LEADS GENERATED</p>
                    <p className="text-2xl font-black text-[#f05a28]">{c.lead_count.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04]">
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/25 mb-1.5">LEAD TARGET</p>
                    <p className="text-2xl font-black text-[#f05a28]">{c.lead_limit.toLocaleString()}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="px-5 pb-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-white/40 font-medium">
                      Progress: <span className="text-white font-bold">{c.lead_count.toLocaleString()}</span> / {c.lead_limit.toLocaleString()} leads
                    </span>
                    <span className="text-[#f05a28] font-black">{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#f05a28] rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 pb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {[...Array(Math.min(3, Math.max(1, Math.floor(c.lead_count / 10) + 1)))].map((_, i) => (
                        <div
                          key={i}
                          className="h-6 w-6 rounded-full bg-gradient-to-br from-[#f05a28] to-orange-700 border-2 border-[#141414] flex items-center justify-center text-[8px] font-black text-white"
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </div>
                    {c.lead_count > 0 && (
                      <span className="text-xs text-white/30 font-bold">+{c.lead_count}</span>
                    )}
                  </div>
                  <Link
                    href={c.has_icp ? `/dashboard/campaigns/${c.id}/leads` : `/dashboard/campaigns/${c.id}/icp`}
                    className="flex items-center gap-1 text-sm font-bold hover:gap-2 transition-all text-[#f05a28]"
                  >
                    {c.has_icp ? "View Leads" : "Setup ICP"} <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Start New Campaign CTA */}
      <div className="flex flex-col items-center py-8">
        <Link
          href="/dashboard/campaigns/new"
          className="h-12 w-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] hover:border-[#f05a28]/30 transition-all mb-3"
        >
          <Plus className="h-5 w-5" />
        </Link>
        <p className="text-sm font-bold text-white">Start New Campaign</p>
        <p className="text-xs text-white/30 mt-0.5">Set up a new outreach flow</p>
      </div>
    </div>
  );
}
