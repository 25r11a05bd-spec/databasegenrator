"use client";

import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Stats from "./Stats";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Comparison from "./Comparison";
import ValueProps from "./ValueProps";
import Testimonials from "./Testimonials";
import CTA from "./CTA";
import Footer from "./Footer";
import "@/styles/landing.css";

export default function LandingPage() {
  useEffect(() => {
    // 1. Mouse follower glow effect
    const cursorGlow = document.getElementById("cursor-glow");
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    function renderGlow() {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      if (cursorGlow) {
        cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }
      animId = requestAnimationFrame(renderGlow);
    }
    animId = requestAnimationFrame(renderGlow);

    // 2. Intersection Observer for Scroll Reveals
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    document.querySelectorAll(".reveal-item, .reveal-scale, .reveal-left").forEach((el) => {
      revealObserver.observe(el);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
      revealObserver.disconnect();
    };
  }, []);

  return (
    <div className="bg-cosmic-grid text-slate-200 antialiased font-sans min-h-screen selection:bg-purple-500 selection:text-white relative overflow-x-hidden">
      {/* Interactive Mouse Cursor Glow */}
      <div id="cursor-glow"></div>

      {/* Ambient Violet / Cyan Nebula Blurs */}
      <div className="fixed top-[-140px] left-1/2 -translate-x-1/2 w-[980px] h-[520px] bg-gradient-to-r from-purple-600/25 via-indigo-600/20 to-cyan-500/15 rounded-full blur-[140px] pointer-events-none z-0 animate-nebula-drift"></div>
      <div className="fixed bottom-0 right-0 w-[550px] h-[450px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Stats / Metrics */}
      <Stats />

      {/* 4. Features Grid */}
      <Features />

      {/* 5. How It Works */}
      <HowItWorks />

      {/* 6. Comparison Table */}
      <Comparison />

      {/* 7. Value Propositions */}
      <ValueProps />

      {/* 8. Social Proof & Testimonials */}
      <Testimonials />

      {/* 9. Call to Action */}
      <CTA />

      {/* 10. Footer */}
      <Footer />
    </div>
  );
}
