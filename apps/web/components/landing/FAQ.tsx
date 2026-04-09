"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import s from "./FAQ.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/* ── FAQ Data ── */
const FAQS = [
  {
    q: "What exactly is Revora?",
    a: "Revora is an AI-powered platform designed to automate the workflow of Sales Development Representatives (SDRs). It finds leads, research prospects, generates highly personalized outreach, and schedules intelligent follow-ups automatically.",
  },
  {
    q: "How does the AI personalization work?",
    a: "Our AI agent analyzes each prospect's company website, news, and LinkedIn presence to generate a brief summary. It then uses this unique context to write personalized cold emails that feel human and highly relevant to their current business challenges.",
  },
  {
    q: "Do I still need to verify the emails?",
    a: "No. Revora automatically discovers and verifies all contact information simultaneously using built-in enrichment tools. We only sync 100% verified emails to your pipeline to protect your sender reputation.",
  },
  {
    q: "What CRMs do you integrate with?",
    a: "We currently natively integrate with HubSpot, Salesforce, and Pipedrive. All communication history, replies, meetings booked, and lead data are automatically synced back directly into your CRM.",
  },
  {
    q: "What happens if a prospect doesn't reply to the first email?",
    a: "Revora features smart follow-up automation. If a prospect does not respond, the system will automatically send subsequent follow-up emails based on your custom schedule (e.g. Day 3, Day 7, Day 14).",
  },
  {
    q: "How does lead scoring work?",
    a: "The platform ranks your leads based on out-of-the-box UI signals like company size, industry fit, technology stack matching, and email engagement. This helps your human closers focus on the highest-priority prospects first.",
  },
  {
    q: "Who is this product designed for?",
    a: "Revora is specifically built for startups doing founder-led sales, dedicated B2B sales teams scaling outbound, and lead generation agencies running outreach campaigns for multiple clients at once.",
  },
  {
    q: "How much time will this save my team?",
    a: "On average, Revora reduces manual prospecting work by 10 to 15 hours per week per SDR. Your team spends less time gathering lists and writing templates, and more time having meaningful sales conversations with interested buyers.",
  },
];

/* ═══════════════════ Component ═══════════════════ */
export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const toggle = (i: number) => {
    setOpenIdx(openIdx === i ? -1 : i);
  };

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      gsap.fromTo(
        sectionRef.current.querySelector("[data-faq-content]"),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
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
    <section ref={sectionRef} className={s.section}>
      {/* ── Header ── */}
      <div className={s.header}>
        <h2 className={s.heading}>
          <span className={s.headingAccent}>Questions</span> & Answers
        </h2>

        <div className={s.subRow}>
          <div className={s.badge}>
            <span className={s.badgeNum}>006</span>
            <span className={s.badgeLabel}>plat-form</span>
          </div>

          <h3 className={s.subTitle}>
            Simple explanations to help
            <br />
            you get started move faster.
          </h3>

          <p className={s.subDesc}>
            Spend less time guessing and more time building.
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className={s.content} data-faq-content>
        {/* Left — Accordion */}
        <div className={s.accordion}>
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className={s.item}>
                <button
                  className={`${s.question} ${isOpen ? s.questionActive : ""}`}
                  onClick={() => toggle(i)}
                >
                  {faq.q}
                  <span className={s.icon}>
                    <span className={s.iconBar} />
                    <span
                      className={`${s.iconBar} ${isOpen ? s.iconBarVOpen : s.iconBarV}`}
                    />
                  </span>
                </button>
                <div className={`${s.answer} ${isOpen ? s.answerOpen : ""}`}>
                  <p className={s.answerText}>{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right — Image + CTA */}
        <div className={s.rightCol}>
          <div className={s.imagePlaceholder}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="Team collaborating on platform"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "16px",
              }}
            />
            <div className={s.imageBadge}>
              <div className={s.imageBadgeDot} />
            </div>
          </div>

          <div className={s.ctaBox}>
            <h4 className={s.ctaTitle}>You still have questions?</h4>
            <p className={s.ctaDesc}>
              Every team&apos;s needs are different. Let our experts show you
              how AutoPilot SDR can work for your specific requirements —
              let&apos;s have a chat and find the right solution for you.
            </p>
            <button className={s.ctaLink}>
              Let&apos;s have a chat
              <span className={s.ctaArrow}>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
