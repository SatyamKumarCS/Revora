"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./FeatureTextReveal.module.css";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function FeatureTextReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  const textToReveal =
    "We handle the manual prospecting and research so you can focus on building relationships and closing deals.";
  const words = textToReveal.split(" ");

  useGSAP(
    () => {
      if (!textRef.current || !containerRef.current) return;

      // Select the rendered word spans using standard string concat
      const selector = "." + styles.word;
      const wordElements = textRef.current.querySelectorAll(selector);

      // Setup the ScrollTrigger animation
      gsap.to(wordElements, {
        color: "rgba(255, 255, 255, 1)",
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });

      // Optional parallax for the background glow shapes
      const glowSelector = "." + styles.glowShape1;
      gsap.to(glowSelector, {
        y: -200,
        scrollTrigger: {
          trigger: containerRef.current,
          scrub: true,
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <div className={styles.sectionWrapper} ref={containerRef}>
      {/* Background Orbs */}
      <div className={styles.glowShape1} />
      <div className={styles.glowShape2} />
      <div className={styles.glowShape3} />

      <div className={styles.textContainer}>
        <h2 className={styles.revealText} ref={textRef}>
          {words.map((word, index) => (
            <span
              key={index}
              className={styles.word}
              style={{ color: "rgba(255, 255, 255, 0.2)" }}
            >
              {word}&nbsp;
            </span>
          ))}
        </h2>
      </div>
    </div>
  );
}
