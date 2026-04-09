"use client";

import { useState, FormEvent, MouseEvent } from "react";
import { ArrowLeft, ChevronRight, Hash, Target, Package, FileText, Zap } from "lucide-react";
import Link from "next/link";

const LEAD_SOURCE_OPTIONS = ["Hunter"];

const inputClass =
  "w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/25 focus:border-[#f05a28]/50 focus:ring-2 focus:ring-[#f05a28]/10 transition-all outline-none";

export default function NewCampaignPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [leadSources, setLeadSources] = useState<string[]>([]);

  const toggleSource = (e: MouseEvent<HTMLButtonElement>, source: string) => {
    e.preventDefault();
    setLeadSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const campaign_name = form.get("campaign_name") as string;
    const product_name = form.get("product_name") as string;
    const product_description = form.get("product_description") as string;
    const goal = form.get("goal") as string;
    const lead_limit = parseInt(form.get("lead_limit") as string || "10", 10);

    if (leadSources.length === 0) {
      setError("Please select at least one lead source.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaign/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_name, product_name, product_description, goal, lead_sources: leadSources, lead_limit }),
      });

      if (!response.ok) throw new Error("Failed to create campaign");

      const data = await response.json();
      window.location.href = data.campaign_id
        ? `/dashboard/campaigns/${data.campaign_id}/icp`
        : "/dashboard";
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500 font-syne">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/campaigns"
          className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Create New Campaign</h1>
          <p className="text-xs text-white/30 mt-0.5">Configure your lead generation outreach flow.</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl bg-[#111111] border border-white/[0.06] overflow-hidden">
        {error && (
          <div className="mx-5 mt-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Section: Campaign Info */}
          <div className="p-5 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f05a28]">Campaign Details</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50">Campaign Name</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                  <input
                    type="text"
                    name="campaign_name"
                    required
                    placeholder="e.g. Q4 Founder Outreach"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50">Product Name</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                  <input
                    type="text"
                    name="product_name"
                    required
                    placeholder="e.g. Revora Growth Engine"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/50">Product Description</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-3.5 w-3.5 text-white/20" />
                <textarea
                  name="product_description"
                  required
                  rows={3}
                  placeholder="Describe what your product does and who it's for..."
                  className={`${inputClass} pl-9 resize-none`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50">Campaign Goal</label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                  <input
                    type="text"
                    name="goal"
                    required
                    placeholder="e.g. Book 10 meetings"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50">Lead Limit</label>
                <div className="relative">
                  <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                  <input
                    type="number"
                    name="lead_limit"
                    defaultValue={10}
                    required
                    min={1}
                    max={10}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/[0.05]" />

          {/* Section: Lead Source */}
          <div className="p-5 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f05a28]">Lead Source</p>
            <div className="flex flex-wrap gap-3">
              {LEAD_SOURCE_OPTIONS.map((source) => {
                const selected = leadSources.includes(source);
                return (
                  <button
                    key={source}
                    type="button"
                    onClick={(e) => toggleSource(e, source)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                      selected
                        ? "bg-[#f05a28]/10 border-[#f05a28]/40 text-[#f05a28]"
                        : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <div className={`h-2 w-2 rounded-full transition-colors ${selected ? "bg-[#f05a28]" : "bg-white/20"}`} />
                    {source}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-white/[0.05]" />

          {/* Footer */}
          <div className="p-5 flex items-center justify-between">
            <Link href="/dashboard/campaigns" className="text-sm text-white/30 hover:text-white transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#f05a28] text-white text-sm font-black hover:bg-[#d44e22] transition-all active:scale-95 disabled:opacity-50 shadow-[0_4px_16px_rgba(240,90,40,0.3)]"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  Creating...
                </>
              ) : (
                <>
                  Continue to ICP Setup
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
