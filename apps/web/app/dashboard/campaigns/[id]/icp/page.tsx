"use client";

import { useState, FormEvent, use } from "react";
import { ArrowLeft, ChevronRight, Briefcase, MapPin, Building2, UserCircle } from "lucide-react";
import Link from "next/link";

const inputClass =
  "w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/25 focus:border-[#f05a28]/50 focus:ring-2 focus:ring-[#f05a28]/10 transition-all outline-none";

export default function ICPConfigurationPage({ params }: { params: Promise<{ id: string }> }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resolvedParams = use(params);
  const campaignId = resolvedParams.id;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const industry = form.get("industry") as string;
    const location = form.get("location") as string;
    const company_size = form.get("company_size") as string;
    const job_titles = form.get("job_titles") as string;

    setLoading(true);
    setError("");

    try {
      const icpRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/icp/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id: campaignId, industry, location, company_size, job_titles }),
      });
      if (!icpRes.ok) throw new Error("Failed to save ICP Profile");

      const genRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaign/${campaignId}/generate-leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!genRes.ok) throw new Error("Failed to start lead generation");

      window.location.href = `/dashboard/campaigns/${campaignId}/leads`;
    } catch (err: any) {
      setError(err.message || "An error occurred");
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
          <h1 className="text-xl font-bold text-white">Define Target Audience</h1>
          <p className="text-xs text-white/30 mt-0.5">Set your Ideal Customer Profile (ICP) to focus lead generation.</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-[#f05a28]/20 border border-[#f05a28]/40 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-[#f05a28]" />
          </div>
          <span className="text-xs font-bold text-white/40 line-through">Campaign Details</span>
        </div>
        <div className="h-px flex-1 bg-white/[0.06]" />
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-[#f05a28] flex items-center justify-center">
            <span className="text-[10px] font-black text-white">2</span>
          </div>
          <span className="text-xs font-bold text-white">ICP Setup</span>
        </div>
        <div className="h-px flex-1 bg-white/[0.06]" />
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
            <span className="text-[10px] font-black text-white/30">3</span>
          </div>
          <span className="text-xs font-bold text-white/30">Results</span>
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
          <div className="p-5 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f05a28]">ICP Filters</p>
            <p className="text-xs text-white/30">
              Based on your ICP, our Hunter.io integration will search across companies in your target industry and return verified email contacts.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50">Industry</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                  <input
                    type="text"
                    name="industry"
                    required
                    placeholder="e.g. edtech, fintech, saas"
                    className={`${inputClass} pl-9`}
                  />
                </div>
                <p className="text-[10px] text-white/25 ml-1">Supported: edtech, fintech, saas, ai, hr, marketing…</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                  <input
                    type="text"
                    name="location"
                    required
                    placeholder="e.g. San Francisco, USA"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50">Company Size</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                  <input
                    type="text"
                    name="company_size"
                    required
                    placeholder="e.g. 50-200 employees"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50">Target Job Titles</label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                  <input
                    type="text"
                    name="job_titles"
                    required
                    placeholder="e.g. CEO, CTO, VP Sales"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
            </div>

            {/* Info box */}
            <div className="p-3.5 rounded-xl bg-[#f05a28]/5 border border-[#f05a28]/10">
              <p className="text-xs text-white/40 leading-relaxed">
                <span className="font-bold text-[#f05a28]">How it works:</span> Hunter.io will scan verified email databases across companies in your chosen industry. Results appear on the next screen within seconds.
              </p>
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
                  Generating Leads...
                </>
              ) : (
                <>
                  Generate Leads
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
