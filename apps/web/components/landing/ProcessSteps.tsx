"use client";

import React, { useState, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import s from "./ProcessSteps.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/* ── Step Data (5 steps) ── */
const STEPS = [
  {
    title: "1 — Define Target ICP",
    body: "Tell us about your Ideal Customer Profile. Select industry, company size, revenue, tech stack, and location. Our AI uses this criteria to build exactly the lists you need.",
    stat: "2",
    statUnit: "min",
    statLabel: "Average setup time",
  },
  {
    title: "2 — AI Discovery",
    body: "Revora searches millions of records instantly. We automatically find companies matching your filters and pinpoint the key decision-makers (CEOs, Founders, CMOs) complete with verified contact info.",
    stat: "1M+",
    statUnit: "",
    statLabel: "Filtered records",
  },
  {
    title: "3 — Deep Research",
    body: "Our AI agents analyze the company's website, news, and LinkedIn profiles. It builds a detailed summary of their recent activities and current business challenges to form the perfect outreach angle.",
    stat: "99",
    statUnit: "%",
    statLabel: "Research accuracy",
  },
  {
    title: "4 — Generate Outreach",
    body: "No more generic templates. The AI generates highly personalized cold emails that feel human because they reference the deep research we just performed on each specific company.",
    stat: "45",
    statUnit: "%",
    statLabel: "Higher reply rates",
  },
  {
    title: "5 — Smart Follow-Ups",
    body: "Most deals close in the follow-ups. Set your sequence timing (e.g., Day 3, Day 7, Day 14) and our system handles the entire campaign natively until the prospect replies and books a meeting.",
    stat: "4x",
    statUnit: "",
    statLabel: "Meetings booked",
  },
];

/* ═══════════════════ Component ═══════════════════ */
export default function ProcessSteps() {
  const [activeStep, setActiveStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((idx: number) => {
    setActiveStep(idx);
    setAnimKey((k) => k + 1);
  }, []);

  const prev = useCallback(() => {
    goTo(activeStep === 0 ? STEPS.length - 1 : activeStep - 1);
  }, [activeStep, goTo]);

  const next = useCallback(() => {
    goTo(activeStep === STEPS.length - 1 ? 0 : activeStep + 1);
  }, [activeStep, goTo]);

  const step = STEPS[activeStep]!;

  /* Scroll-triggered fade-in for the whole section */
  useGSAP(
    () => {
      if (!sectionRef.current) return;
      gsap.fromTo(
        sectionRef.current.querySelector("[data-bento-grid]"),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={s.section}>
      {/* ── Header ── */}
      <div className={s.header}>
        <h2 className={s.heading}>
          <span className={s.headingAccent}>How it</span> Works
        </h2>

        <div className={s.subRow}>
          <div className={s.badge}>
            <span className={s.badgeNum}>003</span>
            <span className={s.badgeLabel}>plat-form</span>
          </div>

          <h3 className={s.subTitle}>
            Automated outbound sales
            <br />
            from start to finish.
          </h3>

          <p className={s.subDesc}>
            Let AI handle the manual prospecting work while you close.
          </p>
        </div>
      </div>

      {/* ── Bento Grid ── */}
      <div className={s.bento} data-bento-grid>
        {/* Left: Image */}
        <div className={s.cellImage}>
          <div className={s.imagePlaceholder}>
            <div className={s.imageInner}>
              <div className={s.imageInnerDot} />
              <div className={s.imageInnerDot} />
              <div className={s.imageInnerDot} />
              <div className={s.imageInnerDot} />
            </div>
          </div>
          <div className={s.imageGlow} />
          <div className={s.imageReflect} />
        </div>

        {/* Top-center: Platform Process + dots */}
        <div className={s.cellProcess}>
          <span className={s.processLabel}>Sales Workflow</span>
          <div className={s.dots}>
            {STEPS.map((_, i) => (
              <button
                key={i}
                className={`${s.dot} ${i === activeStep ? s.dotActive : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Top-right: Arrow navigation */}
        <div className={s.cellArrows}>
          <button
            className={s.arrowBtn}
            onClick={prev}
            aria-label="Previous step"
          >
            ←
          </button>
          <button className={s.arrowBtn} onClick={next} aria-label="Next step">
            →
          </button>
        </div>

        {/* Center: Step content */}
        <div className={s.cellContent}>
          <div key={animKey} className={s.slideIn}>
            <h4 className={s.stepTitle}>{step.title}</h4>
            <p className={s.stepBody}>{step.body}</p>
          </div>
        </div>

        {/* Right: CTA */}
        <div className={s.cellCTA}>
          <button
            className={s.ctaBtn}
            onClick={() => window.dispatchEvent(new Event("open-launch-modal"))}
          >
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
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
            Book a Demo
          </button>
          <span className={s.ctaLabel}>
            Book a demo to see
            <br />
            this process in action.
          </span>
        </div>

        {/* Bottom-center: Stat */}
        <div className={s.cellStat}>
          <div className={s.statValue}>
            {step.stat}
            <span className={s.statUnit}>{step.statUnit}</span>
          </div>
          <div className={s.statLabel}>{step.statLabel}</div>
        </div>

        {/* Bottom-right: empty */}
        <div className={s.cellEmpty} />
      </div>
    </section>
  );
}
