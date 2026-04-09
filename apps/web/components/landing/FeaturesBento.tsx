"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import s from "./FeaturesBento.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/* ════════════════════════════════════════════════════
   FeaturesBento — 6-card bento grid feature showcase
   ════════════════════════════════════════════════════ */
export default function FeaturesBento() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const cards = sectionRef.current.querySelectorAll("[data-bento]");

      gsap.fromTo(
        cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={s.section}>
      <div className={s.glowA} />
      <div className={s.glowB} />

      <div className={s.grid}>
        {/* ── 1. Ask AI ── */}
        <div className={s.cardAI} data-bento>
          <div className={s.aiPrompt}>
            Ask AI anything...
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
              <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.64 5.64l2.83 2.83M15.54 15.54l2.83 2.83M5.64 18.36l2.83-2.83M15.54 8.46l2.83-2.83" />
            </svg>
          </div>

          {/* Mini dashboard mock */}
          <div className={s.miniDash}>
            <div className={s.miniDashTop}>
              <span className={s.miniDashTitle}>Performance Overview</span>
              <button className={s.miniDashBtn}>Create Campaign</button>
            </div>
            <div className={s.miniStats}>
              <div className={s.miniStat}>
                <div className={s.miniStatLabel}>Growth</div>
                <div className={s.miniStatVal}>$45,800</div>
              </div>
              <div className={s.miniStat}>
                <div className={s.miniStatLabel}>Campaigns</div>
                <div className={s.miniStatVal}>24</div>
              </div>
              <div className={s.miniStat}>
                <div className={s.miniStatLabel}>Insights</div>
                <div className={s.miniStatVal}>1,250</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. Stats / Growth ── */}
        <div className={s.cardStats} data-bento>
          {/* Animated ring */}
          <div className={s.ringWrap}>
            <div className={s.ring} />
          </div>

          <div className={s.statsRow}>
            <div className={s.statItem}>
              <div className={s.statNum}>
                0<span>%</span>
              </div>
              <div className={s.statName}>Growth</div>
            </div>
            <div className={s.statItem}>
              <div className={s.statNum}>
                11<span>%</span>
              </div>
              <div className={s.statName}>Sales</div>
            </div>
            <div className={s.statItem}>
              <div className={s.statNum}>
                21<span>%</span>
              </div>
              <div className={s.statName}>Efficiency</div>
            </div>
          </div>
        </div>

        {/* ── 3. Custom Reports ── */}
        <div className={s.cardReports} data-bento>
          <div className={s.folderIcon}>
            <div className={s.folderTab} />
            <span className={s.folderLabel}>Sales Performance</span>
            <div className={s.folderBar} />
            <div className={s.folderBarShort} />
          </div>
          <div className={s.cardLabel}>Custom Reports</div>
        </div>

        {/* ── 4. Integrations ── */}
        <div className={s.cardIntegrations} data-bento>
          <div className={s.intOrbit}>
            <div className={s.intRing} />
            <div className={s.intCenter}>integration</div>

            {/* Orbit dots — brand initials */}
            <div className={s.intDot}>PP</div>
            <div className={s.intDotOrange}>✦</div>
            <div className={s.intDot}>Z</div>
            <div className={s.intDot}>S</div>
            <div className={s.intDot}>N</div>
            <div className={s.intDotOrange}>⊞</div>
          </div>
        </div>

        {/* ── 5. Simple Strategies ── */}
        <div className={s.cardStrategies} data-bento>
          <div className={s.boardGrid}>
            {/* 12 cells, some with dots and a plus sign */}
            <div className={s.boardCell} />
            <div className={s.boardCell} />
            <div className={s.boardCell} />
            <div className={s.boardCell} />
            <div className={s.boardCellDot} />
            <div className={s.boardCell} />
            <div className={s.boardCell} />
            <div className={s.boardCellPlus}>+</div>
            <div className={s.boardCell} />
            <div className={s.boardCellDot} />
            <div className={s.boardCell} />
            <div className={s.boardCell} />
          </div>
          <div className={s.cardLabel}>Simple Strategies</div>
        </div>

        {/* ── 6. Process Optimisation ── */}
        <div className={s.cardProcess} data-bento>
          <div className={s.processTitle}>Process Optimisation</div>
          <div className={s.bars}>
            {[75, 55, 90, 40, 65].map((fill, i) => (
              <div key={i} className={s.processBar} style={{ height: "70px" }}>
                <div className={s.processBarTrack}>
                  <div
                    className={s.processBarFill}
                    style={{ height: fill + "%" }}
                  />
                  <div className={s.processBarDot} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
