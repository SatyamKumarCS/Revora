"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import s from "./Pricing.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/* ── Plan Data ── */
const PLANS = [
  {
    name: "Studio",
    price: "$49",
    planType: "Basic",
    seats: "2",
    features: [
      { text: "Smart Deployment", bold: false },
      { text: "Basic Monitoring", bold: false },
      { text: "Core Security", bold: false },
      { text: "Email Support", bold: false },
      { text: "5 team seats", bold: false },
      { text: "Basic Analytics", bold: false },
      { text: "Standard API", bold: false },
    ],
  },
  {
    name: "Scale",
    price: "$89",
    planType: "Advanced",
    seats: "6",
    features: [
      { text: "All Studio features", bold: true },
      { text: "AI optimization", bold: false },
      { text: "Advanced monitoring", bold: false },
      { text: "Enhanced security", bold: false },
      { text: "24/7 support", bold: false },
      { text: "Auto-scaling", bold: false },
      { text: "Full analytics", bold: false },
      { text: "Priority API", bold: false },
    ],
  },
  {
    name: "Supreme",
    price: "$249",
    planType: "Enterprise",
    seats: "100",
    features: [
      { text: "All Scale features", bold: true },
      { text: "Dedicated support", bold: false },
      { text: "Private hosting", bold: false },
      { text: "Custom security", bold: false },
      { text: "Training included", bold: false },
      { text: "Priority features", bold: false },
      { text: "Custom reporting", bold: false },
      { text: "Enterprise SLA", bold: false },
    ],
  },
];

/* ═══════════════════ Component ═══════════════════ */
export default function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const rows = sectionRef.current.querySelectorAll("[data-plan]");

      gsap.fromTo(
        rows,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 10%",
            scrub: 1,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section id="pricing" ref={sectionRef} className={s.section}>
      {/* ── Header ── */}
      <div className={s.header}>
        <h2 className={s.heading}>
          <span className={s.headingAccent}>Pricing</span>
        </h2>

        <div className={s.subRow}>
          <div className={s.badge}>
            <span className={s.badgeNum}>005</span>
            <span className={s.badgeLabel}>plat-form</span>
          </div>

          <h3 className={s.subTitle}>
            Flexible, transparent plans.
            <br />
            Built for clarity and growth.
          </h3>

          <p className={s.subDesc}>
            Scale at your own pace — choose only what you need, when you need
            it. Nothing extra, nothing locked in.
          </p>
        </div>
      </div>

      {/* ── Plan Rows ── */}
      <div className={s.plans}>
        {PLANS.map((plan, i) => (
          <div key={i} className={s.planRow} data-plan>
            {/* Image */}
            <div className={s.cellImage}>
              <div className={s.planName}>{plan.name}</div>
              <div className={s.imageBox}>
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
            </div>

            {/* Price */}
            <div className={s.cellPrice}>
              <span className={s.cellLabel}>Price</span>
              <span className={s.price}>{plan.price}</span>
              <div className={s.toggle}>
                <span>Monthly</span>
                <div className={s.toggleDot} />
                <span>Yearly</span>
              </div>
            </div>

            {/* Plan type + Seats */}
            <div className={s.cellPlan}>
              <div>
                <span className={s.cellLabel}>Plan</span>
                <div className={s.planType}>{plan.planType}</div>
              </div>
              <div className={s.seatsDivider} />
              <div>
                <span className={s.seatsLabel}>Seats</span>
                <div className={s.seatsValue}>{plan.seats}</div>
              </div>
            </div>

            {/* Features */}
            <div className={s.cellFeatures}>
              <ul className={s.featureList}>
                {plan.features.map((f, j) => (
                  <li
                    key={j}
                    className={f.bold ? s.featureBold : s.featureItem}
                  >
                    {f.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className={s.cellCTA}>
              <button className={s.selectBtn}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Select Plan
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className={s.footer}>
        <div className={s.footerDots}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={s.footerDot} />
          ))}
        </div>
        <div className={s.footerCTA}>
          <span>Contact sales for Enterprise Plan</span>
          <button className={s.footerArrow}>→</button>
        </div>
      </div>
    </section>
  );
}
