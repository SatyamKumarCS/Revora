"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AuthModal.module.css";

const ROLES = [
  { id: "founder", label: "Founder", description: "Shape the roadmap" },
  { id: "operator", label: "Operator", description: "Keep delivery sharp" },
  { id: "investor", label: "Investor", description: "Track portfolio wins" },
];

type Mode = "login" | "signup";

export default function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("signup");
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const open = () => {
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      setIsOpen(false);
      document.body.style.overflow = "";
    };

    window.addEventListener("open-auth-modal", open);
    window.addEventListener("close-auth-modal", close);
    return () => {
      window.removeEventListener("open-auth-modal", open);
      window.removeEventListener("close-auth-modal", close);
    };
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "";
  };

  const handleContinue = () => {
    if (mode === "login") {
      closeModal();
      router.push("/auth/login");
      return;
    }

    if (!role) return;
    closeModal();
    const query = role ? `?role=${role}` : "";
    router.push(`/auth/signup${query}`);
  };

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button
          className={styles.closeBtn}
          onClick={closeModal}
          aria-label="Close"
        >
          ×
        </button>

        <div className={styles.header}>
          <span className={styles.kicker}>Ready when you are</span>
          <h3 className={styles.title}>Join Revora in seconds</h3>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tabBtn} ${mode === "signup" ? styles.tabActive : ""}`}
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
          <button
            className={`${styles.tabBtn} ${mode === "login" ? styles.tabActive : ""}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
        </div>

        <div className={styles.modeBody}>
          {mode === "login" ? (
            <p className={styles.modeDescription}>
              Returning to build momentum? Jump back into your workspace and
              keep scaling at lightspeed.
            </p>
          ) : (
            <>
              <p className={styles.modeDescription}>
                Choose the hat you wear most. We’ll personalize onboarding for
                your flow — you can switch anytime.
              </p>
              <div className={styles.roleGrid}>
                {ROLES.map((item) => (
                  <button
                    key={item.id}
                    className={`${styles.roleCard} ${role === item.id ? styles.roleActive : ""}`}
                    onClick={() => setRole(item.id)}
                    type="button"
                  >
                    <div className={styles.roleLabel}>{item.label}</div>
                    <div className={styles.roleMeta}>{item.description}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className={styles.actions}>
            <button
              className={styles.primaryBtn}
              onClick={handleContinue}
              disabled={mode === "signup" && !role}
            >
              {mode === "login" ? "Continue to login" : "Start with this role"}
            </button>
            <button className={styles.secondaryLink} onClick={closeModal}>
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
