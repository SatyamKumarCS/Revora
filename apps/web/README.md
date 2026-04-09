# Revora — `apps/web` System Design

> Autonomous marketing intelligence platform. This document covers every dashboard page, all interactive features, architecture decisions, design patterns, and OOP concepts used in the `apps/web` Next.js frontend.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture Diagram](#3-architecture-diagram)
4. [Directory Structure](#4-directory-structure)
5. [Dashboard Pages & Features](#5-dashboard-pages--features)
6. [Design Patterns Used](#6-design-patterns-used)
7. [Design Patterns Intentionally NOT Used](#7-design-patterns-intentionally-not-used)
8. [Where Alternative Patterns Could Be Applied](#8-where-alternative-patterns-could-be-applied)
9. [OOP Concepts in TypeScript](#9-oop-concepts-in-typescript)
10. [Data Flow](#10-data-flow)
11. [API Contract](#11-api-contract)
12. [Running Locally](#12-running-locally)

---

## 1. Project Overview

Revora is a Turborepo monorepo:

| Workspace | Description |
|-----------|-------------|
| `apps/web` | Next.js 15 frontend — landing page + full dashboard |
| `apps/api` | FastAPI Python backend — REST API + PostgreSQL |
| `apps/docs` | Documentation site |
| `packages/ui` | Shared React component library |
| `packages/eslint-config` | Shared ESLint rules |
| `packages/typescript-config` | Shared TypeScript config |

The `apps/web` workspace is the focus of this document.

---

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) + React 19 |
| Language | TypeScript 5.9 (strict mode) |
| Styling | Tailwind CSS 4 + CSS Modules (landing pages) |
| Animation | GSAP 3.14 + Lenis (smooth scrolling) |
| Icons | Lucide React |
| Charts | Recharts 3.8 |
| Package Manager | Bun |
| Fonts | Syne (display) + Inter (body) via Google Fonts |

---

## 3. Architecture Diagram

```
Browser
  └── Next.js 15 App Router  (apps/web)
        │
        ├── app/layout.tsx                Root layout — fonts, SmoothScrolling (Lenis)
        │
        ├── app/page.tsx                  Landing page
        │     └── components/landing/    15+ CSS Modules sections
        │
        ├── app/auth/
        │     ├── login/page.tsx          → POST /auth/login → localStorage token
        │     └── signup/page.tsx         → POST /auth/signup
        │               └── window.dispatchEvent("auth-changed")  ← Observer
        │
        └── app/dashboard/
              ├── layout.tsx              Fixed sidebar + auth guard (Template Method)
              │                           Body scroll via Lenis — sidebar fixed:position
              │
              ├── page.tsx                Overview
              │     ├── StatCard[]        Factory pattern — 4 stat cards
              │     ├── ActionCard[]      Factory pattern — 3 action cards (all linked)
              │     └── LOGS[]            Expandable log rows (click to reveal detail)
              │
              ├── campaigns/
              │     ├── page.tsx          Campaigns list
              │     │     ├── Live search filter
              │     │     ├── Status dropdown filter (All/Active/Paused)
              │     │     ├── Pause/Resume per campaign (inline toggle)
              │     │     └── CampaignPanel slide-over (detail + delete)
              │     └── new/page.tsx      4-step creation wizard
              │           ├── useReducer FSM (State Machine pattern)
              │           ├── validateStep() per-step validation
              │           └── lib/api.ts → POST /campaign/create → FastAPI → PostgreSQL
              │
              ├── team/page.tsx           Team management
              │     ├── InviteModal       Send invitations with role selector
              │     ├── EditRoleModal     Change a member's role live
              │     ├── MemberMenu        MoreVertical dropdown per row
              │     └── AuditPanel        Timeline slide-over
              │
              ├── integrations/page.tsx   Integration marketplace
              │     ├── Category filter tabs (6 categories)
              │     ├── ConnectModal      API key input + async connect flow
              │     ├── ManageModal       Force sync + disconnect
              │     └── WebhookPanel      Configure inbound/outbound webhooks
              │
              └── settings/page.tsx       5-tab settings (Strategy pattern)
                    ├── My Account        Profile, name, signature
                    ├── Security          Password change + 2FA toggle
                    ├── Billing           Plan card + usage bars + invoices
                    ├── Notifications     Toggle switches per event type
                    └── API & Nodes       Key reveal/copy + node stats + revoke
```

**Scroll architecture:** The root `DashboardLayout` uses `min-h-screen` with a `fixed` sidebar. The `<body>` scrolls naturally, which Lenis (mounted at the root layout level) intercepts and smooths. The previous `h-screen + overflow-y-auto` on `<main>` was preventing Lenis from seeing scroll events — this was fixed by removing the scroll container and letting `window` handle it.

---

## 4. Directory Structure

```
apps/web/
├── app/
│   ├── layout.tsx                Root layout — fonts, SmoothScrolling
│   ├── page.tsx                  Landing page (11 sections)
│   ├── globals.css               CSS custom properties + Tailwind import
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   └── dashboard/
│       ├── layout.tsx            Fixed sidebar, auth guard, body scroll
│       ├── page.tsx              Overview — stats, actions, expandable logs
│       ├── campaigns/
│       │   ├── page.tsx          List + search + filter + detail panel
│       │   └── new/page.tsx      4-step wizard with useReducer + API call
│       ├── integrations/page.tsx Category filter + connect/manage modals
│       ├── team/page.tsx         Invite modal + member dropdown + audit logs
│       └── settings/page.tsx     5 fully implemented tabs
├── components/
│   ├── landing/                  Landing sections + .module.css files
│   ├── AuthModal.tsx
│   └── SmoothScrolling.tsx       Lenis wrapper (root scroll provider)
├── lib/
│   └── api.ts                    Typed API client — createCampaign, getCampaigns
├── public/
│   └── authimg/login_bg.jpg
├── tsconfig.json                 baseUrl + @/* path alias configured
└── next.config.js
```

---

## 5. Dashboard Pages & Features

### 5.1 Overview (`/dashboard`)

| Element | Behaviour |
|---------|-----------|
| **Stat cards** (4) | Display: Active Agents, Cluster Health, Inference Time, Successful Tasks |
| **"New Campaign" button** | `<Link>` to `/dashboard/campaigns/new` |
| **"Manage Team" action card** | Links to `/dashboard/team` |
| **"Link Integrations" action card** | Links to `/dashboard/integrations` |
| **Real-time Logs** (5 entries) | Each row is a `<button>` — click to expand inline detail text |
| **"View Campaigns" link** | Navigates to campaigns list |

All `ActionCard` items use `<Link>` — zero dead hrefs.

---

### 5.2 Campaigns (`/dashboard/campaigns`)

| Element | Behaviour |
|---------|-----------|
| **Search input** | Live-filters campaign list by name (case-insensitive) |
| **Filter button** | Dropdown: All / Active / Paused. Highlights blue when a filter is active |
| **Stat cards** | Total Reach updates dynamically based on Active campaigns only |
| **Campaign row** | Click anywhere on the row → opens `CampaignPanel` slide-over |
| **Pause/Resume button** | Inline per row. Toggles status in local state immediately |
| **`CampaignPanel`** | Shows: progress bar, reach, engagement, leads, budget, creation date |
| **Pause/Resume in panel** | Same toggle, keeps panel open and reflects new status |
| **Edit Campaign** | Links to `/dashboard/campaigns/new` (reuse the form) |
| **Delete Campaign** | Two-step confirmation inside the panel. Removes from list on confirm |
| **"Launch New Campaign" button** | `<Link>` to `/dashboard/campaigns/new` |

State: `campaigns[]` is held in `useState` so pause/resume/delete reflect immediately without a reload.

---

### 5.3 Campaign Form (`/dashboard/campaigns/new`)

| Step | Fields | Validation |
|------|--------|------------|
| **0 — Configuration** | Protocol Name, Base Budget, Product Name, Cluster Type (3 buttons) | Name + Product Name required |
| **1 — Targeting** | Region (display), Ideal Audience, Keywords (add/remove tags) | Ideal Audience required |
| **2 — Optimization** | Campaign Goal (3 options), Lead Sources (multi-select), Lead Limit | All three required |
| **3 — Launch** | Read-only summary of all 10 fields | — |

- `useReducer` with a discriminated-union action type manages all form state
- `validateStep()` is a pure function — called on every "Next" click
- Error messages appear inline under each invalid field
- On submit: calls `createCampaign()` from `lib/api.ts` → `POST /campaign/create`
- On API error: shows a red error banner on Step 3 without redirecting

---

### 5.4 Team (`/dashboard/team`)

| Element | Behaviour |
|---------|-----------|
| **"Invite Member" button** | Opens `InviteModal` |
| **`InviteModal`** | Name, Email, Role selector (4 roles). On submit: adds member to table live. Shows success screen |
| **Search input** | Filters members by name or email in real time |
| **Stats row** | Total / Active / Pending counts update as members are added/removed |
| **MoreVertical (⋮) button** | Per-row dropdown with: Edit Role, Resend Invite (if pending), Remove Member |
| **`EditRoleModal`** | Role picker grid. On save: updates role + access level badge in table |
| **Resend Invite** | Triggers toast confirmation — `"Invite resent to email"` |
| **Remove Member** | Removes from `members[]` state immediately. Toast confirms |
| **"Audit Logs" button** | Opens `AuditPanel` — right-side slide-over with a 6-event timeline |
| **Toast notifications** | Bottom-right, auto-dismiss after 3 seconds |

Role → Access Level mapping is centralized in `ROLE_ACCESS`:

```typescript
const ROLE_ACCESS: Record<MemberRole, AccessLevel> = {
  Admin: "Full",
  Manager: "Moderate",
  Analyst: "Read-only",
  Viewer: "Read-only",
};
```

---

### 5.5 Integrations (`/dashboard/integrations`)

| Element | Behaviour |
|---------|-----------|
| **Category tabs** (6) | Filter the grid: All Protocols / Communication / Sales / Developers / Email / Marketing |
| **Stats row** | "Connected" count updates live as you connect/disconnect |
| **"Link Cluster" button** | Opens `ConnectModal` for unconnected integrations |
| **`ConnectModal`** | API key input + 1.5s simulated connect + success screen. Updates status to "Connected" |
| **"Manage" button** | Opens `ManageModal` for connected integrations |
| **`ManageModal`** | Shows integration ID, last sync time. "Force Sync" button (updates lastSync). Disconnect with two-step confirm |
| **"Learn Protocol" link** | Opens the integration's website in a new tab |
| **Custom Webhook card** | Opens `WebhookPanel` |
| **`WebhookPanel`** | Shows Revora inbound URL with copy button. Target endpoint input. Event tags. "Save Webhook" |
| **"Browse Marketplace" button** | Also opens `WebhookPanel` (consistent entry point) |

Integration statuses are held in a `statuses: Record<string, IntegrationStatus>` map in component state, so connect/disconnect reflect without reload.

---

### 5.6 Settings (`/dashboard/settings`)

| Tab | Features |
|-----|----------|
| **My Account** | Display Name input, Email (disabled), Autonomous Signature textarea, Upload Avatar button |
| **Security** | Current / New / Confirm Password inputs. 2FA toggle — shows green confirmation banner when enabled |
| **Billing** | Pro plan card with next billing date, Upgrade button. Usage bars (Campaigns, API Requests, Team Members). Invoice list |
| **Notifications** | Three accessible toggle switches (`role="switch"`, `aria-checked`) — Email Alerts, Campaign Updates, System Notifications. Each persists independently |
| **API & Nodes** | Masked API key with Eye/EyeOff reveal. Copy button with "Copied ✓" feedback. Node stats (Active / Max / Region). Revoke Key danger zone |

All tabs use the same `INPUT_CLASS` constant to avoid Tailwind class repetition (DRY principle).

---

## 6. Design Patterns Used

### 6.1 Observer Pattern

**Location:** `app/auth/login/page.tsx` → `components/landing/Navbar.tsx`

The browser's native `EventTarget` acts as the event bus. Auth pages publish; any component subscribes without knowing about the publisher.

```typescript
// Publisher:
window.dispatchEvent(new Event("auth-changed"));

// Subscriber:
useEffect(() => {
  window.addEventListener("auth-changed", checkAuth);
  return () => window.removeEventListener("auth-changed", checkAuth);
}, []);
```

**Why:** Navbar and login page are in completely separate component trees. Observer decouples them — the publisher doesn't know or care who is listening.

---

### 6.2 Factory Method Pattern

**Location:** `app/dashboard/page.tsx` — `StatCard`, `ActionCard`; `app/dashboard/layout.tsx` — `SidebarItem`; `app/dashboard/team/page.tsx` — `InviteModal`, `AuditPanel`, `MemberMenu`, `EditRoleModal`

A Factory accepts typed input and reliably produces a uniform output. Callers only supply data; the factory owns all rendering logic.

```typescript
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon; // ← polymorphic: any Lucide icon
}

const StatCard = ({ title, value, change, icon: Icon }: StatCardProps) => (
  /* JSX always the same shape, data varies */
);

// Caller only specifies data — never layout:
<StatCard title="Active Agents" value="12" change="+4" icon={BrainCircuit} />
```

In the Team page, `InviteModal`, `EditRoleModal`, `AuditPanel`, and `MemberMenu` are all factories for modal/panel UI — they accept props and produce consistent, fully-styled overlays.

---

### 6.3 Strategy Pattern

**Location:** `app/dashboard/settings/page.tsx` — 5-tab system  
**Also:** `app/dashboard/integrations/page.tsx` — category filter

`activeTab` / `activeCategory` is the **context**. Each conditional block is a **concrete strategy** selected at runtime. The shell (sidebar, card wrapper, glow effect) is invariant; only the content strategy swaps.

```typescript
// Context:
const [activeTab, setActiveTab] = useState<TabCode>("account");

// Runtime strategy switch — caller selects:
setActiveTab("security");

// Concrete strategies — isolated, independently editable:
{activeTab === "account"       && <AccountContent />}
{activeTab === "security"      && <SecurityContent />}
{activeTab === "billing"       && <BillingContent />}
{activeTab === "notifications" && <NotificationsContent />}
{activeTab === "api"           && <ApiContent />}
```

Changing the Billing tab never risks breaking the Security tab. Same structure applies to the 6-category filter in Integrations.

---

### 6.4 Composite Pattern

**Location:** `app/dashboard/layout.tsx`

`SidebarItem` is the **leaf**. `<nav>` is the **composite** — it holds leaves uniformly through `SidebarItemProps`. Adding a new nav link requires only one more `<SidebarItem>` line.

```typescript
<nav className="space-y-2">
  <SidebarItem icon={LayoutDashboard} label="Overview"      href="/dashboard" />
  <SidebarItem icon={Megaphone}       label="Campaigns"     href="/dashboard/campaigns" />
  <SidebarItem icon={Users}           label="Team"          href="/dashboard/team" />
  <SidebarItem icon={LayoutGrid}      label="Integrations"  href="/dashboard/integrations" />
  <SidebarItem icon={Settings}        label="Settings"      href="/dashboard/settings" />
</nav>
```

---

### 6.5 Template Method Pattern

**Location:** `app/dashboard/layout.tsx`

`DashboardLayout` defines the invariant skeleton — fixed sidebar, auth check, gradient blobs, sticky top fade. Each `page.tsx` fills in `{children}`.

```typescript
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505]">
      <aside className="fixed left-0 top-0 h-screen w-72 ..."> {/* Always */}
        ...
      </aside>
      <main className="lg:ml-72 min-h-screen">
        {children}   {/* ← variable step, filled by each page */}
      </main>
    </div>
  );
}
```

---

### 6.6 State Machine via `useReducer`

**Location:** `app/dashboard/campaigns/new/page.tsx`

The campaign creation form is a deterministic FSM. Every possible transition is expressed as a discriminated union action type. The reducer is a pure function — same input always produces same output, no side effects.

```typescript
type CampaignFormAction =
  | { type: "SET_FIELD";        field: string; value: string }
  | { type: "SET_CLUSTER";      value: ClusterType }
  | { type: "SET_GOAL";         value: CampaignGoal }
  | { type: "ADD_KEYWORD";      value: string }
  | { type: "REMOVE_KEYWORD";   value: string }
  | { type: "TOGGLE_LEAD_SOURCE"; value: LeadSource }
  | { type: "SET_ERRORS";       errors: Record<string, string> }
  | { type: "CLEAR_ERRORS" };
```

With 10+ interconnected fields, `useState` per field would scatter updates. The reducer centralises everything — every state transition is auditable in one function.

---

### 6.7 Command Pattern (implicit)

**Location:** `app/dashboard/team/page.tsx`, `app/dashboard/campaigns/page.tsx`

User actions are wrapped as handler functions that encapsulate the operation, its target, and any side effects (toast, state update). The caller (button `onClick`) doesn't know *how* the action executes.

```typescript
// Command — encapsulates: what (remove), who (member), side effect (toast):
const handleRemove = (id: string) => {
  const member = members.find((m) => m.id === id);
  setMembers((prev) => prev.filter((m) => m.id !== id));
  setActiveMenu(null);
  if (member) showToast(`${member.name} removed from team`);
};

// Invoker — knows nothing about the implementation:
<button onClick={() => handleRemove(member.id)}>Remove Member</button>
```

---

## 7. Design Patterns Intentionally NOT Used

### 7.1 Singleton (class-based)

**Why not:** In Next.js SSR, a module-level class instance is not shared across server requests — it breaks the Singleton invariant. `localStorage` is the browser-native globally-unique store for auth; a module constant handles the single API base URL.

```typescript
// lib/api.ts — one source of truth, no class needed:
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
```

---

### 7.2 Repository Pattern (formal)

**Why not (yet):** One data source, no caching, no need to swap implementations. `lib/api.ts` is a lightweight precursor. When React Query / SWR is added, `lib/api.ts` becomes the concrete Repository implementation automatically.

---

### 7.3 React Context API for Auth

**Why not:** Context re-renders the entire consumer subtree on any value change. The `window.dispatchEvent("auth-changed")` approach re-renders only subscribers, with zero React reconciliation overhead for the rest of the dashboard. The tradeoff: more imperative code (manual `addEventListener`/`removeEventListener`).

---

### 7.4 Higher-Order Components (HOCs)

**Why not:** Next.js App Router handles auth at the layout level. HOC-injected props are invisible to TypeScript from the outside, making inference harder. Custom hooks achieve the same reuse more transparently.

---

### 7.5 Render Props

**Why not:** Superseded by custom hooks. `const { isLoading, data } = useCampaigns()` is cleaner than `<CampaignsProvider render={({ data }) => ...} />`.

---

## 8. Where Alternative Patterns Could Be Applied

### 8.1 Context API for Auth
Replace `localStorage` reads in `useEffect` with `createContext<AuthState>`. Benefit: type-safe user object everywhere in the tree, no scattered `localStorage.getItem` calls. Cost: mild re-render on logout.

### 8.2 React Query as Repository Layer
Wrap `lib/api.ts` with `@tanstack/react-query`. Benefit: automatic caching, background refetch, standardised loading/error state. `lib/api.ts` becomes the formal Repository; components never call `fetch`.

```typescript
const { data: campaigns, isLoading } = useQuery({
  queryKey: ["campaigns"],
  queryFn: getCampaigns,
});
```

### 8.3 Zustand for Campaign Draft Persistence
The current `useReducer` state is lost on navigation away from the form. A Zustand store keyed by draft ID would persist it. The reducer's action types can be transplanted 1:1 into a Zustand slice.

### 8.4 Custom Hook — `useMultiStepForm`
Extract step navigation + validation from `NewCampaignPage` into a reusable hook. Justified when a second multi-step form (onboarding, checkout) is added.

### 8.5 Custom Hook — `useModal`
Team and Integrations pages manage multiple modal states (`showInvite`, `editingMember`, `activeMenu`, `connectModal`, `manageModal`). A `useModal<T>()` hook returning `{ open, close, data, isOpen }` would clean this up.

```typescript
const inviteModal = useModal<void>();
const editModal = useModal<TeamMember>();

// Usage:
inviteModal.open();
editModal.open(member);
```

---

## 9. OOP Concepts in TypeScript

### Encapsulation

Props interfaces define the **public API** of each component. The internal Tailwind classes, JSX structure, and DOM output are hidden.

```typescript
// Public API — what callers see and supply:
interface CampaignPanelProps {
  campaign: Campaign;
  onClose: () => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}
// Callers cannot access the internal `confirmDelete` state or DOM structure.
```

### Polymorphism (Structural / Duck Typing)

TypeScript's structural typing means any value with the right shape satisfies a type. `LucideIcon` is satisfied by any of 1000+ Lucide components. `Integration.icon` accepts any React component that renders an SVG.

```typescript
const StatCard = ({ icon: Icon }: { icon: LucideIcon }) => <Icon size={24} />;

<StatCard icon={BrainCircuit} />  // ← BrainCircuit, Activity, Rocket all satisfy LucideIcon
<StatCard icon={Activity} />
```

### Composition over Inheritance

No class hierarchies anywhere. Complex UIs are assembled from simple components:

- `TeamPage` composes `InviteModal` + `EditRoleModal` + `AuditPanel` + `MemberMenu`
- `IntegrationsPage` composes `ConnectModal` + `ManageModal` + `WebhookPanel`
- `SettingsPage` composes `Toggle` (reused across Security and Notifications tabs)
- `DashboardLayout` composes `SidebarItem` leaves

### Abstraction

`lib/api.ts` hides `fetch`, auth header injection, error normalisation, and JSON parsing behind typed async functions. `ROLE_ACCESS` in team page abstracts the role→access mapping behind a lookup table rather than scattering conditionals.

```typescript
// Abstraction in lib/api.ts — caller sees:
createCampaign(payload) → Promise<CampaignCreateResponse>

// Abstraction in team page — caller sees:
ROLE_ACCESS[role]   // → "Full" | "Moderate" | "Read-only"
```

### Single Responsibility

Each modal/panel component has exactly one job:
- `InviteModal` — collect and submit a new team invite
- `AuditPanel` — display a read-only event timeline
- `CampaignPanel` — show campaign detail and host pause/delete actions
- `ConnectModal` — collect API credentials and connect an integration
- `WebhookPanel` — configure webhook endpoints

---

## 10. Data Flow

### Campaign Form Submission

```
User types in Step 0 input
  → onChange → dispatch({ type: "SET_FIELD", field: "campaign_name", value })
  → campaignFormReducer (pure) → new state
  → React re-renders only the changed input

Click "Next Protocol Step"
  → validateStep(currentStep, formState) → errors object
  → errors found: dispatch SET_ERRORS → red messages under fields
  → no errors:    dispatch CLEAR_ERRORS → setCurrentStep(n+1)

Step 3: Click "Initialize Protocol"
  → handleLaunch() async
  → setIsSubmitting(true) → spinner
  → createCampaign(payload) from lib/api.ts
      → fetch POST /campaign/create with Authorization header
      → FastAPI → Pydantic validation → SQLAlchemy → PostgreSQL
      → { message, campaign_id }
  → router.push("/dashboard/campaigns") on success
  → setSubmitError(message) on failure — error banner on Step 3
```

### Team Actions

```
Click "Invite Member"
  → setShowInvite(true) → InviteModal renders

InviteModal submit
  → builds TeamMember object from form values
  → onInvite(member) → setMembers([...prev, member])
  → modal shows success screen → onClose() → toast fires

Click MoreVertical → MemberMenu renders
Click "Edit Role" → setEditingMember(member) → EditRoleModal renders
Save role → handleEditRole(id, role) → setMembers (map + ROLE_ACCESS lookup) → toast
Click "Remove Member" → handleRemove(id) → setMembers (filter) → toast
```

### Integration Connect

```
Click "Link Cluster"
  → setConnectModal(integration)

ConnectModal: enter API key → click "Link Cluster"
  → setConnecting(true) → 1.5s setTimeout (simulated async)
  → setDone(true) → success screen
  → onConnect(id) → setStatuses({ ...prev, [id]: "Connected" })
  → connectedCount stat card updates automatically
```

---

## 11. API Contract

### `POST /campaign/create`

**Request:**
```json
{
  "campaign_name": "Q4 Viral Growth",
  "product_name": "Revora AI Platform",
  "product_description": "B2B SaaS founders in the US",
  "goal": "Lead Generation",
  "lead_sources": ["LinkedIn", "Email"],
  "lead_limit": 500
}
```

**Success (200):**
```json
{ "message": "Campaign created", "campaign_id": "uuid-string" }
```

**Validation Error (422):**
```json
{ "detail": [{ "loc": ["body", "campaign_name"], "msg": "field required" }] }
```

TypeScript types live in `lib/api.ts` — `CampaignCreatePayload` and `CampaignCreateResponse`.

### `GET /campaign/`

Returns all campaigns. TypeScript function: `getCampaigns(): Promise<unknown[]>` in `lib/api.ts`.

---

## 12. Running Locally

**Prerequisites:** Bun ≥ 1.3, Node ≥ 18, Python 3.11+ (for API)

```bash
# Install all workspace dependencies from monorepo root:
bun install

# Frontend only:
cd apps/web && bun dev
# → http://localhost:3000

# API (separate terminal):
cd apps/api
pip install -r requirements.txt
uvicorn app.main:app --reload
# → http://localhost:8000

# Everything together from root:
bun dev
```

**Skip auth during development** — run in browser DevTools console:

```javascript
localStorage.setItem("token", "mock_token");
localStorage.setItem("user", JSON.stringify({
  full_name: "Alex Rivera",
  email: "alex@revora.ai"
}));
location.href = "/dashboard";
```

**Dashboard pages:**

| Route | Page |
|-------|------|
| `/dashboard` | Overview — stats, expandable logs |
| `/dashboard/campaigns` | Campaign list — search, filter, detail panel |
| `/dashboard/campaigns/new` | 4-step campaign wizard |
| `/dashboard/team` | Team management — invite, edit, remove |
| `/dashboard/integrations` | Integration marketplace — connect, manage |
| `/dashboard/settings` | Settings — 5 tabs, all interactive |

---

*Revora `apps/web` — Last updated April 2026*
