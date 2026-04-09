"use client";

import { useState, useRef, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  Plus,
  Search,
  CheckCircle2,
  MoreVertical,
  X,
  UserMinus,
  Mail,
  Edit3,
  Clock,
  Send,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types & Data
// ---------------------------------------------------------------------------

type MemberRole = "Admin" | "Manager" | "Analyst" | "Viewer";
type MemberStatus = "Active" | "Invite Pending";
type AccessLevel = "Full" | "Moderate" | "Read-only";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  accessLevel: AccessLevel;
  avatar: string;
  joinedAt: string;
}

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Alex Rivera",
    email: "alex@revora.ai",
    role: "Admin",
    status: "Active",
    accessLevel: "Full",
    avatar: "AR",
    joinedAt: "Sep 1, 2025",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@revora.ai",
    role: "Analyst",
    status: "Active",
    accessLevel: "Read-only",
    avatar: "SC",
    joinedAt: "Oct 14, 2025",
  },
  {
    id: "3",
    name: "Marcus Thorne",
    email: "marcus@revora.ai",
    role: "Manager",
    status: "Invite Pending",
    accessLevel: "Moderate",
    avatar: "MT",
    joinedAt: "—",
  },
];

const AUDIT_EVENTS = [
  { who: "Alex Rivera", action: "changed Sarah Chen's role to Analyst", time: "2 hours ago", type: "edit" },
  { who: "Alex Rivera", action: "invited Marcus Thorne as Manager", time: "5 hours ago", type: "invite" },
  { who: "Sarah Chen", action: "logged in from new device (Mac, Chrome)", time: "1 day ago", type: "login" },
  { who: "Alex Rivera", action: "revoked API key and issued new one", time: "2 days ago", type: "security" },
  { who: "Alex Rivera", action: "enabled Two-Factor Authentication", time: "3 days ago", type: "security" },
  { who: "System", action: "SOC2 audit report generated successfully", time: "1 week ago", type: "system" },
];

const ROLE_ACCESS: Record<MemberRole, AccessLevel> = {
  Admin: "Full",
  Manager: "Moderate",
  Analyst: "Read-only",
  Viewer: "Read-only",
};

// ---------------------------------------------------------------------------
// Invite Modal
// ---------------------------------------------------------------------------

