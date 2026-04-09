"use client";

import {
  Shield,
  Bell,
  Lock,
  Cpu,
  User,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

const TABS = [
  { name: "My Account", icon: User, code: "account" },
  { name: "Security", icon: Shield, code: "security" },
  { name: "Billing", icon: CreditCard, code: "billing" },
  { name: "Notifications", icon: Bell, code: "notifications" },
  { name: "API & Nodes", icon: Cpu, code: "api" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-syne text-glow">
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
        {/* Sidebar Tabs */}
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
              {activeTab === tab.code && (
                <ArrowRight size={14} className="ml-auto" />
              )}
            </button>
          ))}
        </div>

        {/* Settings Form Card */}
        <div className="flex-1 p-8 rounded-[40px] bg-white/[0.01] border border-white/[0.05] backdrop-blur-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#5B6EFF]/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-[#5B6EFF]/10 transition-colors duration-1000"></div>

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
                  <input
                    type="text"
                    defaultValue="Alex Rivera"
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl py-4 px-5 text-white placeholder:text-gray-600 focus:border-[#5B6EFF]/50 focus:ring-0 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="alex@revora.ai"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-4 px-5 text-white/50 cursor-not-allowed cursor-not-allowed outline-none"
                    disabled
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
                ></textarea>
              </div>

              <button className="md:hidden flex items-center justify-center gap-2 bg-[#5B6EFF] text-white w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest">
                Save Protocol Changes
              </button>
            </div>
          )}

          {activeTab !== "account" && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 duration-500 relative z-10">
              <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-gray-600 mb-6">
                <Lock size={32} />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-tighter">
                Locked Module
              </h3>
              <p className="text-sm text-gray-500 mt-2 max-w-xs">
                {activeTab} configuration is restricted to production-ready
                workspace nodes.
              </p>
              <button className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-[#5B6EFF] bg-[#5B6EFF]/10 border border-[#5B6EFF]/20 px-6 py-2 rounded-full hover:bg-[#5B6EFF] hover:text-white transition-all">
                Request Access
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
