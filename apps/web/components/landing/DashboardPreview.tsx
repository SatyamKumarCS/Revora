"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import s from "./DashboardPreview.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/* ── Inline SVG Icons ── */
function IconDashboard() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}
function IconCampaigns() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IconAnalytics() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}
function IconIntegration() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
function IconReports() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
    </svg>
  );
}
function IconPerformance() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
function IconEdit() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}
function IconTrendUp() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
function IconBox() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="3" x2="21" y1="9" y2="9" />
      <line x1="9" x2="9" y1="21" y2="9" />
    </svg>
  );
}

/* ── Sidebar config ── */
const NAV_ITEMS = [
  { icon: IconDashboard, label: "Dashboard", active: true },
  { icon: IconCampaigns, label: "Campaigns" },
  { icon: IconAnalytics, label: "Analytics" },
  { icon: IconIntegration, label: "Integration" },
  { icon: IconReports, label: "Reports" },
  { icon: IconPerformance, label: "Performance" },
];

const BAR_HEIGHTS = [28, 42, 35, 55, 48, 72, 65, 92, 78, 60, 85, 45];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/* ═══════════════════ Component ═══════════════════ */
export default function DashboardPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !cardRef.current) return;
      const el = cardRef.current;

      gsap.set(el, { transformPerspective: 1200 });

      /* Card enters with a dramatic 3D tilt then flattens */
      gsap.fromTo(
        el,
        { rotateX: 35, rotateY: -6, scale: 0.82, opacity: 0, y: 80 },
        {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          opacity: 1,
          y: 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            end: "top 10%",
            scrub: 1.5,
          },
        },
      );

      /* Subtle continued float after settled */
      gsap.to(el, {
        rotateX: -2,
        rotateY: 1,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center",
          end: "bottom top",
          scrub: 2.5,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section id="product" ref={sectionRef} className={s.section}>
      {/* Background glows */}
      <div className={s.glowOrange} />
      <div className={s.glowWhite} />

      {/* ── The 3D Card ── */}
      <div ref={cardRef} className={s.card}>
        {/* ══ Sidebar ══ */}
        <aside className={s.sidebar}>
          <div className={s.logo}>
            <span className={s.logoAccent}>r</span>
            <span>evora</span>
          </div>

          <nav className={s.nav}>
            {NAV_ITEMS.map((item) => {
              const Ico = item.icon;
              return (
                <a
                  key={item.label}
                  href="#"
                  className={item.active ? s.navItemActive : s.navItem}
                >
                  <Ico />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          <a href="#" className={s.settingsItem}>
            <IconSettings />
            <span>Settings</span>
          </a>
        </aside>

        {/* ══ Main ══ */}
        <div className={s.main}>
          {/* Top bar */}
          <header className={s.topBar}>
            <div className={s.searchBox}>
              <IconSearch />
              Search Strategies
            </div>
            <div className={s.topActions}>
              <button className={s.createBtn}>
                <IconEdit /> Create Campaign
              </button>
              <div className={s.bellWrapper}>
                <IconBell />
                <span className={s.bellDot} />
              </div>
            </div>
          </header>

          {/* Content */}
          <div className={s.content}>
            <h2 className={s.sectionTitle}>Pipeline Overview</h2>

            {/* Stat cards */}
            <div className={s.statsGrid}>
              {/* Growth */}
              <div className={s.statCard}>
                <div className={s.statIconOrange}>
                  <IconTrendUp />
                </div>
                <div>
                  <p className={s.statLabel}>Growth this Week</p>
                  <p className={s.statValue}>$45,800</p>
                </div>
                <div className={s.statCardGlow} />
              </div>

              {/* Active Campaigns */}
              <div className={s.statCard}>
                <div className={s.statIconNeutral}>
                  <IconBox />
                </div>
                <div>
                  <p className={s.statLabel}>Active Sequences</p>
                  <p className={s.statValue}>
                    12 <span className={s.statBadge}>+3 New</span>
                  </p>
                </div>
              </div>

              {/* AI Insights */}
              <div className={s.statCard}>
                <div className={s.statIconNeutral}>
                  <IconChart />
                </div>
                <div>
                  <p className={s.statLabel}>High-Intent Leads</p>
                  <p className={s.statValue}>
                    840 <span className={s.statBadgeGreen}>+15%</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className={s.chartsGrid}>
              {/* Bar chart */}
              <div className={s.chartPanel}>
                <div className={s.chartHeader}>
                  <h3 className={s.chartTitle}>Outreach Analytics</h3>
                  <div className={s.chartLegend}>
                    <span>
                      <i className={s.legendDotDim} /> Meetings Booked
                    </span>
                    <span>
                      <i className={s.legendDotOrange} /> Reply Rate
                    </span>
                  </div>
                </div>

                <div className={s.barChartWrap}>
                  <div className={s.yAxis}>
                    <span>60K</span>
                    <span>40K</span>
                    <span>20K</span>
                    <span>0</span>
                  </div>
                  <div className={s.barsRow}>
                    {BAR_HEIGHTS.map((h, i) => (
                      <div key={i} className={s.barGroup}>
                        <div className={s.barDim} style={{ height: h + "%" }} />
                        <div className={s.barBright} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className={s.xLabels}>
                  {MONTHS.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>

              {/* Donut chart */}
              <div className={s.donutPanel}>
                <h3 className={s.donutTitle}>Lead Sources</h3>

                <div
                  className={s.donut}
                  style={{
                    background:
                      "conic-gradient(#5B6EFF 0% 35%, rgba(255,255,255,0.08) 35% 55%, rgba(255,255,255,0.04) 55% 75%, rgba(255,255,255,0.15) 75% 100%)",
                  }}
                >
                  <div className={s.donutHole}>
                    <div className={s.donutBadge}>
                      AI
                      <br />
                      Load
                    </div>
                  </div>
                </div>

                <div className={s.donutLegend}>
                  <span>
                    <i className={s.dotOrange} /> SaaS
                  </span>
                  <span>
                    <i className={s.dotBlue} /> E-Commerce
                  </span>
                  <span>
                    <i className={s.dotGray} /> Healthcare
                  </span>
                  <span>
                    <i className={s.dotFaint} /> Other
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
