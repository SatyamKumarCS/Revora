"use client";

import { useState, useReducer } from "react";
import {
  Rocket,
  Target,
  Cpu,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Calendar,
  Globe,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createCampaign } from "@/lib/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ClusterType = "ai" | "hybrid" | "scheduled";
type CampaignGoal = "Brand Awareness" | "Lead Generation" | "Conversions";
type LeadSource = "LinkedIn" | "Email" | "Web";

interface CampaignFormState {
  // Step 0 — Configuration
  campaign_name: string;
  product_name: string;
  budget: string;
  cluster_type: ClusterType | null;
  // Step 1 — Targeting
  region: string;
  product_description: string;
  keywords: string[];
  // Step 2 — Optimization
  goal: CampaignGoal | null;
  lead_sources: LeadSource[];
  lead_limit: string;
  // Validation errors
  errors: Partial<Record<string, string>>;
}

type CampaignFormAction =
  | { type: "SET_FIELD"; field: string; value: string }
  | { type: "SET_CLUSTER"; value: ClusterType }
  | { type: "SET_GOAL"; value: CampaignGoal }
  | { type: "ADD_KEYWORD"; value: string }
  | { type: "REMOVE_KEYWORD"; value: string }
  | { type: "TOGGLE_LEAD_SOURCE"; value: LeadSource }
  | { type: "SET_ERRORS"; errors: Record<string, string> }
  | { type: "CLEAR_ERRORS" };

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const initialFormState: CampaignFormState = {
  campaign_name: "",
  product_name: "",
  budget: "",
  cluster_type: null,
  region: "Global",
  product_description: "",
  keywords: ["SAAS", "AI", "AUTOMATION"],
  goal: null,
  lead_sources: [],
  lead_limit: "",
  errors: {},
};

// ---------------------------------------------------------------------------
// Reducer — pure finite state machine, no side-effects
// ---------------------------------------------------------------------------

function campaignFormReducer(
  state: CampaignFormState,
  action: CampaignFormAction
): CampaignFormState {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: undefined },
      };
    case "SET_CLUSTER":
      return { ...state, cluster_type: action.value };
    case "SET_GOAL":
      return { ...state, goal: action.value, errors: { ...state.errors, goal: undefined } };
    case "ADD_KEYWORD": {
      const trimmed = action.value.trim().toUpperCase();
      if (!trimmed || state.keywords.includes(trimmed)) return state;
      return { ...state, keywords: [...state.keywords, trimmed] };
    }
    case "REMOVE_KEYWORD":
      return { ...state, keywords: state.keywords.filter((k) => k !== action.value) };
    case "TOGGLE_LEAD_SOURCE":
      return {
        ...state,
        lead_sources: state.lead_sources.includes(action.value)
          ? state.lead_sources.filter((s) => s !== action.value)
          : [...state.lead_sources, action.value],
        errors: { ...state.errors, lead_sources: undefined },
      };
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    case "CLEAR_ERRORS":
      return { ...state, errors: {} };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Per-step validation — pure function, no side-effects
// ---------------------------------------------------------------------------

