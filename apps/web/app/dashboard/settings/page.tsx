"use client";

import {
  Shield,
  Bell,
  Lock,
  Cpu,
  User,
  CreditCard,
  ArrowRight,
  Eye,
  EyeOff,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NotificationPrefs {
  emailAlerts: boolean;
  campaignUpdates: boolean;
  systemNotifications: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TABS = [
  { name: "My Account", icon: User, code: "account" },
  { name: "Security", icon: Shield, code: "security" },
  { name: "Billing", icon: CreditCard, code: "billing" },
  { name: "Notifications", icon: Bell, code: "notifications" },
  { name: "API & Nodes", icon: Cpu, code: "api" },
] as const;

type TabCode = (typeof TABS)[number]["code"];

// Shared input class — extracted to avoid Tailwind class repetition
const INPUT_CLASS =
  "w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl py-4 px-5 text-white placeholder:text-gray-600 focus:border-[#5B6EFF]/50 focus:ring-0 transition-all outline-none";

// ---------------------------------------------------------------------------
// Toggle — reusable accessible switch used by Security & Notifications tabs
// ---------------------------------------------------------------------------

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${
        checked ? "bg-[#5B6EFF]" : "bg-white/[0.1]"
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabCode>("account");

  // Security tab state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Notifications tab state
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>({
    emailAlerts: true,
    campaignUpdates: true,
    systemNotifications: false,
  });

  // API tab state
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const MOCK_API_KEY = "rvr_live_k9x2mP8nQw7rTz3vJhLsYdFgE1bCuA";

  const handleCopyKey = () => {
    void navigator.clipboard.writeText(MOCK_API_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-syne">
            Protocol Settings
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Configure your autonomous environment variables.
          </p>
        </div>
        <button className="hidden md:flex items-center gap-2 bg-[#5B6EFF] hover:bg-[#4a59cc] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-[0_0_20px_rgba(91,110,255,0.2)]">
          Sync Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs — Strategy pattern: each tab is a concrete rendering strategy */}
        <div className="w-full md:w-64 flex flex-col gap-2 p-1.5 rounded-3xl bg-white/[0.02] border border-white/[0.05] h-fit">
          {TABS.map((tab) => (
            <button
              key={tab.code}
              onClick={() => setActiveTab(tab.code)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.code
                  ? "bg-[#5B6EFF] text-white shadow-[0_8px_20px_rgba(91,110,255,0.2)]"
                  : "text-gray-500 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <tab.icon size={16} />
              {tab.name}
              {activeTab === tab.code && <ArrowRight size={14} className="ml-auto" />}
            </button>
          ))}
        </div>

        {/* Settings Content Card */}
        <div className="flex-1 p-8 rounded-[40px] bg-white/[0.01] border border-white/[0.05] backdrop-blur-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#5B6EFF]/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-[#5B6EFF]/10 transition-colors duration-1000"></div>

          {/* --------------------------------------------------------------- */}
          {/* My Account                                                        */}
          {/* --------------------------------------------------------------- */}
          {activeTab === "account" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-500 relative z-10">
              <div className="bg-[#5B6EFF]/5 p-6 rounded-3xl border border-[#5B6EFF]/20 flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-[#5B6EFF]/10 border border-[#5B6EFF]/30 flex items-center justify-center font-black text-2xl text-white">
                  AR
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Alex Rivera</h3>
                  <p className="text-sm text-gray-500 font-medium mt-1 uppercase tracking-tight">
                    Main Cluster Admin
                  </p>
                  <button className="text-[10px] font-black uppercase tracking-widest text-[#5B6EFF] mt-3 hover:text-white transition-colors border-b border-[#5B6EFF]/30 pb-0.5">
                    Upload Avatar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                    Display Name
                  </label>
                  <input type="text" defaultValue="Alex Rivera" className={INPUT_CLASS} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="alex@revora.ai"
                    disabled
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-4 px-5 text-white/50 cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                  Autonomous Signature
                </label>
                <textarea
                  rows={4}
                  defaultValue="Sent via Revora Neural Cluster"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl py-4 px-5 text-white placeholder:text-gray-600 focus:border-[#5B6EFF]/50 focus:ring-0 transition-all outline-none resize-none"
                />
              </div>

              <button className="md:hidden flex items-center justify-center gap-2 bg-[#5B6EFF] text-white w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest">
                Save Protocol Changes
              </button>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* Security                                                          */}
          {/* --------------------------------------------------------------- */}
          {activeTab === "security" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-500 relative z-10">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Change Password</h3>
                <p className="text-xs text-gray-500">
                  Use a strong passphrase. Minimum 8 characters.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••"
                    autoComplete="current-password"
                    className={INPUT_CLASS}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••"
                      autoComplete="new-password"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••"
                      autoComplete="new-password"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
                <button className="flex items-center gap-2 bg-[#5B6EFF] hover:bg-[#4a59cc] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95">
                  Update Password
                </button>
              </div>

              <div className="h-px bg-white/[0.05]" />

              <div className="flex items-center justify-between p-5 rounded-3xl bg-white/[0.03] border border-white/[0.05]">
                <div>
                  <div className="text-sm font-bold text-white">Two-Factor Authentication</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Require a verification code on every login
                  </div>
                </div>
                <Toggle
                  checked={twoFactorEnabled}
                  onChange={() => setTwoFactorEnabled((v) => !v)}
                  label="Toggle two-factor authentication"
                />
              </div>

              {twoFactorEnabled && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest animate-in fade-in duration-300">
                  2FA is active — your account is protected
                </div>
              )}
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* Billing                                                           */}
          {/* --------------------------------------------------------------- */}
          {activeTab === "billing" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-500 relative z-10">
              {/* Current Plan Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#5B6EFF]/15 to-transparent border border-[#5B6EFF]/30">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF]">
                      Current Plan
                    </div>
                    <div className="text-3xl font-black text-white mt-1">Pro</div>
                    <div className="text-sm text-gray-400 mt-1">
                      Next billing:{" "}
                      <span className="text-white font-bold">May 1, 2026</span>
                    </div>
                  </div>
                  <button className="px-6 py-3 rounded-2xl bg-[#5B6EFF] text-white font-black text-sm uppercase tracking-widest hover:bg-[#4a59cc] transition-all active:scale-95">
                    Upgrade Plan
                  </button>
                </div>
              </div>

              {/* Usage Breakdown */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
                  Usage This Cycle
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Active Campaigns", used: 3, max: 10 },
                    { label: "API Requests", used: 45200, max: 100000 },
                    { label: "Team Members", used: 3, max: 5 },
                  ].map(({ label, used, max }) => (
                    <div key={label} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          {label}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {used.toLocaleString()} / {max.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#5B6EFF] transition-all"
                          style={{ width: `${(used / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Invoices */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
                  Recent Invoices
                </h3>
                <div className="space-y-2">
                  {[
                    { date: "Apr 1, 2026", amount: "$49.00", status: "Paid" },
                    { date: "Mar 1, 2026", amount: "$49.00", status: "Paid" },
                    { date: "Feb 1, 2026", amount: "$49.00", status: "Paid" },
                  ].map((inv) => (
                    <div
                      key={inv.date}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
                    >
                      <span className="text-sm text-white font-medium">{inv.date}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-white font-bold">{inv.amount}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* Notifications                                                     */}
          {/* --------------------------------------------------------------- */}
          {activeTab === "notifications" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-500 relative z-10">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">Notification Preferences</h3>
                <p className="text-xs text-gray-500">
                  Choose which events trigger alerts across your cluster.
                </p>
              </div>

              {(
                [
                  {
                    key: "emailAlerts" as const,
                    label: "Email Alerts",
                    desc: "Get notified via email for critical cluster events",
                  },
                  {
                    key: "campaignUpdates" as const,
                    label: "Campaign Updates",
                    desc: "Status changes, completion events, and anomaly flags",
                  },
                  {
                    key: "systemNotifications" as const,
                    label: "System Notifications",
                    desc: "Cluster health, auto-scaling events, and uptime alerts",
                  },
                ] as const
              ).map(({ key, label, desc }) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-5 rounded-3xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
                >
                  <div>
                    <div className="text-sm font-bold text-white">{label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                  </div>
                  <Toggle
                    checked={notifPrefs[key]}
                    onChange={() => setNotifPrefs((p) => ({ ...p, [key]: !p[key] }))}
                    label={`Toggle ${label}`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* API & Nodes                                                       */}
          {/* --------------------------------------------------------------- */}
          {activeTab === "api" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-500 relative z-10">
              <div className="mb-2">
                <h3 className="text-lg font-bold text-white mb-1">API Access</h3>
                <p className="text-xs text-gray-500">
                  Use this key to authenticate requests to the Revora API.
                </p>
              </div>

              {/* API Key Row */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                  API Key
                </label>
                <div className="flex items-center gap-3 p-4 bg-white/[0.04] border border-white/[0.1] rounded-2xl">
                  <code className="flex-1 text-sm text-white/60 font-mono truncate">
                    {apiKeyVisible
                      ? MOCK_API_KEY
                      : "rvr_live_••••••••••••••••••••••••••••••"}
                  </code>
                  <button
                    onClick={() => setApiKeyVisible((v) => !v)}
                    className="text-gray-500 hover:text-white transition-colors p-1 flex-shrink-0"
                    aria-label={apiKeyVisible ? "Hide API key" : "Show API key"}
                  >
                    {apiKeyVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={handleCopyKey}
                    className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border transition-all flex-shrink-0 ${
                      copied
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                        : "border-[#5B6EFF]/20 bg-[#5B6EFF]/10 text-[#5B6EFF] hover:bg-[#5B6EFF] hover:text-white hover:border-[#5B6EFF]"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check size={12} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-gray-600 ml-1">
                  Never share your API key publicly. Rotate it if compromised.
                </p>
              </div>

              {/* Node Stats */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
                  Cluster Nodes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Active Nodes", value: "12" },
                    { label: "Max Nodes", value: "15" },
                    { label: "Node Region", value: "Global" },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="p-5 rounded-3xl bg-white/[0.03] border border-white/[0.05] text-center"
                    >
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] mb-2">
                        {label}
                      </div>
                      <div className="text-2xl font-bold text-white">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-5 rounded-3xl bg-red-500/5 border border-red-500/20">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="text-sm font-bold text-red-400">Revoke API Key</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Permanently invalidates the current key. A new key will be issued.
                    </div>
                  </div>
                  <button className="px-5 py-2.5 rounded-xl border border-red-500/30 text-red-400 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
                    Revoke Key
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <Lock size={14} className="text-gray-600 flex-shrink-0" />
                <p className="text-xs text-gray-500">
                  Webhook endpoints and custom node configuration are available on the Enterprise plan.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
