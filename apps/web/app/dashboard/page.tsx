"use client";

import { useEffect, useState } from "react";
import { Users, Megaphone, Target, Zap, TrendingUp, ChevronRight, BarChart3, AlertCircle, Lightbulb, FileText } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Boneyard from "../../components/Boneyard";

interface Campaign {
  id: string;
  campaign_name: string;
  product_name: string;
  goal: string;
  lead_sources: string[];
  lead_limit: number;
  lead_count?: number;
}

interface Lead {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface CampaignStats extends Campaign {
  lead_count: number;
}

export default function DashboardOverview() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignStats, setCampaignStats] = useState<CampaignStats[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaign/`, { cache: "no-store" });
        if (!res.ok) return;
        const data: Campaign[] = await res.json();
        setCampaigns(data);

        const stats: CampaignStats[] = data.map((c) => ({ ...c, lead_count: c.lead_count ?? 0 }));
        setCampaignStats(stats);
        setTotalLeads(stats.reduce((s, c) => s + c.lead_count, 0));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalTarget = campaigns.reduce((s, c) => s + c.lead_limit, 0);
  const activeSources = [...new Set(campaigns.flatMap((c) => c.lead_sources))];
  const qualityPct = totalTarget > 0 ? Math.round((totalLeads / totalTarget) * 100) : 0;

  // Build bar chart data from campaign lead counts (up to 7 latest)
  const barData = campaignStats.slice(-7).map((c) => ({
    name: c.campaign_name.substring(0, 8) + (c.campaign_name.length > 8 ? "…" : ""),
    target: c.lead_limit,
    generated: c.lead_count,
  }));

  const stats = [
    { label: "Total Leads", value: loading ? "—" : totalLeads.toLocaleString(), icon: Users, sub: `${totalTarget.toLocaleString()} target` },
    { label: "Campaigns", value: loading ? "—" : campaigns.length.toString(), icon: Megaphone, sub: "all time" },
    { label: "Lead Sources", value: loading ? "—" : activeSources.length.toString(), icon: Target, sub: activeSources.join(", ") || "none" },
    { label: "Lead Target", value: loading ? "—" : totalTarget.toLocaleString(), icon: TrendingUp, sub: "across all campaigns" },
    { label: "Quality Score", value: loading ? "—" : `${qualityPct}%`, icon: Zap, sub: "leads generated vs target" },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
            <p className="text-sm text-white/40 mt-0.5">Real-time performance tracking for Revora Growth Engine</p>
          </div>
        </div>
        <Boneyard cards={5} lines={4} />
        <Boneyard cards={2} lines={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
          <p className="text-sm text-white/40 mt-0.5">Real-time performance tracking for Revora Growth Engine</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#f05a28]/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/30">{s.label}</p>
              <s.icon className="h-3.5 w-3.5 text-[#f05a28]/60" />
            </div>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-[10px] text-white/25 mt-1 truncate">{s.sub}</p>
            <div className="mt-3 h-0.5 w-full bg-white/5 rounded-full">
              <div className="h-full bg-[#f05a28] rounded-full" style={{ width: `${Math.min(qualityPct || 30, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Middle row: Campaign Table + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Campaign Performance Table */}
        <div className="lg:col-span-2 rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <p className="text-sm font-bold text-white">Campaign Performance</p>
            <Link href="/dashboard/campaigns" className="text-[#f05a28] text-[11px] font-bold hover:underline">View All</Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-[#f05a28]" />
            </div>
          ) : campaignStats.length === 0 ? (
            <div className="py-16 text-center text-white/30 text-sm">
              No campaigns yet.{" "}
              <Link href="/dashboard/campaigns/new" className="text-[#f05a28] hover:underline">Create one →</Link>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white/30">Campaign Name</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/30">Source</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/30">Target</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/30">Generated</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/30"></th>
                </tr>
              </thead>
              <tbody>
                {campaignStats.map((c, i) => (
                  <tr key={c.id} className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors`}>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-bold text-white truncate max-w-[160px]">{c.campaign_name}</p>
                      <p className="text-[11px] text-white/30 truncate max-w-[160px]">{c.goal}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#f05a28]/10 text-[#f05a28] border border-[#f05a28]/20">
                        {c.lead_sources?.[0] || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-white font-bold">{c.lead_limit}</td>
                    <td className="px-4 py-3.5 text-sm text-[#f05a28] font-black">{c.lead_count}</td>
                    <td className="px-4 py-3.5">
                      <Link href={`/dashboard/campaigns/${c.id}/leads`} className="text-white/20 hover:text-white transition-colors">
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* AI Insights Panel */}
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#f05a28] fill-[#f05a28]" />
            <p className="text-sm font-bold text-white">AI Insights</p>
          </div>
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center pt-8">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-[#f05a28]" />
              </div>
            ) : campaigns.length === 0 ? (
              <p className="text-white/30 text-sm text-center pt-8">Create campaigns to see insights.</p>
            ) : (
              <>
                <div className="p-3.5 rounded-lg bg-[#f05a28]/5 border border-[#f05a28]/15 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#f05a28]" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#f05a28]">High Priority</p>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {totalLeads === 0
                      ? `${campaigns.length} campaign${campaigns.length > 1 ? "s" : ""} deployed but no leads generated yet. Check ICP target domains.`
                      : `${totalLeads} leads generated across ${campaigns.length} campaigns. Keep an eye on reply rates.`}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.05] space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Lightbulb className="h-3 w-3 text-yellow-400" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400">Strategy Tip</p>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">
                    {activeSources.includes("Hunter")
                      ? "Hunter.io is active. Target company domains directly for higher email accuracy."
                      : "Add Hunter.io as a lead source to access verified company email addresses."}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.05] space-y-2">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3 w-3 text-blue-400" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Content Insight</p>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">
                    {qualityPct > 50
                      ? `${qualityPct}% of your lead target has been filled. Consider expanding to new industries.`
                      : qualityPct > 0
                      ? `${qualityPct}% lead target fulfilled. Try narrowing your ICP by job title for better match rates.`
                      : "Start generating leads by setting up ICP filters for your active campaigns."}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row: Bar Chart + Lead Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Outreach / Campaign Activity Chart */}
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-bold text-white">Campaign Lead Activity</p>
            <div className="flex items-center gap-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#f05a28]/40 inline-block"/>Target</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#f05a28] inline-block"/>Generated</span>
            </div>
          </div>
          {loading || barData.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-white/20 text-sm">
              {loading ? "Loading…" : "No campaign data yet."}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={barData} barGap={4}>
                <XAxis dataKey="name" tick={{ fill: "#ffffff30", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#ffffff30", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#f05a28" }}
                />
                <Bar dataKey="target" fill="#f05a28" opacity={0.25} radius={[4, 4, 0, 0]} />
                <Bar dataKey="generated" fill="#f05a28" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Lead Quality Score */}
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-bold text-white">Lead Quality Score</p>
            <div className="p-2 rounded-lg bg-[#f05a28]/10">
              <Zap className="h-4 w-4 text-[#f05a28] fill-[#f05a28]" />
            </div>
          </div>

          {/* Donut */}
          <div className="flex items-center gap-8">
            <div className="relative flex items-center justify-center w-32 h-32 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none" stroke="#f05a28" strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 40 * qualityPct / 100} ${2 * Math.PI * 40}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 0.6s ease" }}
                />
              </svg>
              <div className="absolute text-center">
                <p className="text-2xl font-black text-white">{qualityPct}%</p>
                <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Filled</p>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-white/50 font-medium">Leads Generated</span>
                  <span className="text-white font-black">{loading ? "—" : totalLeads.toLocaleString()}</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full">
                  <div className="h-full bg-[#f05a28] rounded-full transition-all duration-700" style={{ width: `${Math.min(qualityPct, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-white/50 font-medium">Remaining Target</span>
                  <span className="text-white font-black">{loading ? "—" : Math.max(0, totalTarget - totalLeads).toLocaleString()}</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full">
                  <div className="h-full bg-white/20 rounded-full" style={{ width: `${Math.min(100 - qualityPct, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
