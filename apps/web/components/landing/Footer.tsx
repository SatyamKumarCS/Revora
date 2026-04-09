"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import s from "./Footer.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mainFooterRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ctaRef.current || !mainFooterRef.current || !containerRef.current)
        return;

      // Pin the CTA area while the main footer reveals from bottom
      // We achieve this visually by letting the mainFooter scroll naturally
      // over the CTA. The mainFooter has a higher z-index and solid background.
      ScrollTrigger.create({
        trigger: ctaRef.current,
        start: "top top", // when CTA hits top of screen
        endTrigger: containerRef.current,
        end: "bottom bottom",
        pin: true,
        pinSpacing: false, // allows the next element (mainFooter) to scroll over it
      });
    },
    { scope: containerRef },
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={containerRef} className={s.footerContainer}>
      {/* ────────────────────────────────────────────────────────
          1. CTA / Let's Talk Section (Pinned via ScrollTrigger)
          ──────────────────────────────────────────────────────── */}
      <div ref={ctaRef} className={s.ctaSection}>
        {/* Marquee */}
        <div className={s.ctaMarquee}>
          <div className={s.ctaMarqueeTrack}>
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className={s.ctaMarqueeItem}>
                Where finding leads and booking meetings gets simple.
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={s.ctaContent}>
          <h2 className={s.letsTalk}>Let&apos;s Talk.</h2>

          <div className={s.ctaBento}>
            <div className={s.ctaBentoLeft}>
              {/* Follow Us */}
              <div className={s.ctaCell}>
                <div className={s.ctaCellHeader}>
                  <div className={s.ctaCellTitle}>Follow us</div>
                  <div className={s.socialIcons}>
                    <svg
                      className={s.socialIcon}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <svg
                      className={s.socialIcon}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                    <svg
                      className={s.socialIcon}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* What we offer */}
              <div className={s.ctaCell}>
                <div
                  className={s.ctaCellTitle}
                  style={{ marginBottom: "1rem" }}
                >
                  What we offer
                </div>
                <ul className={s.offerList}>
                  <li>AI Lead Discovery</li>
                  <li>Automated Research</li>
                  <li>Personalized Outreach</li>
                  <li>Smart Follow-Ups</li>
                  <li>CRM Integration</li>
                </ul>
              </div>

              {/* Contact Grid */}
              <div className={s.ctaCell}>
                <div className={s.contactGrid}>
                  <div>
                    <div className={s.contactItemTitle}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      Digital
                    </div>
                    <div className={s.contactItemText}>
                      hello@autopilotsdr.com
                    </div>
                  </div>
                  <div>
                    <div className={s.contactItemTitle}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      Office
                    </div>
                    <div className={s.contactItemText}>
                      Westerdoksdijk 500
                      <br />
                      1013 BX — Amsterdam
                      <br />
                      Netherlands, EU
                    </div>
                    <div className={s.contactPhone}>+31 20 832-4455</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={s.ctaBentoRight}>
              <div className={s.ctaCell} style={{ flex: 1 }}>
                <div>
                  <div className={s.formTitle}>
                    Got a question, challenge, or idea?
                  </div>
                  <div className={s.formDesc}>
                    Fill out the form — we&apos;ll get back to you shortly.
                  </div>
                  <div className={s.formWrap}>
                    <div className={s.inputGroup}>
                      <input
                        type="text"
                        placeholder="Your Name"
                        className={s.inputField}
                      />
                    </div>
                    <div className={s.inputGroup}>
                      <input
                        type="email"
                        placeholder="Your Email"
                        className={s.inputField}
                      />
                    </div>
                    <div className={s.inputGroup}>
                      <input
                        type="text"
                        placeholder="Your Company"
                        className={s.inputField}
                      />
                    </div>
                    <div className={s.inputGroup}>
                      <textarea
                        placeholder="Your message"
                        className={s.textAreaField}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className={s.formFooter}>
                  <div className={s.privacyText}>
                    By submitting, you agree to our{" "}
                    <a href="#" className={s.privacyLink}>
                      Privacy Policy.
                    </a>
                  </div>
                  <button className={s.submitBtn}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Carousel */}
        <div className={s.partnerCarousel}>
          <div className={s.partnerTrack}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={s.partnerItem}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
                RevoraPartner
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          2. Main Bottom Footer (Scrolls over CTA)
          ──────────────────────────────────────────────────────── */}
      <div ref={mainFooterRef} className={s.mainFooter}>
        <div className={s.footerContent}>
          <div
            className={s.brandBanner}
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')",
            }}
          >
            <div className={s.brandBannerOverlay} />
            <div className={s.brandBannerTop}>
              <span className={s.brandEmail}>hello@revora.com</span>
            </div>
            <div className={s.brandLogo}>
              revora<span>™</span>
            </div>
            <div className={s.brandAddress}>
              Westerdoksdijk 500
              <br />
              1013 BX — Amsterdam
              <br />
              Netherlands, EU
            </div>
          </div>

          <div className={s.footerGrid}>
            <div className={s.leftCol}>
              <div className={s.spinnerLogo}>
                <div className={s.spinnerDot} />
                <svg className={s.spinnerSvg} viewBox="0 0 100 100">
                  <path
                    id="curve"
                    fill="transparent"
                    d="M 10 50 a 40 40 0 1 1 80 0 a 40 40 0 1 1 -80 0"
                  />
                  <text fill="rgba(255,255,255,0.4)" fontSize="10">
                    <textPath href="#curve" startOffset="0">
                      you close the deals - we do the prospecting -
                    </textPath>
                  </text>
                </svg>
              </div>
              <div className={s.brandSlogan}>
                The AI sales agent
                <br />
                for modern
                <br />
                outbound teams.
              </div>
            </div>

            <div className={s.midCol}>
              <div className={s.navBlock}>
                <div className={s.navBlockTop}>
                  <div className={`${s.navBlockDot} ${s.active}`} />
                  <div className={s.navBlockDot} />
                </div>
                <a href="#" className={s.navLink}>
                  Home
                </a>
                <a href="#" className={s.navLink}>
                  Work
                </a>
                <a href="#" className={s.navLink}>
                  Services
                </a>
                <a href="#" className={s.navLink}>
                  Process
                </a>
                <a href="#" className={s.navLink}>
                  Smart Analytics
                </a>
                <a href="#" className={s.navLink}>
                  Pricing
                </a>
                <a href="#" className={s.navLink}>
                  FAQ
                </a>
                <a href="#" className={s.navLink}>
                  Testimonials
                </a>
              </div>
              <div className={s.navBlock}>
                <div className={s.navBlockTop}>
                  <div className={s.navBlockDot} />
                  <div className={`${s.navBlockDot} ${s.active}`} />
                </div>
                <a href="#" className={s.navLink}>
                  The Team
                </a>
                <a href="#" className={s.navLink}>
                  Platform Lab®
                </a>
                <a href="#" className={s.navLink}>
                  Contact
                </a>
                <a href="#" className={s.navLink}>
                  Terms & Service
                </a>
                <a href="#" className={s.navLink}>
                  Privacy Policy
                </a>
                <a href="#" className={s.navLink}>
                  GDPR Compliance
                </a>
                <a href="#" className={s.navLink}>
                  Data Protection
                </a>
                <a href="#" className={s.navLink}>
                  404
                </a>
              </div>
            </div>

            <div className={s.rightCol}>
              <div className={s.newsTitle}>
                Keep up with our journey and updates
              </div>
              <div className={s.newsDesc}>
                Get the latest news, insights directly to your inbox.{" "}
                <span className={s.newsAsterisk}>*</span>
              </div>
              <div className={s.newsForm}>
                <input
                  type="text"
                  placeholder="Your Name"
                  className={s.newsInput}
                />
                <div className={s.newsRow}>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className={s.newsInput}
                    style={{ flex: 1 }}
                  />
                  <button className={s.newsSubmit}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
              <div className={s.newsTerms}>
                By submitting, you agree to our{" "}
                <a href="#" className={s.newsTermsLink}>
                  Terms & Service.
                </a>
              </div>
              <div className={s.newsSpam}>
                <span className={s.newsAsterisk}>*</span> No spam, just awesome
                updates.
              </div>
            </div>
          </div>

          <div className={s.bottomBar}>
            <div className={s.copyrightCol}>
              <div className={s.crText}>
                2021-2025 © [ Revora B.V. ] All rights reserved.
              </div>
              <div className={s.crDesigned}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                designed by revora team
              </div>
            </div>
            <div className={s.companyInfoCol}>
              <strong>Revora B.V.</strong> specializes in AI-powered sales
              automation, helping teams scale their outbound pipelines
              effortlessly.
            </div>
            <div className={s.socialBottomCol}>
              <svg
                className={s.socialIcon}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <svg
                className={s.socialIcon}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </div>
            <div className={s.backToTop} onClick={scrollToTop}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
