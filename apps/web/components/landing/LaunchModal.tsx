"use client";

import React, { useEffect, useState } from "react";
import styles from "./LaunchModal.module.css";

export default function LaunchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-launch-modal", handleOpen);
    return () => window.removeEventListener("open-launch-modal", handleOpen);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
    }, 400); // reset state after closing animation
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.show : ""}`}
      onClick={handleClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.glowOrange} />

        <button
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label="Close"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.content}>
          <div className={styles.badge}>
            <div className={styles.badgeDot} />
            Early Access
          </div>

          <h2 className={styles.title}>
            We are launching
            <br />
            <span>soon.</span>
          </h2>

          <p className={styles.description}>
            {submitted
              ? "Thanks for joining! We'll be in touch."
              : "Reimagine your outbound workflow. Join the waitlist to be the first to experience Revora."}
          </p>

          {!submitted && (
            <form className={styles.waitlistForm} onSubmit={handleSubmit}>
              <input
                type="email"
                className={styles.input}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className={styles.submitBtn}>
                Notify Me
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
