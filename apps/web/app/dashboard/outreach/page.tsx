"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  ChevronDown,
  Copy,
  Trash2,
  RefreshCw,
  Send,
  CheckCheck,
} from "lucide-react";
import Boneyard from "../../../components/Boneyard";

interface Campaign {
  id: string;
  campaign_name: string;
  product_name: string;
  product_description: string;
  goal: string;
  has_icp: boolean;
  lead_count?: number;
}

interface EmailDraft {
  subject: string;
  body: string;
  open_rate: string;
  sentiment_score: string;
}

interface EmailDraftResponse extends EmailDraft {
  error?: string;
}

type Tone = "Professional" | "Casual" | "Direct";

export default function OutreachPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelected] = useState<Campaign | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [valueProps, setValueProps] = useState("");
  const [subjectFormat, setSubjectFormat] = useState("");
  const [draft, setDraft] = useState<EmailDraft | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [draftVersion, setDraftVersion] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

  /* ── load campaigns with ICP ── */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/campaign/`,
          { cache: "no-store" },
        );
        if (!res.ok) return;
        const data: Campaign[] = await res.json();
        const filtered = data.filter((c) => c.has_icp);
        const withLeads = await Promise.all(
          filtered.map(async (c) => {
            try {
              const lr = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/campaign/${c.id}/leads`,
                { cache: "no-store" },
              );
              const leads = lr.ok ? await lr.json() : [];
              return {
                ...c,
                lead_count: Array.isArray(leads) ? leads.length : 0,
              };
            } catch {
              return { ...c, lead_count: 0 };
            }
          }),
        );
        setCampaigns(withLeads);
        if (withLeads.length > 0) setSelected(withLeads[0] ?? null);
      } catch {
        console.error("Failed to load campaigns");
      } finally {
        setLoadingCampaigns(false);
      }
    };
    load();
  }, []);

  if (loadingCampaigns) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 font-syne min-h-full">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Email Generator</h1>
            <span className="px-2 py-0.5 rounded-md bg-[#f05a28]/15 text-[#f05a28] text-[10px] font-black uppercase tracking-widest border border-[#f05a28]/20">
              AI Beta
            </span>
          </div>
          <p className="text-xs text-white/30 mt-0.5">
            Generate personalised outreach emails powered by your campaign data
            and ICP filters.
          </p>
        </div>

        <Boneyard cards={2} lines={6} />
      </div>
    );
  }

  /* ── call backend generate-email endpoint ── */
  const callGenerateAPI = async (resetVersion = false) => {
    if (!selectedCampaign) return;
    setGenerating(true);
    setError(null);
    const nextVersion = resetVersion ? 1 : draftVersion + 1;
    setDraftVersion(nextVersion);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/campaign/${selectedCampaign.id}/generate-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            goal,
            tone,
            value_props: valueProps,
            subject_format: subjectFormat,
            improve: !resetVersion,
            iteration: nextVersion,
            previous_subject: !resetVersion ? draft?.subject || "" : "",
            previous_body: !resetVersion ? draft?.body || "" : "",
          }),
        },
      );
      if (!res.ok) throw new Error("Generation failed");
      const data: EmailDraftResponse = await res.json();
      if (data.error) throw new Error(data.error);
      setDraft(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerate = () => callGenerateAPI(true);
  const handleRegenerate = () => callGenerateAPI(false);

  const handleCopy = () => {
    if (!draft) return;
    navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-syne min-h-full">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white">Email Generator</h1>
          <span className="px-2 py-0.5 rounded-md bg-[#f05a28]/15 text-[#f05a28] text-[10px] font-black uppercase tracking-widest border border-[#f05a28]/20">
            AI Beta
          </span>
        </div>
        <p className="text-xs text-white/30 mt-0.5">
          Generate personalised outreach emails powered by your campaign data
          and ICP filters.
        </p>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.1fr] gap-5">
        {/* ── LEFT: Controls ── */}
        <div className="space-y-4">
          {/* Target Audience */}
          <div className="rounded-2xl bg-[#111] border border-white/[0.06] p-5 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f05a28]">
              Target Audience
            </p>

            {campaigns.length === 0 ? (
              <p className="text-white/30 text-sm py-2">
                No campaigns with ICP configured yet.{" "}
                <a
                  href="/dashboard/campaigns"
                  className="text-[#f05a28] hover:underline"
                >
                  Set up a campaign →
                </a>
              </p>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[#f05a28]/15 border border-[#f05a28]/20 flex items-center justify-center shrink-0">
                      <Sparkles className="h-4 w-4 text-[#f05a28]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {selectedCampaign?.campaign_name}
                      </p>
                      <p className="text-[11px] text-white/30">
                        {selectedCampaign?.lead_count ?? 0} active prospects in
                        segment
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-white/30 shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-[#1c1c1c] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    {campaigns.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelected(c);
                          setDropdownOpen(false);
                          setDraft(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                      >
                        <div className="h-7 w-7 rounded-lg bg-[#f05a28]/10 flex items-center justify-center shrink-0">
                          <Sparkles className="h-3.5 w-3.5 text-[#f05a28]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">
                            {c.campaign_name}
                          </p>
                          <p className="text-[11px] text-white/30">
                            {c.lead_count ?? 0} prospects · {c.product_name}
                          </p>
                        </div>
                        {c.id === selectedCampaign?.id && (
                          <CheckCheck className="h-4 w-4 text-[#f05a28] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Email Strategy */}
          <div className="rounded-2xl bg-[#111] border border-white/[0.06] p-5 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f05a28]">
              Email Strategy
            </p>

            {/* Campaign Goal */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
                Campaign Goal
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder={selectedCampaign?.goal || "e.g. Schedule a demo"}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#f05a28]/40 transition-colors"
              />
            </div>

            {/* Brand Tone */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
                Brand Tone
              </label>
              <div className="flex gap-2">
                {(["Professional", "Casual", "Direct"] as Tone[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      tone === t
                        ? "bg-[#f05a28]/15 text-[#f05a28] border-[#f05a28]/40"
                        : "bg-white/[0.03] text-white/40 border-white/[0.08] hover:text-white/70 hover:border-white/20"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Subject Format */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
                Email Subject Format
              </label>
              <input
                type="text"
                value={subjectFormat}
                onChange={(e) => setSubjectFormat(e.target.value)}
                placeholder="e.g. Quick question for {{company_name}}"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#f05a28]/40 transition-colors"
              />
              <p className="text-[10px] text-white/20">
                Use {"{{company_name}}"} for personalization.
              </p>
            </div>

            {/* Key Value Props */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
                Key Value Propositions
              </label>
              <textarea
                value={valueProps}
                onChange={(e) => setValueProps(e.target.value)}
                rows={4}
                placeholder={
                  selectedCampaign?.product_description
                    ? `e.g. ${selectedCampaign.product_description.slice(0, 80)}…`
                    : "Describe your key differentiators…"
                }
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#f05a28]/40 transition-colors resize-none"
              />
              <p className="text-[10px] text-white/20">
                Leave blank to auto-generate from your product description.
              </p>
            </div>

            {error && (
              <p className="text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!selectedCampaign || generating}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#f05a28] text-white font-black text-sm hover:bg-[#d44e22] transition-all shadow-[0_4px_16px_rgba(240,90,40,0.35)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate email draft using AI
                </>
              )}
            </button>
          </div>

          {/* Stats strip — from API */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#111] border border-white/[0.06] p-4">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/30 mb-1">
                Open Rate Est.
              </p>
              <p className="text-2xl font-black text-[#f05a28]">
                {draft?.open_rate?.trim() || "—"}
              </p>
            </div>
            <div className="rounded-xl bg-[#111] border border-white/[0.06] p-4">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/30 mb-1">
                Sentiment Score
              </p>
              <p className="text-2xl font-black text-[#f05a28]">
                {draft?.sentiment_score?.trim() || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Draft panel ── */}
        <div className="rounded-2xl bg-[#111] border border-white/[0.06] flex flex-col overflow-hidden min-h-[520px]">
          {/* Draft header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#f05a28]/15 border border-[#f05a28]/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-[#f05a28]" />
              </div>
              <span className="text-sm font-bold text-white">
                Generated Draft v{draftVersion}
              </span>
            </div>
            {draft && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  title="Copy to clipboard"
                  className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white transition-colors"
                >
                  {copied ? (
                    <CheckCheck className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setDraft(null);
                    setDraftVersion(1);
                  }}
                  title="Clear draft"
                  className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Draft body */}
          <div className="flex-1 overflow-y-auto">
            {generating ? (
              <div className="flex flex-col items-center justify-center h-full py-20 gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#f05a28]" />
                <p className="text-white/30 text-sm font-bold">
                  Crafting your email…
                </p>
              </div>
            ) : !draft ? (
              <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
                <div className="h-14 w-14 rounded-2xl bg-[#f05a28]/10 border border-[#f05a28]/20 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-[#f05a28]" />
                </div>
                <p className="text-white font-bold mb-1">No draft yet</p>
                <p className="text-white/30 text-sm max-w-xs">
                  Select a campaign, define your strategy, and click{" "}
                  <span className="text-[#f05a28] font-bold">
                    Generate email draft using AI
                  </span>{" "}
                  to create a personalised email using your real campaign and
                  ICP data.
                </p>
              </div>
            ) : (
              <div className="p-5 space-y-5">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">
                    Subject Line
                  </p>
                  <p className="text-base font-bold text-white leading-snug">
                    {draft.subject}
                  </p>
                </div>
                <div className="h-px bg-white/[0.05]" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">
                    Email Body
                  </p>
                  <div className="text-sm text-white/70 leading-relaxed whitespace-pre-line font-medium">
                    {draft.body}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          {draft && !generating && (
            <div className="flex items-center gap-2 px-5 py-4 border-t border-white/[0.06] bg-white/[0.01] flex-wrap">
              <button
                onClick={handleRegenerate}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white text-xs font-bold transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Re-generate
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-xs font-bold hover:bg-white/10 transition-colors"
              >
                {copied ? (
                  <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
                ) : null}
                {copied ? "Copied!" : "Save Draft"}
              </button>
              <button className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f05a28] text-white text-xs font-black hover:bg-[#d44e22] transition-all shadow-[0_4px_12px_rgba(240,90,40,0.3)]">
                Proceed to Sending
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
