"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import s from "./Integrations.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}
/* ── Platform logos data ── */
const LOGOS = [
  { name: "Zapier", icon: "zapier/ff4a00" },
  { name: "Slack", icon: "slack/e01e5a" },
  { name: "Airtable", icon: "airtable/18bfff" },
  { name: "PayPal", icon: "paypal/0079c1" },
  { name: "Notion", icon: "notion/ffffff" },
  { name: "Zendesk", icon: "zendesk/00363d" },
  { name: "Salesforce", icon: "salesforce/00a1e0" },
  { name: "Asana", icon: "asana/f06a6a" },
];
/* ═══════════════════ Component ═══════════════════ */
export default function Integrations() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const bento = sectionRef.current.querySelector("[data-int-bento]");
      if (!bento) return;

      gsap.fromTo(
        bento,
        { y: 50, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 25%",
            scrub: 1,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section id="solutions" ref={sectionRef} className={s.section}>
      <div className={s.glow} />

      {/* ── Header ── */}
      <div className={s.header}>
        <div className={s.labelCol}>
          <div className={s.label}>INTEGRATION</div>
          <div className={s.labelLine} />
        </div>
        <div className={s.headerText}>
          <h2 className={s.heading}>
            <span className={s.hi}>Seamless</span>{" "}
            <span className={s.hn}>CRM</span>
            <br />
            <span className={s.hn}>Integrations</span>
          </h2>
          <p className={s.desc}>
            Connect your CRM and sales tools into one powerful ecosystem to sync
            leads, track replies, and manage pipelines effortlessly.
          </p>
        </div>
      </div>

      {/* ── Bento Grid ── */}
      <div className={s.bento} data-int-bento>
        {/* 1 · Analytics Module — spans both rows */}
        <div className={`${s.cell} ${s.cellAnalytics}`}>
          <div>
            <div className={s.tag}>
              <span className={s.tagDot} /> Advanced Architecture
            </div>
            <div className={s.hexGrid}>
              <div className={s.hexRow}>
                <div className={s.hex} />
                <div className={s.hex} />
              </div>
              <div className={s.hexRow}>
                <div className={s.hex} />
                <div className={`${s.hex} ${s.hexCenter}`} />
                <div className={s.hex} />
              </div>
              <div className={s.hexRow}>
                <div className={s.hex} />
                <div className={s.hex} />
              </div>
            </div>
          </div>
          <div>
            <div className={s.cellTitle}>
              Pipeline
              <br />
              Analytics
            </div>
            <div className={s.cellDesc}>
              Track email opens, replies, and meetings booked across teams.
            </div>
          </div>
        </div>

        {/* 2 · AI Model 3 */}
        <div className={`${s.cell} ${s.cellAI}`}>
          <div className={s.aiSphere} />
          <div className={s.aiName}>AI Data Enrichment</div>
          <div className={s.aiDot} />
        </div>

        {/* 3 · Integration Templates */}
        <div className={`${s.cell} ${s.cellTpl}`}>
          <div className={s.tplLabel}>Outreach Templates</div>
          <div className={s.tplIcons}>
            <div className={s.tplIcon}>
              <div className={s.tplIconInner}>
                <div className={s.tplDot} />
                <div className={s.tplDot} />
                <div className={s.tplDot} />
                <div className={s.tplDot} />
              </div>
            </div>
            <div className={s.tplIcon}>
              <div className={s.tplIconInner}>
                <div className={s.tplDot} />
                <div className={s.tplDot} />
                <div className={s.tplDot} />
                <div className={s.tplDot} />
              </div>
            </div>
            <div className={s.tplIcon}>
              <div className={s.tplBar} />
            </div>
          </div>
        </div>

        {/* 4 · Speed metrics */}
        <div className={`${s.cell} ${s.cellSpeed}`}>
          <div className={s.speedItem}>
            <div className={s.speedTop}>
              <span className={s.speedBadge}>10×</span>
              <span className={s.speedText}>Faster Prospecting</span>
            </div>
            <div className={s.speedBar}>
              <div className={s.speedFill} style={{ width: "65%" }} />
            </div>
          </div>
          <div className={s.speedItem}>
            <div className={s.speedTop}>
              <span className={s.speedBadge}>2×</span>
              <span className={s.speedText}>Higher Reply Rates</span>
            </div>
            <div className={s.speedBar}>
              <div className={s.speedFill} style={{ width: "85%" }} />
            </div>
          </div>
        </div>

        {/* 5 · Uptime 99% */}
        <div className={`${s.cell} ${s.cellUptime}`}>
          <svg
            className={s.uptimeIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Z" />
          </svg>
          <div className={s.uptimeVal}>
            99<span className={s.uptimePct}>%</span>
          </div>
        </div>
      </div>

      {/* ── Platform logos ── */}
      <div className={s.platforms}>
        <div className={s.logoArea}>
          <p className={s.platText}>
            Your favorite sales tools are
            <br />
            ready to be connected.
          </p>
          <div className={s.logoGrid}>
            {LOGOS.map((l, i) => (
              <div key={i} className={s.logoCard}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://cdn.simpleicons.org/${l.icon}`}
                  alt={l.name}
                  className={s.logoImg}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={s.footerDivider} />

        <div className={s.footerArea}>
          <p className={s.platText}>
            Receive assistance from our integration
            <br />
            specialists.
          </p>
          <div className={s.footerBtnWrap}>
            <button className={s.footerBtn}>Instant Support</button>
          </div>
        </div>
      </div>
    </section>
  );
}
