"use client";

import React, { useEffect, useRef } from "react";

export default function Stats() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counters = el.querySelectorAll<HTMLElement>(".stat-counter");
            counters.forEach((counter) => {
              const target = parseInt(counter.getAttribute("data-target") || "0", 10);
              const suffix = counter.getAttribute("data-suffix") || "";
              const duration = 1600;
              const start = 0;
              const startTime = performance.now();

              function updateCounter(currentTime: number) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 4);
                const currentVal = Math.floor(start + (target - start) * easeProgress);
                counter.textContent = currentVal + suffix;

                if (progress < 1) {
                  requestAnimationFrame(updateCounter);
                } else {
                  counter.textContent = target + suffix;
                }
              }
              requestAnimationFrame(updateCounter);
            });

            // Flash emerald glow for 'Zero'
            const zeroEl = document.getElementById("stat-zero");
            if (zeroEl) {
              zeroEl.style.textShadow = "0 0 20px rgba(78, 222, 163, 0.9)";
              setTimeout(() => {
                zeroEl.style.textShadow = "none";
              }, 1200);
            }

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10" id="stats-section" ref={statsRef}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="reveal-scale glass-frosted p-5 rounded-2xl text-center border border-purple-500/20 hover:border-purple-400/70 hover:shadow-glow-violet transition-all duration-300"
          style={{ transitionDelay: "50ms" }}
        >
          <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight stat-counter" data-suffix="+" data-target="1000">
            0+
          </div>
          <div className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">Schemas Generated</div>
        </div>

        <div
          className="reveal-scale glass-frosted p-5 rounded-2xl text-center border border-purple-500/20 hover:border-cyan-400/70 hover:shadow-glow-cyan transition-all duration-300"
          style={{ transitionDelay: "150ms" }}
        >
          <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-cyan-300 tracking-tight stat-counter" data-suffix="+" data-target="500">
            0+
          </div>
          <div className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">Active Users</div>
        </div>

        <div
          className="reveal-scale glass-frosted p-5 rounded-2xl text-center border border-purple-500/20 hover:border-purple-400/70 hover:shadow-glow-violet transition-all duration-300"
          style={{ transitionDelay: "250ms" }}
        >
          <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-purple-300 tracking-tight hover:scale-105 transition-transform duration-300">
            &lt;5 Second
          </div>
          <div className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">Deploy Time</div>
        </div>

        <div
          className="reveal-scale glass-frosted p-5 rounded-2xl text-center border border-purple-500/20 hover:border-emerald-400/70 hover:shadow-[0_0_35px_-6px_rgba(78,222,163,0.4)] transition-all duration-300"
          style={{ transitionDelay: "350ms" }}
        >
          <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-emerald-400 tracking-tight transition-all duration-500" id="stat-zero">
            Zero
          </div>
          <div className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">SQL Errors</div>
        </div>
      </div>
    </section>
  );
}
