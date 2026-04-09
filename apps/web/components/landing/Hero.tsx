"use client";

import React from "react";
import styles from "./Hero.module.css";

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "18px", height: "18px" }}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles.arrowIcon}
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

export default function Hero() {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.topRow}>
        <div className={styles.tagline}>
          You close the deals,
          <span className={styles.taglineBold}>we do the prospecting.</span>
        </div>
      </div>

      <h1 className={styles.mainHeadline}>
        <span className={styles.headlineLine}></span>
        The smarter
        <br />
        way
        <br />
        to <span className={styles.highlight}>find, engage,</span>
        <br />
        and
        <br />
        <span className={styles.highlight}>close</span> more
        <br />
        deals.
      </h1>

      <div className={styles.featureCard}>
        <div className={styles.cardImage}></div>
        <div className={styles.cardFooter}>
          <div>
            <div className={styles.cardTitle}>Sales AI Engine</div>
            <div className={styles.cardSubtitle}>{"// Smart Sequences"}</div>
          </div>
          <ArrowRightIcon />
        </div>
      </div>

      <div className={styles.midRow}>
        <div className={styles.actionSection}>
          <div className={styles.actionTitle}>See Revora in action</div>
          <div className={styles.actionDesc}>
            Join our guided tour and build your first AI pipeline.
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <div className={styles.connector}></div>
          <button
            className={styles.primaryBtn}
            onClick={() => window.dispatchEvent(new Event("open-launch-modal"))}
          >
            <CalendarIcon />
            Book a Demo
          </button>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.statBlock}>
          <div className={styles.statValue}>
            10-15<small>h</small>
          </div>
          <div className={styles.statText}>
            <div className={styles.statLabel}>Time Saved</div>
            <div className={styles.statSub}>per SDR weekly</div>
          </div>
        </div>

        <div className={styles.statBlock}>
          <div className={styles.statValue}>
            +45<small>%</small>
          </div>
          <div className={styles.statText}>
            <div className={styles.statLabel}>Reply Rate</div>
            <div className={styles.statSub}>AI-personalized emails</div>
          </div>
        </div>
      </div>
    </div>
  );
}
