"use client";

import { useState } from "react";
import {
  Plus,
  Globe,
  Zap,
  Slack,
  Github,
  Mail,
  ArrowUpRight,
  X,
  CheckCircle2,
  Link2,
  Link2Off,
  Copy,
  Check,
  Webhook,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types & Data
// ---------------------------------------------------------------------------

type IntegrationStatus = "Connected" | "Active" | "Not Connected";
type Category = "All Protocols" | "Communication" | "Sales" | "Developers" | "Email" | "Marketing";

interface Integration {
  id: string;
  name: string;
  category: Category;
  icon: React.ElementType;
  status: IntegrationStatus;
  desc: string;
  color: string;
  lastSync?: string;
}

const ALL_INTEGRATIONS: Integration[] = [
  {
    id: "slack",
    name: "Slack Cluster",
    category: "Communication",
    icon: Slack,
    status: "Connected",
    desc: "Autonomous outreach notifications and real-time campaign alerts sent directly to your workspace.",
    color: "#4A154B",
    lastSync: "2 mins ago",
  },
  {
    id: "github",
    name: "GitHub Hub",
    category: "Developers",
    icon: Github,
    status: "Active",
    desc: "Commit tracking and dev-cycle triggers for automated deployment pipelines.",
    color: "#24292e",
    lastSync: "5 mins ago",
  },
  {
    id: "crm",
    name: "CRM Neural Hub",
    category: "Sales",
    icon: Zap,
    status: "Not Connected",
    desc: "Deep integration for direct outreach syncing, lead scoring, and pipeline automation.",
    color: "#f05a28",
  },
  {
    id: "mail",
    name: "Mail Protocol",
    category: "Email",
    icon: Mail,
    status: "Active",
    desc: "Multi-layered SMTP/API email scheduling with open-rate tracking and A/B testing.",
    color: "#5B6EFF",
    lastSync: "Just now",
  },
  {
    id: "hubspot",
    name: "HubSpot Connect",
    category: "Marketing",
    icon: Globe,
    status: "Not Connected",
    desc: "Sync contacts, deals, and campaign performance data with HubSpot CRM in real time.",
    color: "#ff7a59",
  },
  {
    id: "stripe",
    name: "Stripe Revenue",
    category: "Sales",
    icon: Zap,
    status: "Not Connected",
    desc: "Track revenue events, subscription churn, and trigger campaigns based on billing milestones.",
    color: "#635bff",
  },
];

const CATEGORIES: Category[] = [
  "All Protocols",
  "Communication",
  "Sales",
  "Developers",
  "Email",
  "Marketing",
];

// ---------------------------------------------------------------------------
// Connect Modal
// ---------------------------------------------------------------------------

function ConnectModal({
  integration,
  onClose,
  onConnect,
}: {
  integration: Integration;
  onClose: () => void;
  onConnect: (id: string) => void;
}) {
  const [apiKey, setApiKey] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [done, setDone] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setDone(true);
      onConnect(integration.id);
    }, 1500);
  };

  const INPUT =
    "w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:border-[#5B6EFF]/50 outline-none transition-all text-sm font-mono";

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30" onClick={done ? onClose : undefined} />
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0d0d0d] border border-white/[0.08] rounded-[32px] shadow-2xl animate-in zoom-in-95 fade-in duration-200">
          <div className="p-6 border-b border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${integration.color}20`, border: `1px solid ${integration.color}40` }}
              >
                <integration.icon size={18} className="text-white" />
              </div>
              <h2 className="font-bold text-white">Connect {integration.name}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/[0.05] text-gray-500 hover:text-white transition-all">
              <X size={18} />
            </button>
          </div>

          {done ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">{integration.name} Connected!</h3>
              <p className="text-sm text-gray-500">Your integration is active and syncing data.</p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-3 rounded-2xl bg-[#5B6EFF] text-white font-black text-sm uppercase tracking-widest hover:bg-[#4a59cc] transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-5">
              <p className="text-sm text-gray-400 leading-relaxed">{integration.desc}</p>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                  API Key / Token
                </label>
                <input
                  className={INPUT}
                  placeholder="sk-••••••••••••••••••••••••••"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-start gap-3">
                <ExternalLink size={14} className="text-[#5B6EFF] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500">
                  Find your API key in your {integration.name.split(" ")[0]} dashboard under{" "}
                  <span className="text-white font-bold">Settings → Integrations → API</span>.
                </p>
              </div>

              <button
                onClick={handleConnect}
                disabled={!apiKey.trim() || connecting}
                className="w-full py-3.5 rounded-2xl bg-[#5B6EFF] hover:bg-[#4a59cc] text-white font-black text-sm uppercase tracking-widest transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {connecting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Link2 size={16} /> Link Cluster
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Manage Modal
// ---------------------------------------------------------------------------

function ManageModal({
  integration,
  onClose,
  onDisconnect,
  onSync,
}: {
  integration: Integration;
  onClose: () => void;
  onDisconnect: (id: string) => void;
  onSync: (id: string) => void;
}) {
  const [syncing, setSyncing] = useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    onSync(integration.id);
    setTimeout(() => setSyncing(false), 1500);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30" onClick={onClose} />
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0d0d0d] border border-white/[0.08] rounded-[32px] shadow-2xl animate-in zoom-in-95 fade-in duration-200">
          <div className="p-6 border-b border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${integration.color}20`, border: `1px solid ${integration.color}40` }}
              >
                <integration.icon size={18} className="text-white" />
              </div>
              <h2 className="font-bold text-white">Manage {integration.name}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/[0.05] text-gray-500 hover:text-white transition-all">
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-bold text-white">
                  {integration.status === "Connected" ? "Connected" : "Active"}
                </span>
              </div>
              {integration.lastSync && (
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  Synced {integration.lastSync}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="space-y-2">
              {[
                { label: "Integration ID", value: `rev_${integration.id}_cluster` },
                { label: "Category", value: integration.category },
                { label: "Protocol", value: "OAuth 2.0 / API Key" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02]">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</span>
                  <span className="text-xs font-bold text-white font-mono">{value}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <button
              onClick={handleSync}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#5B6EFF]/10 border border-[#5B6EFF]/20 text-[#5B6EFF] hover:bg-[#5B6EFF] hover:text-white hover:border-[#5B6EFF] font-black text-xs uppercase tracking-widest transition-all"
            >
              <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing..." : "Force Sync"}
            </button>

            {!confirmDisconnect ? (
              <button
                onClick={() => setConfirmDisconnect(true)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500/10 font-black text-xs uppercase tracking-widest transition-all"
              >
                <Link2Off size={14} /> Disconnect Integration
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-3">
                <p className="text-xs text-red-400 font-bold text-center">
                  Disconnect {integration.name}? All synced data will remain.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDisconnect(false)}
                    className="flex-1 py-2 rounded-xl bg-white/[0.05] text-white text-xs font-black uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { onDisconnect(integration.id); onClose(); }}
                    className="flex-1 py-2 rounded-xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
                  >
                    Disconnect
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
// Webhook Panel
// ---------------------------------------------------------------------------

function WebhookPanel({ onClose }: { onClose: () => void }) {
  const [url, setUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const SAMPLE_URL = "https://hooks.revora.ai/webhook/rev_abc123xyz";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(SAMPLE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30" onClick={onClose} />
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0d0d0d] border border-white/[0.08] rounded-[32px] shadow-2xl animate-in zoom-in-95 fade-in duration-200">
          <div className="p-6 border-b border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#5B6EFF]/10 border border-[#5B6EFF]/20">
                <Webhook size={16} className="text-[#5B6EFF]" />
              </div>
              <h2 className="font-bold text-white">Custom Webhook</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/[0.05] text-gray-500 hover:text-white transition-all">
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <p className="text-sm text-gray-400 leading-relaxed">
              Send campaign events, lead updates, and cluster alerts to any external endpoint.
            </p>

            {/* Inbound URL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                Your Revora Webhook URL
              </label>
              <div className="flex items-center gap-2 p-3 bg-white/[0.04] border border-white/[0.1] rounded-2xl">
                <code className="flex-1 text-xs text-white/60 font-mono truncate">{SAMPLE_URL}</code>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-xl border transition-all flex-shrink-0 ${
                    copied
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-[#5B6EFF]/20 bg-[#5B6EFF]/10 text-[#5B6EFF] hover:bg-[#5B6EFF] hover:text-white"
                  }`}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            {/* Outbound URL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                Target Endpoint URL
              </label>
              <input
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:border-[#5B6EFF]/50 outline-none transition-all text-sm font-mono"
                placeholder="https://your-app.com/webhook"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            {/* Events */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                Trigger Events
              </label>
              <div className="flex flex-wrap gap-2">
                {["campaign.created", "lead.captured", "agent.completed", "cluster.scaled"].map((ev) => (
                  <span key={ev} className="px-3 py-1.5 rounded-xl bg-[#5B6EFF]/10 border border-[#5B6EFF]/20 text-[#5B6EFF] text-[10px] font-black">
                    {ev}
                  </span>
                ))}
              </div>
            </div>

            {saved ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="text-sm text-emerald-400 font-bold">Webhook saved and active.</span>
              </div>
            ) : (
              <button
                onClick={() => setSaved(true)}
                disabled={!url.trim()}
                className="w-full py-3.5 rounded-2xl bg-[#5B6EFF] hover:bg-[#4a59cc] text-white font-black text-sm uppercase tracking-widest transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save Webhook
              </button>
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

export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All Protocols");
  const [statuses, setStatuses] = useState<Record<string, IntegrationStatus>>(
    Object.fromEntries(ALL_INTEGRATIONS.map((a) => [a.id, a.status]))
  );
  const [connectModal, setConnectModal] = useState<Integration | null>(null);
  const [manageModal, setManageModal] = useState<Integration | null>(null);
  const [showWebhook, setShowWebhook] = useState(false);
  const [lastSync, setLastSync] = useState<Record<string, string>>(
    Object.fromEntries(ALL_INTEGRATIONS.map((a) => [a.id, a.lastSync ?? ""]))
  );

  const filtered =
    activeCategory === "All Protocols"
      ? ALL_INTEGRATIONS
      : ALL_INTEGRATIONS.filter((a) => a.category === activeCategory);

  const getStatus = (id: string): IntegrationStatus => statuses[id] ?? "Not Connected";

  const handleConnect = (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: "Connected" }));
    setLastSync((prev) => ({ ...prev, [id]: "Just now" }));
  };

  const handleDisconnect = (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: "Not Connected" }));
  };

  const handleSync = (id: string) => {
    setLastSync((prev) => ({ ...prev, [id]: "Just now" }));
  };

  const connectedCount = Object.values(statuses).filter(
    (s) => s === "Connected" || s === "Active"
  ).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-syne">Integrations</h1>
          <p className="text-sm text-gray-400 mt-1">
            Connect your neural network to external protocols.
          </p>
        </div>
        <button
          onClick={() => setShowWebhook(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] text-white hover:bg-white/[0.08] font-bold text-sm transition-all"
        >
          <Globe size={18} className="text-[#5B6EFF]" />
          Browse Marketplace
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Integrations", value: ALL_INTEGRATIONS.length },
          { label: "Connected", value: connectedCount },
          { label: "Available", value: ALL_INTEGRATIONS.length - connectedCount },
        ].map(({ label, value }) => (
          <div key={label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center">
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 items-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeCategory === cat
                ? "bg-[#5B6EFF] text-white shadow-[0_4px_12px_rgba(91,110,255,0.3)]"
                : "bg-white/[0.02] border border-white/[0.05] text-gray-500 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((app) => {
          const status = getStatus(app.id);
          const isConnected = status === "Connected" || status === "Active";
          return (
            <div
              key={app.id}
              className="group p-6 rounded-[32px] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-[#5B6EFF]/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5B6EFF]/5 blur-[60px] -translate-y-1/2 translate-x-1/2 rounded-full group-hover:bg-[#5B6EFF]/10 transition-colors pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/[0.05] flex items-center justify-center p-3.5 relative overflow-hidden group-hover:border-[#5B6EFF]/40 transition-colors">
                    <div className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundColor: app.color }} />
                    <app.icon size={24} className="text-white group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-none">{app.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#5B6EFF] mt-2 opacity-60">
                      {app.category}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                    isConnected
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                  }`}
                >
                  {status}
                </div>
              </div>

              <p className="mt-4 font-medium text-sm text-gray-500 leading-relaxed max-w-[90%] relative z-10">
                {app.desc}
              </p>

              {isConnected && lastSync[app.id] && (
                <p className="mt-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest relative z-10">
                  Last synced: {lastSync[app.id]}
                </p>
              )}

              <div className="mt-6 flex items-center justify-between border-t border-white/[0.03] pt-5 relative z-10">
                <button
                  onClick={() =>
                    window.open(`https://${app.name.split(" ")[0].toLowerCase()}.com`, "_blank")
                  }
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors group/link"
                >
                  Learn Protocol
                  <ArrowUpRight
                    size={14}
                    className="group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform"
                  />
                </button>

                {!isConnected ? (
                  <button
                    onClick={() => setConnectModal(app)}
                    className="bg-[#5B6EFF] hover:bg-[#4a59cc] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_4px_10px_rgba(91,110,255,0.2)] hover:shadow-[0_4px_20px_rgba(91,110,255,0.4)]"
                  >
                    Link Cluster
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setManageModal({ ...app, status, lastSync: lastSync[app.id] })
                    }
                    className="bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white hover:border-[#5B6EFF]/40 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Manage
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Custom Webhook Card */}
        <button
          onClick={() => setShowWebhook(true)}
          className="p-6 rounded-[32px] border-2 border-dashed border-white/[0.05] bg-transparent flex flex-col items-center justify-center text-center space-y-4 hover:border-[#5B6EFF]/40 hover:bg-white/[0.01] transition-all group min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-gray-500 group-hover:text-[#5B6EFF] group-hover:border-[#5B6EFF]/30 group-hover:bg-[#5B6EFF]/10 transition-all">
            <Webhook size={22} />
          </div>
          <div>
            <h3 className="text-white font-bold">Custom Webhook</h3>
            <p className="text-xs text-gray-500 uppercase tracking-tight mt-1">
              Direct API cluster connection
            </p>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#5B6EFF] opacity-0 group-hover:opacity-100 transition-opacity">
            Configure →
          </span>
        </button>
      </div>

      {/* Modals */}
      {connectModal && (
        <ConnectModal
          integration={connectModal}
          onClose={() => setConnectModal(null)}
          onConnect={(id) => {
            handleConnect(id);
            setConnectModal(null);
          }}
        />
      )}
      {manageModal && (
        <ManageModal
          integration={manageModal}
          onClose={() => setManageModal(null)}
          onDisconnect={handleDisconnect}
          onSync={handleSync}
        />
      )}
      {showWebhook && <WebhookPanel onClose={() => setShowWebhook(false)} />}
    </div>
  );
}
