"use client";

import { useEffect, useState, use, useRef } from "react";
import { ArrowLeft, Download, RefreshCw, Mail, Linkedin, Briefcase, Building2, User, Check, ChevronDown } from "lucide-react";
import Link from "next/link";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  job_title: string;
  linkedin: string;
}

type CampaignStatus = "active" | "paused" | "archived";

const STATUS_STYLES: Record<CampaignStatus, string> = {
  active:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
  paused:   "bg-yellow-500/10  text-yellow-400  border-yellow-500/25",
  archived: "bg-white/5        text-white/30    border-white/10",
};
const DOT_STYLES: Record<CampaignStatus, string> = {
  active:   "bg-emerald-400",
  paused:   "bg-yellow-400",
  archived: "bg-white/25",
};

export default function LeadsResultPage({ params }: { params: Promise<{ id: string }> }) {
  const [leads, setLeads]           = useState<Lead[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus]         = useState<CampaignStatus>("active");
  const [statusOpen, setStatusOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);

  const resolvedParams = use(params);
  const campaignId = resolvedParams.id;

  /* ── fetch leads ── */
  const fetchLeads = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaign/${campaignId}`, { cache: "no-store" });
      if (res.ok) setLeads(await res.json());
    } catch {
      console.error("Failed to fetch leads");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* ── fetch campaign meta (name + status) ── */
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaign/`, { cache: "no-store" });
        if (res.ok) {
          const list = await res.json();
          const camp = list.find((c: any) => c.id === campaignId);
          if (camp) {
            setCampaignName(camp.campaign_name);
            setStatus((camp.status as CampaignStatus) || "active");
          }
        }
      } catch {}
    };
    fetchMeta();
  }, [campaignId]);

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(() => fetchLeads(), 5000);
    return () => clearInterval(interval);
  }, [campaignId]);

  /* ── close status dropdown on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── update status ── */
  const updateStatus = async (s: CampaignStatus) => {
    setStatus(s);
    setStatusOpen(false);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaign/${campaignId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: s }),
    });
  };

  /* ── export CSV ── */
  const exportCSV = () => {
    if (!leads.length) return;
    const headers = ["First Name", "Last Name", "Email", "Company", "Job Title", "LinkedIn"];
    const rows = leads.map((l) => [l.first_name, l.last_name, l.email, l.company, l.job_title, l.linkedin]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `leads_${campaignId.substring(0, 8)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500 font-syne">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/campaigns"
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">
              {campaignName || "Generated Leads"}
            </h1>
            <p className="text-xs text-white/30 mt-0.5">
              {loading
                ? "Fetching results…"
                : leads.length > 0
                ? `${leads.length} verified leads found`
                : "Agents are processing your request"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">

          {/* Status dropdown */}
          <div ref={statusRef} className="relative">
            <button
              onClick={() => setStatusOpen((o) => !o)}
              className={`flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border transition-colors ${STATUS_STYLES[status]}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${DOT_STYLES[status]}`} />
              {status}
              <ChevronDown className={`h-3 w-3 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
            </button>

            {statusOpen && (
              <div className="absolute right-0 top-full mt-1.5 z-50 bg-[#1c1c1c] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[140px]">
                {(["active", "paused", "archived"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider hover:bg-white/5 transition-colors ${
                      s === "active"   ? "text-emerald-400" :
                      s === "paused"   ? "text-yellow-400"  : "text-white/40"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${DOT_STYLES[s]}`} />
                      {s}
                    </span>
                    {status === s && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Refresh */}
          <button
            onClick={() => fetchLeads(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white text-xs font-bold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>

          {/* Export */}
          <button
            onClick={exportCSV}
            disabled={leads.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f05a28] text-white text-xs font-black hover:bg-[#d44e22] transition-all disabled:opacity-30 shadow-[0_4px_12px_rgba(240,90,40,0.3)]"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Stats strip ── */}
      {!loading && leads.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Leads",    value: leads.length },
            { label: "With Email",     value: leads.filter((l) => l.email).length },
            { label: "With LinkedIn",  value: leads.filter((l) => l.linkedin).length },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl bg-[#111] border border-white/[0.06] text-center">
              <p className="text-2xl font-black text-[#f05a28]">{s.value}</p>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="rounded-2xl bg-[#111] border border-white/[0.06] py-24 flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#f05a28]" />
          <p className="text-white/30 text-sm font-bold">Fetching leads…</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="rounded-2xl bg-[#111] border border-white/[0.06] py-24 flex flex-col items-center gap-3 text-center px-6">
          <div className="h-12 w-12 rounded-2xl bg-[#f05a28]/10 border border-[#f05a28]/20 flex items-center justify-center mb-2">
            <User className="h-5 w-5 text-[#f05a28]" />
          </div>
          <p className="text-white font-bold">Agents are working</p>
          <p className="text-white/30 text-sm max-w-sm">
            Your lead generation is running in the background. This page refreshes every 5 seconds — results will appear here automatically.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#f05a28] animate-pulse" />
            <span className="text-[#f05a28] text-xs font-bold">Processing</span>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#111] border border-white/[0.06] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_2fr_2fr_1fr] gap-4 px-5 py-3 border-b border-white/[0.05] bg-white/[0.02]">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/30 flex items-center gap-1.5"><User className="h-3 w-3" /> Contact</span>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/30 flex items-center gap-1.5"><Mail className="h-3 w-3" /> Email</span>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/30 flex items-center gap-1.5"><Building2 className="h-3 w-3" /> Company</span>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/30 flex items-center gap-1.5"><Linkedin className="h-3 w-3" /> Network</span>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-white/[0.04]">
            {leads.map((lead, i) => (
              <div
                key={lead.id || i}
                className="grid grid-cols-[2fr_2fr_2fr_1fr] gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#f05a28] to-orange-700 flex items-center justify-center text-white text-[11px] font-black shrink-0">
                    {(lead.first_name?.charAt(0) || "?").toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{lead.first_name} {lead.last_name}</p>
                    <p className="text-[11px] text-white/30 truncate flex items-center gap-1">
                      <Briefcase className="h-3 w-3 shrink-0" /> {lead.job_title || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center min-w-0">
                  {lead.email
                    ? <a href={`mailto:${lead.email}`} className="text-sm text-[#f05a28] font-medium hover:underline truncate">{lead.email}</a>
                    : <span className="text-white/20 text-sm">—</span>}
                </div>

                <div className="flex items-center min-w-0">
                  <span className="text-sm text-white/60 font-medium truncate">{lead.company || "—"}</span>
                </div>

                <div className="flex items-center">
                  {lead.linkedin
                    ? <a href={lead.linkedin} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black hover:bg-blue-500/20 transition-colors">
                        <Linkedin className="h-3 w-3" /> View
                      </a>
                    : <span className="text-white/20 text-xs">—</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
