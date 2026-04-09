"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import s from "./Milestones.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/* ── Stats Data ── */
const STATS = [
  { label: "Leads\nDiscovered", value: "10M", accent: "+" },
  { label: "Active Sales\nTeams", value: "3K", accent: "" },
  { label: "Emails\nSent", value: "50M", accent: "+" },
  { label: "Meetings\nBooked", value: "450K", accent: "" },
  { label: "Avg. Reply\nRate", value: "18", accent: "%" },
  { label: "Hours Saved\nWeekly", value: "120K", accent: "+" },
];

/* ═══════════════════ Component ═══════════════════ */
export default function Milestones() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const cards = sectionRef.current.querySelectorAll("[data-stat]");

      /* Staggered count-up feel: cards slide up one by one */
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
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
    <section id="resources" ref={sectionRef} className={s.section}>
      <div className={s.glowA} />
      <div className={s.glowB} />

      {/* ── Header ── */}
      <div className={s.header}>
        <div className={s.label}>SCALE</div>

        <h2 className={s.heading}>
          <span className={s.headingItalic}>Your Pipeline,</span>
          <br />
          <span className={s.headingNormal}>on AutoPilot</span>
        </h2>

        <p className={s.description}>
          <span className={s.descDot}>
            <span className={s.descDotInner} />
          </span>
          Driving measurable growth worldwide with every lead discovered, email
          personalized, and meeting booked.
        </p>
      </div>

      {/* ── Stats Grid ── */}
      <div className={s.grid}>
        {STATS.map((stat, i) => (
          <div key={i} className={s.card} data-stat>
            <div className={s.cardLabel}>
              {stat.label.split("\n").map((line, j) => (
                <span key={j}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
            <div className={s.cardValue}>
              {stat.value}
              {stat.accent && (
                <span className={s.cardValueAccent}>{stat.accent}</span>
              )}
            </div>
            <div className={s.cardGlow} />
          </div>
        ))}
      </div>
    </section>
  );
}