function validateStep(
  step: number,
  state: CampaignFormState
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (step === 0) {
    if (!state.campaign_name.trim()) errors.campaign_name = "Protocol name is required";
    if (!state.product_name.trim()) errors.product_name = "Product name is required";
  }

  if (step === 1) {
    if (!state.product_description.trim())
      errors.product_description = "Describe your ideal audience";
  }

  if (step === 2) {
    if (!state.goal) errors.goal = "Select a campaign goal";
    if (!state.lead_sources.length) errors.lead_sources = "Select at least one lead source";
    if (!state.lead_limit || Number(state.lead_limit) <= 0)
      errors.lead_limit = "Enter a valid lead limit";
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Step definitions
// ---------------------------------------------------------------------------

const STEPS = ["Configuration", "Targeting", "Optimization", "Launch"];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function NewCampaignPage() {
  const router = useRouter();
  const [formState, dispatch] = useReducer(campaignFormReducer, initialFormState);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [keywordInput, setKeywordInput] = useState("");

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------

  const handleNext = () => {
    const errors = validateStep(currentStep, formState);
    if (Object.keys(errors).length > 0) {
      dispatch({ type: "SET_ERRORS", errors });
      return;
    }
    dispatch({ type: "CLEAR_ERRORS" });
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      void handleLaunch();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleLaunch = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await createCampaign({
        campaign_name: formState.campaign_name,
        product_name: formState.product_name,
        product_description: formState.product_description,
        goal: formState.goal!,
        lead_sources: formState.lead_sources,
        lead_limit: Number(formState.lead_limit),
      });
      router.push("/dashboard/campaigns");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Launch failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleAddKeyword = () => {
    dispatch({ type: "ADD_KEYWORD", value: keywordInput });
    setKeywordInput("");
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/campaigns"
          className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-syne">New Campaign</h1>
          <p className="text-sm text-gray-400 mt-0.5">Define your autonomous marketing protocol.</p>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="relative flex items-center justify-between px-1">
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/[0.05] -translate-y-1/2 z-0"></div>
        {STEPS.map((step, i) => (
          <div key={step} className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-xl border-2 transition-all duration-500 bg-black/90 ${
                i <= currentStep
                  ? "border-[#5B6EFF] text-white shadow-[0_0_15px_rgba(91,110,255,0.3)]"
                  : "border-white/[0.05] text-gray-600"
              }`}
            >
              {i < currentStep ? (
                <CheckCircle2 size={18} className="text-[#5B6EFF]" />
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${
                i <= currentStep ? "text-[#5B6EFF]" : "text-gray-600"
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="p-8 pb-12 rounded-[40px] bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#5B6EFF]/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-[#5B6EFF]/10 transition-colors duration-1000"></div>

        {/* ----------------------------------------------------------------- */}
        {/* Step 0 — Configuration                                             */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                  Protocol Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q4 Viral Growth"
                  value={formState.campaign_name}
                  onChange={(e) =>
                    dispatch({ type: "SET_FIELD", field: "campaign_name", value: e.target.value })
                  }
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl py-4 px-5 text-white placeholder:text-gray-600 focus:border-[#5B6EFF]/50 focus:ring-0 transition-all outline-none"
                />
                {formState.errors.campaign_name && (
                  <p className="text-xs text-red-400 ml-1 mt-1">{formState.errors.campaign_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                  Base Budget
                </label>
                <input
                  type="number"
                  placeholder="$ 5,000"
                  min={0}
                  value={formState.budget}
                  onChange={(e) =>
                    dispatch({ type: "SET_FIELD", field: "budget", value: e.target.value })
                  }
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl py-4 px-5 text-white placeholder:text-gray-600 focus:border-[#5B6EFF]/50 focus:ring-0 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                Product Name
              </label>
              <input
                type="text"
                placeholder="e.g. Revora AI Platform"
                value={formState.product_name}
                onChange={(e) =>
                  dispatch({ type: "SET_FIELD", field: "product_name", value: e.target.value })
                }
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl py-4 px-5 text-white placeholder:text-gray-600 focus:border-[#5B6EFF]/50 focus:ring-0 transition-all outline-none"
              />
              {formState.errors.product_name && (
                <p className="text-xs text-red-400 ml-1 mt-1">{formState.errors.product_name}</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                Cluster Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(
                  [
                    { id: "ai" as ClusterType, icon: Rocket, label: "Full Auto", desc: "AI handles everything" },
                    { id: "hybrid" as ClusterType, icon: Cpu, label: "Hybrid", desc: "Managed assets" },
                    { id: "scheduled" as ClusterType, icon: Calendar, label: "Scheduled", desc: "Manual timing" },
                  ] as const
                ).map((type) => {
                  const isActive = formState.cluster_type === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => dispatch({ type: "SET_CLUSTER", value: type.id })}
                      className={`p-5 text-left rounded-3xl border transition-all group/btn ${
                        isActive
                          ? "border-[#5B6EFF] bg-[#5B6EFF]/10"
                          : "border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.06] hover:border-[#5B6EFF]/40"
                      }`}
                    >
                      <type.icon
                        size={24}
                        className={`mb-3 transition-colors ${
                          isActive ? "text-[#5B6EFF]" : "text-gray-400 group-hover/btn:text-[#5B6EFF]"
                        }`}
                      />
                      <div className="font-bold text-white text-sm">{type.label}</div>
                      <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-tight">{type.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Step 1 — Targeting                                                 */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                  Region Targeting
                </label>
                <div className="flex items-center gap-2 p-4 bg-white/[0.04] border border-white/[0.1] rounded-2xl">
                  <Globe size={18} className="text-gray-500" />
                  <span className="text-sm text-white">Global (Default)</span>
                  <ChevronRight size={14} className="ml-auto text-gray-600" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                  Ideal Audience
                </label>
                <input
                  type="text"
                  placeholder="e.g. B2B SaaS founders in the US"
                  value={formState.product_description}
                  onChange={(e) =>
                    dispatch({ type: "SET_FIELD", field: "product_description", value: e.target.value })
                  }
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl py-4 px-5 text-white placeholder:text-gray-600 focus:border-[#5B6EFF]/50 focus:ring-0 transition-all outline-none"
                />
                {formState.errors.product_description && (
                  <p className="text-xs text-red-400 ml-1 mt-1">
                    {formState.errors.product_description}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                Target Keywords
              </label>
              <div className="flex flex-wrap gap-2 p-3 min-h-[100px] bg-white/[0.02] border border-white/[0.1] rounded-3xl">
                {formState.keywords.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-xl bg-[#5B6EFF]/10 border border-[#5B6EFF]/20 text-[#5B6EFF] text-[10px] font-black flex items-center gap-2"
                  >
                    {tag}
                    <button
                      onClick={() => dispatch({ type: "REMOVE_KEYWORD", value: tag })}
                      className="hover:text-white transition-colors"
                      aria-label={`Remove ${tag}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add keyword..."
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    className="bg-transparent border-none outline-none text-white text-[10px] font-bold placeholder:text-gray-600 w-28"
                  />
                  <button
                    onClick={handleAddKeyword}
                    className="px-3 py-2 rounded-xl border border-dashed border-white/20 text-gray-500 text-[10px] font-black flex items-center gap-1 hover:border-[#5B6EFF] hover:text-[#5B6EFF] transition-colors"
                  >
                    <Plus size={12} /> ADD
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Step 2 — Optimization                                              */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Campaign Goal */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                Campaign Goal
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["Brand Awareness", "Lead Generation", "Conversions"] as CampaignGoal[]).map(
                  (g) => {
                    const isActive = formState.goal === g;
                    return (
                      <button
                        key={g}
                        onClick={() => dispatch({ type: "SET_GOAL", value: g })}
                        className={`p-5 text-left rounded-3xl border transition-all ${
                          isActive
                            ? "border-[#5B6EFF] bg-[#5B6EFF]/10 text-white"
                            : "border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.06] hover:border-[#5B6EFF]/40 text-gray-400 hover:text-white"
                        }`}
                      >
                        <div className="font-bold text-sm">{g}</div>
                        <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-tight">
                          {g === "Brand Awareness" && "Maximize reach & visibility"}
                          {g === "Lead Generation" && "Capture qualified contacts"}
                          {g === "Conversions" && "Drive purchases & signups"}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
              {formState.errors.goal && (
                <p className="text-xs text-red-400 ml-1">{formState.errors.goal}</p>
              )}
            </div>

            {/* Lead Sources */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                Lead Sources
              </label>
              <div className="flex flex-wrap gap-3">
                {(["LinkedIn", "Email", "Web"] as LeadSource[]).map((src) => {
                  const isActive = formState.lead_sources.includes(src);
                  return (
                    <button
                      key={src}
                      onClick={() => dispatch({ type: "TOGGLE_LEAD_SOURCE", value: src })}
                      aria-pressed={isActive}
                      className={`px-6 py-3 rounded-2xl border font-black text-xs uppercase tracking-widest transition-all ${
                        isActive
                          ? "border-[#5B6EFF] bg-[#5B6EFF]/10 text-[#5B6EFF]"
                          : "border-white/[0.1] bg-white/[0.02] text-gray-500 hover:text-white hover:border-white/30"
                      }`}
                    >
                      {src}
                    </button>
                  );
                })}
              </div>
              {formState.errors.lead_sources && (
                <p className="text-xs text-red-400 ml-1">{formState.errors.lead_sources}</p>
              )}
            </div>

            {/* Lead Limit */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                Lead Limit
              </label>
              <input
                type="number"
                placeholder="e.g. 500"
                min={1}
                value={formState.lead_limit}
                onChange={(e) =>
                  dispatch({ type: "SET_FIELD", field: "lead_limit", value: e.target.value })
                }
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl py-4 px-5 text-white placeholder:text-gray-600 focus:border-[#5B6EFF]/50 focus:ring-0 transition-all outline-none"
              />
              {formState.errors.lead_limit && (
                <p className="text-xs text-red-400 ml-1">{formState.errors.lead_limit}</p>
              )}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Step 3 — Launch / Review                                           */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <h3 className="text-xl font-bold text-white font-syne mb-1">Protocol Summary</h3>
              <p className="text-sm text-gray-500">
                Review all parameters before initializing the autonomous cluster.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Protocol Name", value: formState.campaign_name },
                { label: "Product", value: formState.product_name },
                { label: "Budget", value: formState.budget ? `$${formState.budget}` : "—" },
                {
                  label: "Cluster Type",
                  value: formState.cluster_type
                    ? formState.cluster_type.charAt(0).toUpperCase() +
                      formState.cluster_type.slice(1)
                    : "—",
                },
                { label: "Region", value: formState.region },
                { label: "Ideal Audience", value: formState.product_description || "—" },
                { label: "Campaign Goal", value: formState.goal ?? "—" },
                {
                  label: "Lead Sources",
                  value: formState.lead_sources.length
                    ? formState.lead_sources.join(", ")
                    : "—",
                },
                { label: "Lead Limit", value: formState.lead_limit || "—" },
                {
                  label: "Keywords",
                  value: formState.keywords.length ? formState.keywords.join(", ") : "—",
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]"
                >
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] mb-1">
                    {label}
                  </div>
                  <div className="text-sm text-white font-medium break-words">{value}</div>
                </div>
              ))}
            </div>

            {submitError && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                {submitError}
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-12 flex items-center justify-between pt-8 border-t border-white/[0.05]">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-2xl transition-all ${
              currentStep === 0
                ? "opacity-0 invisible"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <ChevronLeft size={20} />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-[#5B6EFF] hover:bg-[#4a59cc] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                INITIALIZING...
              </span>
            ) : currentStep === STEPS.length - 1 ? (
              <>
                <Target size={18} />
                Initialize Protocol
              </>
            ) : (
              <>
                Next Protocol Step
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