function InviteModal({ onClose, onInvite }: { onClose: () => void; onInvite: (m: TeamMember) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("Analyst");
  const [sent, setSent] = useState(false);

  const INPUT = "w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:border-[#5B6EFF]/50 outline-none transition-all text-sm";

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return;
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    onInvite({
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      role,
      status: "Invite Pending",
      accessLevel: ROLE_ACCESS[role],
      avatar: initials,
      joinedAt: "—",
    });
    setSent(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30" onClick={onClose} />
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0d0d0d] border border-white/[0.08] rounded-[32px] shadow-2xl animate-in zoom-in-95 fade-in duration-200">
          <div className="p-6 border-b border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#5B6EFF]/10 border border-[#5B6EFF]/20">
                <Send size={16} className="text-[#5B6EFF]" />
              </div>
              <h2 className="font-bold text-white">Invite Team Member</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/[0.05] text-gray-500 hover:text-white transition-all">
              <X size={18} />
            </button>
          </div>

          {sent ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Invite Sent!</h3>
              <p className="text-sm text-gray-500">
                An invitation has been dispatched to <span className="text-white font-bold">{email}</span>.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-3 rounded-2xl bg-[#5B6EFF] text-white font-black text-sm uppercase tracking-widest hover:bg-[#4a59cc] transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">Full Name</label>
                <input className={INPUT} placeholder="e.g. Jordan Blake" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">Email Address</label>
                <input className={INPUT} type="email" placeholder="team@revora.ai" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">Protocol Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Admin", "Manager", "Analyst", "Viewer"] as MemberRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`py-3 px-4 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all text-left ${
                        role === r
                          ? "border-[#5B6EFF] bg-[#5B6EFF]/10 text-[#5B6EFF]"
                          : "border-white/[0.08] bg-white/[0.02] text-gray-500 hover:text-white"
                      }`}
                    >
                      <div>{r}</div>
                      <div className="text-[9px] text-gray-600 mt-0.5 normal-case font-normal tracking-normal">
                        {ROLE_ACCESS[r]} access
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!name.trim() || !email.trim()}
                className="w-full py-3.5 rounded-2xl bg-[#5B6EFF] hover:bg-[#4a59cc] text-white font-black text-sm uppercase tracking-widest transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                Send Invite
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Audit Logs Panel
// ---------------------------------------------------------------------------

function AuditPanel({ onClose }: { onClose: () => void }) {
  const typeColor: Record<string, string> = {
    edit: "bg-[#5B6EFF]",
    invite: "bg-emerald-500",
    login: "bg-blue-500",
    security: "bg-amber-500",
    system: "bg-gray-500",
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/[0.07] z-40 overflow-y-auto animate-in slide-in-from-right duration-300 shadow-2xl">
        <div className="p-6 border-b border-white/[0.05] flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#5B6EFF]/10 border border-[#5B6EFF]/20">
              <Clock size={16} className="text-[#5B6EFF]" />
            </div>
            <h2 className="font-bold text-white">Audit Logs</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/[0.05] text-gray-500 hover:text-white transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-1">
          {AUDIT_EVENTS.map((ev, i) => (
            <div key={i} className="flex gap-4 pb-6 relative">
              {/* Timeline line */}
              {i < AUDIT_EVENTS.length - 1 && (
                <div className="absolute left-[9px] top-5 w-px h-full bg-white/[0.05]" />
              )}
              <div className={`w-5 h-5 rounded-full flex-shrink-0 ${typeColor[ev.type]} mt-0.5`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80 leading-snug">
                  <span className="font-bold text-white">{ev.who}</span> {ev.action}
                </p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1.5">
                  {ev.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Member Dropdown
// ---------------------------------------------------------------------------

function MemberMenu({
  member,
  onClose,
  onEdit,
  onResend,
  onRemove,
}: {
  member: TeamMember;
  onClose: () => void;
  onEdit: () => void;
  onResend: () => void;
  onRemove: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 w-52 bg-[#111] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-150"
    >
      <button
        onClick={onEdit}
        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-400 hover:bg-white/[0.05] hover:text-white transition-colors"
      >
        <Edit3 size={14} /> Edit Role
      </button>
      {member.status === "Invite Pending" && (
        <button
          onClick={onResend}
          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-400 hover:bg-white/[0.05] hover:text-white transition-colors"
        >
          <Mail size={14} /> Resend Invite
        </button>
      )}
      <div className="h-px bg-white/[0.05] mx-3" />
      <button
        onClick={onRemove}
        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
      >
        <UserMinus size={14} /> Remove Member
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Edit Role Modal
// ---------------------------------------------------------------------------

function EditRoleModal({
  member,
  onClose,
  onSave,
}: {
  member: TeamMember;
  onClose: () => void;
  onSave: (id: string, role: MemberRole) => void;
}) {
  const [role, setRole] = useState<MemberRole>(member.role);

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30" onClick={onClose} />
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#0d0d0d] border border-white/[0.08] rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="p-6 border-b border-white/[0.05] flex items-center justify-between">
            <h2 className="font-bold text-white">Edit Role — {member.name}</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/[0.05] text-gray-500 hover:text-white transition-all">
              <X size={18} />
            </button>
          </div>
          <div className="p-6 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {(["Admin", "Manager", "Analyst", "Viewer"] as MemberRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-3 px-4 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all text-left ${
                    role === r
                      ? "border-[#5B6EFF] bg-[#5B6EFF]/10 text-[#5B6EFF]"
                      : "border-white/[0.08] bg-white/[0.02] text-gray-500 hover:text-white"
                  }`}
                >
                  <div>{r}</div>
                  <div className="text-[9px] text-gray-600 mt-0.5 normal-case font-normal">{ROLE_ACCESS[r]} access</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => { onSave(member.id, role); onClose(); }}
              className="w-full py-3.5 rounded-2xl bg-[#5B6EFF] hover:bg-[#4a59cc] text-white font-black text-sm uppercase tracking-widest transition-all mt-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = (member: TeamMember) => {
    setMembers((prev) => [...prev, member]);
    setShowInvite(false);
    showToast(`Invite sent to ${member.email}`);
  };

  const handleRemove = (id: string) => {
    const member = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setActiveMenu(null);
    if (member) showToast(`${member.name} removed from team`);
  };

  const handleEditRole = (id: string, role: MemberRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role, accessLevel: ROLE_ACCESS[role] } : m))
    );
    showToast("Role updated successfully");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#111] border border-white/[0.1] text-white text-sm font-bold shadow-2xl animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-3">
          <CheckCircle2 size={16} className="text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-syne">Team Nodes</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage personnel access and protocol permissions.
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center justify-center gap-2 bg-[#5B6EFF] hover:bg-[#4a59cc] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_4px_15px_rgba(91,110,255,0.2)] hover:shadow-[0_4px_25px_rgba(91,110,255,0.4)] hover:scale-[1.02] active:scale-95"
        >
          <Plus size={18} />
          Invite Member
        </button>
      </div>

      {/* Security Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#5B6EFF]/10 via-black/40 to-black/60 border border-white/[0.05] flex items-center justify-between group overflow-hidden relative">
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 rounded-2xl bg-[#5B6EFF]/20 border border-[#5B6EFF]/30 text-[#5B6EFF]">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="font-bold text-white">Advanced Security Protocols</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              SOC2 Type II multi-factor authentication is active for all members.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAudit(true)}
          className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs font-black uppercase tracking-widest text-[#5B6EFF] hover:bg-[#5B6EFF] hover:text-white hover:border-[#5B6EFF] transition-all relative z-10 flex items-center gap-2"
        >
          Audit Logs <ChevronRight size={12} />
        </button>
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#5B6EFF]/10 blur-[80px] -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Members", value: members.length },
          { label: "Active", value: members.filter((m) => m.status === "Active").length },
          { label: "Pending", value: members.filter((m) => m.status === "Invite Pending").length },
        ].map(({ label, value }) => (
          <div key={label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center">
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-[32px] overflow-hidden border border-white/[0.05] bg-white/[0.01] backdrop-blur-xl">
        <div className="p-4 border-b border-white/[0.05] flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 pl-10 pr-4 text-white placeholder:text-gray-600 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Member</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Access</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No members found.
                  </td>
                </tr>
              )}
              {filtered.map((member) => (
                <tr key={member.id} className="group hover:bg-white/[0.03] transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.07] flex items-center justify-center font-black text-xs text-white group-hover:border-[#5B6EFF]/30 transition-colors">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.email}</div>
                        {member.joinedAt !== "—" && (
                          <div className="text-[10px] text-gray-600 mt-0.5">Joined {member.joinedAt}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.1] text-[10px] font-black uppercase tracking-tighter text-gray-400">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      member.accessLevel === "Full"
                        ? "text-[#5B6EFF]"
                        : member.accessLevel === "Moderate"
                        ? "text-amber-400"
                        : "text-gray-500"
                    }`}>
                      {member.accessLevel}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${
                      member.status === "Active" ? "text-emerald-400" : "text-amber-400"
                    }`}>
                      {member.status === "Active" ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                      )}
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setActiveMenu(activeMenu === member.id ? null : member.id)}
                        className="p-2.5 rounded-xl hover:bg-white/[0.05] text-gray-500 hover:text-white transition-all"
                      >
                        <MoreVertical size={18} />
                      </button>
                      {activeMenu === member.id && (
                        <MemberMenu
                          member={member}
                          onClose={() => setActiveMenu(null)}
                          onEdit={() => {
                            setEditingMember(member);
                            setActiveMenu(null);
                          }}
                          onResend={() => {
                            setActiveMenu(null);
                            showToast(`Invite resent to ${member.email}`);
                          }}
                          onRemove={() => handleRemove(member.id)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals & Panels */}
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />}
      {showAudit && <AuditPanel onClose={() => setShowAudit(false)} />}
      {editingMember && (
        <EditRoleModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSave={handleEditRole}
        />
      )}
    </div>
  );
}
