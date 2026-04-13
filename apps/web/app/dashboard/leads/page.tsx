"use client";
import { authFetch } from "@/utils/api";


import { useState, useEffect } from "react";
import {
  Upload,
  Filter,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Mail,
  X,
} from "lucide-react";

export interface Lead {
  id: string;
  campaign_id: string;
  campaign: string;
  name: string;
  email: string;
  company: string;
  job_title: string;
  linkedin: string;
  status?: string;
  score?: number;
  avatar?: string;
  avatarBg?: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Gmail & Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("Update from {{company}}");
  const [emailBody, setEmailBody] = useState("Hi {{name}},\n\nWanted to reach out to you regarding your work at {{company}}.\n\nBest,\nRevora");
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [gmailConnected, setGmailConnected] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("gmail_connected") === "true") {
        setGmailConnected(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    authFetch(`${API_URL}/campaign/all-leads`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const mappedLeads = data.map((lead: Lead, index: number) => ({
          ...lead,
          status: ["REPLIED", "CONTACTED", "HOT LEAD", "NOT INTERESTED"][index % 4],
          score: Math.floor(Math.random() * 50) + 45,
          avatar: lead.name.charAt(0).toUpperCase() || "?",
          avatarBg: ["bg-blue-500/20 text-blue-400", "bg-emerald-500/20 text-emerald-400", "bg-purple-500/20 text-purple-400", "bg-rose-500/20 text-rose-400", "bg-[#f05a28]/20 text-[#f05a28]"][index % 5]
        }));
        setLeads(mappedLeads);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching leads:", err);
        setLoading(false);
      });
  }, []);

  const uniqueCampaigns = Array.from(new Map(leads.map((lead: Lead) => [lead.campaign_id, { id: lead.campaign_id, name: lead.campaign }])).values());

  const handleSendEmails = async () => {
    if (!selectedCampaignId) return alert("Select a campaign first");
    setIsSending(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await authFetch(`${API_URL}/gmail/send-campaign/${selectedCampaignId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: emailSubject, html_body: emailBody.replace(/\n/g, '<br>') })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to send");
      alert(`Successfully sent ${data.sent} emails!`);
      setIsModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Error: " + err.message);
      } else {
        alert("Error: " + String(err));
      }
    } finally {
      setIsSending(false);
    }
  };
  const campaignStats = Object.values(leads.reduce((acc, lead) => {
    const stat = acc[lead.campaign] || { campaign: lead.campaign, count: 0 };
    stat.count += 1;
    acc[lead.campaign] = stat;
    return acc;
  }, {} as Record<string, {campaign: string, count: number}>));
  const maxLeads = Math.max(...campaignStats.map((c: {campaign: string, count: number}) => c.count), 1);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Lead Intelligence</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold">
            PLATFORM / <span className="text-[#f05a28]">INTELLIGENCE</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!gmailConnected ? (
            <a 
              href="http://localhost:8000/gmail/auth" 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-600/30 transition-colors text-sm font-semibold"
            >
              <Mail className="h-4 w-4" />
              Connect Gmail
            </a>
          ) : (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-600/30 transition-colors text-sm font-semibold shadow-[0_4px_16px_rgba(16,185,129,0.2)]"
            >
              <Mail className="h-4 w-4" />
              Deploy Campaign
            </button>
          )}

          <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-white/[0.06] rounded-xl hover:bg-white/[0.08] transition-colors text-sm font-semibold">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#f05a28] text-white rounded-xl hover:bg-[#d44e22] transition-colors text-sm font-semibold shadow-[0_4px_16px_rgba(240,90,40,0.3)]">
            <Upload className="h-4 w-4" />
            Import Leads
          </button>
        </div>
      </div>



      {/* Table Section */}
      <div className="bg-[#111111] border border-white/[0.04] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-white/[0.04] flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input 
              type="text" 
              placeholder="Search by name, company, or role..." 
              className="w-full bg-black/40 border border-white/[0.06] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#f05a28]/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Sort by:</span>
              <select className="bg-transparent text-[#f05a28] text-xs font-semibold focus:outline-none cursor-pointer">
                <option value="az" className="bg-[#111111] text-white">A to Z</option>
                <option value="za" className="bg-[#111111] text-white">Z to A</option>
                <option value="campaign" className="bg-[#111111] text-white">Campaign</option>
              </select>
            </div>
            <button className="p-2 hover:bg-white/[0.04] rounded-lg transition-colors">
              <MoreVertical className="h-4 w-4 text-white/40" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left py-4 px-6 text-[10px] text-[#f05a28] uppercase tracking-[0.1em] font-bold">LEAD NAME</th>
                <th className="text-left py-4 px-6 text-[10px] text-[#f05a28] uppercase tracking-[0.1em] font-bold">COMPANY</th>
                <th className="text-left py-4 px-6 text-[10px] text-[#f05a28] uppercase tracking-[0.1em] font-bold">CAMPAIGN</th>
                <th className="text-left py-4 px-6 text-[10px] text-[#f05a28] uppercase tracking-[0.1em] font-bold">LINKEDIN</th>
                <th className="text-right py-4 px-6 text-[10px] text-[#f05a28] uppercase tracking-[0.1em] font-bold">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-white/50">Loading leads...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-white/50">No leads found in database. Create a campaign and generate leads!</td>
                </tr>
              ) : leads.slice(0, 10).map((lead) => (
                <tr key={lead.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shadow-inner ${lead.avatarBg}`}>
                        {lead.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-[#f05a28] transition-colors cursor-pointer">{lead.name}</p>
                        <p className="text-xs text-white/40 mt-0.5">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-white/70">{lead.company}</td>
                  <td className="py-4 px-6 text-sm text-white/70">
                    <span className="bg-white/5 py-1 px-2 rounded-md text-white/80 whitespace-nowrap">{lead.campaign}</span>
                  </td>
                  <td className="py-4 px-6">
                    {lead.linkedin ? (
                      <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-semibold">
                        View Profile
                      </a>
                    ) : (
                      <span className="text-white/30 text-sm">N/A</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 text-white/20 hover:text-[#f05a28] transition-colors">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex items-center justify-between border-t border-white/[0.04] bg-[#0A0A0A]">
          <p className="text-xs text-white/40">Showing 1 to {Math.min(10, leads.length)} of {leads.length} leads</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.04] text-white/40 transition-colors cursor-not-allowed opacity-50" disabled>
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {Array.from({ length: Math.max(1, Math.ceil(leads.length / 10)) }).map((_, i) => (
              <button 
                key={i} 
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium text-xs transition-colors ${i === 0 ? 'bg-[#f05a28]/20 border border-[#f05a28]/30 text-[#f05a28] font-bold' : 'hover:bg-white/[0.04] text-white/70'}`}
              >
                {i + 1}
              </button>
            ))}

            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.04] text-white/40 transition-colors cursor-not-allowed opacity-50" disabled>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="w-full">
        {/* Chart Panel */}
        <div className="bg-[#171717] border border-white/[0.04] rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 z-10 relative">
            <h3 className="font-bold text-lg">Campaign Wise Lead</h3>
            <span className="text-[10px] text-[#f05a28] uppercase tracking-[0.1em] font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f05a28] animate-pulse" />
              Live Updates
            </span>
          </div>
          
          <div className="h-40 flex items-end justify-center gap-3 px-2 z-10 relative">
            {campaignStats.length > 0 ? campaignStats.map((stat: {campaign: string, count: number}, i) => {
              const height = Math.max((stat.count / maxLeads) * 100, 5); // At least 5% height
              const isBest = stat.count === maxLeads && maxLeads > 0;
              return (
                <div key={i} className="flex-1 max-w-[80px] w-full flex justify-center group h-full items-end pb-2 relative cursor-pointer">
                  <div 
                    className={`w-full rounded-t-sm transition-all duration-300 ${isBest ? 'bg-gradient-to-t from-[#f05a28]/60 to-[#f05a28] shadow-[0_0_15px_rgba(240,90,40,0.5)]' : 'bg-white/[0.04] group-hover:bg-white/[0.1] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]'}`}
                    style={{ height: `${height}%` }}
                  />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 shadow-2xl flex flex-col items-center pointer-events-none z-20">
                    <span className="font-bold text-sm text-white mb-1">{stat.campaign}</span>
                    <span className="text-[#f05a28] text-xs font-bold uppercase tracking-widest">{stat.count} Leads</span>
                    
                    {/* Tooltip Triangle pointer */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-[#1a1a1a] border-r-[6px] border-r-transparent filter drop-shadow-[0_1px_0_rgba(255,255,255,0.1)]"></div>
                  </div>
                </div>
              );
            }) : (
              <div className="w-full h-full flex items-center justify-center text-white/40 text-sm">No campaign data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Draft Email Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Deploy Campaign Emails</h3>
                <p className="text-white/40 text-sm mt-1">Design your custom email blast. Use <code className="text-[#f05a28] bg-white/5 px-1 rounded">{"{{name}}"}</code> and <code className="text-[#f05a28] bg-white/5 px-1 rounded">{"{{company}}"}</code> as dynamic variables.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-white/70 uppercase tracking-wider text-[10px]">Select Target Campaign</label>
                <select 
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f05a28]/50 cursor-pointer"
                >
                  <option value="" disabled>-- Choose a Campaign --</option>
                  {uniqueCampaigns.map((camp: {id: string, name: string}) => (
                    <option key={camp.id} value={camp.id}>{camp.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-white/70 uppercase tracking-wider text-[10px]">Subject Line</label>
                <input 
                  type="text" 
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="e.g. Question regarding {{company}}"
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f05a28]/50"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-white/70 uppercase tracking-wider text-[10px]">Email Body</label>
                <textarea 
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={8}
                  placeholder="Hi {{name}}, ..."
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f05a28]/50 resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-white/10 bg-[#0A0A0A] flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                disabled={isSending}
              >
                Cancel
              </button>
              <button 
                onClick={handleSendEmails}
                disabled={isSending || !selectedCampaignId}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#f05a28] text-white rounded-xl hover:bg-[#d44e22] transition-colors text-sm font-bold shadow-[0_4px_16px_rgba(240,90,40,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? "Dispatching..." : "Send Campaign Blast"}
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
