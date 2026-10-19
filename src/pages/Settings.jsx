import React, { Suspense, lazy, useRef } from "react";
import "../styles/Settings.css";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { LuLink, LuLayoutDashboard, LuTrendingUp } from "react-icons/lu";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TiltCard from "../components/about/TiltCard";
import { useMediaQuery } from "../hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

const LinkChainScene = lazy(() => import("../components/about/LinkChainScene"));

const TECH_SKILLS = [
  { label: "React 18", color: "#61DAFB", level: 94, role: "UI & client state" },
  { label: "Recoil", color: "#1B48DA", level: 88, role: "Global atoms" },
  { label: "Vite", color: "#646CFF", level: 90, role: "Dev tooling" },
  { label: "Node.js", color: "#3C873A", level: 86, role: "API runtime" },
  { label: "Express.js", color: "#404D59", level: 84, role: "REST layer" },
  { label: "MongoDB", color: "#4DB33D", level: 82, role: "Persistence" },
  { label: "Mongoose", color: "#880000", level: 80, role: "ODM schemas" },
  { label: "ShortID", color: "#E8A838", level: 78, role: "Slug generation" },
];

const FEATURES = [
  {
    icon: LuLayoutDashboard,
    title: "Live Dashboard",
    desc: "Real-time global stats — total links, total clicks, device breakdown, and date-wise click trends.",
  },
  {
    icon: LuLink,
    title: "URL Management",
    desc: "Create, edit, and delete short links with optional remarks and automatic expiration support.",
  },
  {
    icon: LuTrendingUp,
    title: "Click Analytics",
    desc: "Every visit is logged with a timestamp, IP address, and device type. All data is public.",
  },
];

function About() {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useGSAP(
    () => {
      if (reduceMotion) return;

      const chars = titleRef.current?.querySelectorAll(".hero-char");
      if (chars?.length) {
        gsap.from(chars, {
          y: 80,
          rotateX: -90,
          opacity: 0,
          stagger: 0.035,
          duration: 0.85,
          ease: "back.out(1.4)",
          delay: 0.15,
        });
      }

      gsap.from(".hero-reveal", {
        y: 28,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.5,
      });

      gsap.from(".badge", {
        scale: 0,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "back.out(2)",
        delay: 0.75,
      });

      gsap.utils.toArray(".reveal-section").forEach((section) => {
        gsap.from(section.querySelectorAll(".reveal-item"), {
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
          y: 36,
          opacity: 0,
          stagger: 0.1,
          duration: 0.65,
          ease: "power2.out",
        });
      });

      gsap.utils.toArray(".skill-row").forEach((row) => {
        const fill = row.querySelector(".skill-fill");
        const level = Number(row.dataset.level || 0);
        gsap.fromTo(
          fill,
          { scaleX: 0 },
          {
            scaleX: level / 100,
            scrollTrigger: {
              trigger: row,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
            duration: 1.1,
            ease: "power3.inOut",
            transformOrigin: "left center",
          }
        );
      });

      gsap.utils.toArray(".about-step").forEach((step, i) => {
        gsap.from(step, {
          scrollTrigger: {
            trigger: step,
            start: "top 90%",
          },
          x: i % 2 === 0 ? -24 : 24,
          opacity: 0,
          duration: 0.55,
          ease: "power2.out",
        });
      });

      gsap.to(".hero-orb", {
        x: "random(-20, 20)",
        y: "random(-15, 15)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.4, from: "random" },
      });
    },
    { scope: rootRef, dependencies: [reduceMotion] }
  );

  const titleText = "URL Shortener";

  return (
    <div className="main-app about-scroll">
      <div className="about-page" ref={rootRef}>
        <div className="about-bg">
          <span className="hero-orb orb-a" />
          <span className="hero-orb orb-b" />
          <span className="hero-orb orb-c" />
          <div className="about-grain" />
        </div>

        <section className="about-hero">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="hero-kicker hero-reveal">Portfolio build · open access</p>
              <h1 className="about-title" ref={titleRef} aria-label={titleText}>
                {titleText.split("").map((char, i) => (
                  <span
                    key={`${char}-${i}`}
                    className="hero-char"
                    style={{ display: char === " " ? "inline-block" : "inline-block" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </h1>
              <p className="about-subtitle hero-reveal">
                A full-stack link shortening service with live analytics — no accounts,
                no friction. Paste, shorten, share, and watch clicks roll in.
              </p>
              <div className="about-badges hero-reveal">
                <span className="badge badge-open">Open Access</span>
                <span className="badge badge-realtime">Real-time Analytics</span>
                <span className="badge badge-free">100% Free</span>
              </div>
              <div className="hero-cta-row hero-reveal">
                <Link to="/dashboard" className="hero-cta hero-cta-primary">
                  Open dashboard
                </Link>
                <Link to="/links" className="hero-cta hero-cta-ghost">
                  Manage links
                </Link>
              </div>
            </div>

            <div className="hero-visual hero-reveal">
              {!isMobile && !reduceMotion ? (
                <Suspense fallback={<div className="hero-scene-fallback" />}>
                  <LinkChainScene />
                </Suspense>
              ) : (
                <div className="hero-scene-fallback hero-scene-fallback--mobile">
                  <div className="fallback-ring" />
                  <div className="fallback-ring fallback-ring--delay" />
                  <div className="fallback-ring fallback-ring--sm" />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="about-section reveal-section">
          <h2 className="about-section-title reveal-item">What it does</h2>
          <div className="about-features">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <TiltCard key={title} className="about-feature-card reveal-item">
                <div className="feature-icon-wrap">
                  <Icon className="feature-icon" />
                </div>
                <div>
                  <h3 className="feature-title">{title}</h3>
                  <p className="feature-desc">{desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        <section className="about-section reveal-section">
          <h2 className="about-section-title reveal-item">Stack proficiency</h2>
          <p className="section-lead reveal-item">
            Skills exercised building this project — bars animate as you scroll.
          </p>
          <div className="skill-grid">
            {TECH_SKILLS.map(({ label, color, level, role }) => (
              <div
                key={label}
                className="skill-row reveal-item"
                data-level={level}
              >
                <div className="skill-head">
                  <span className="skill-label" style={{ color }}>
                    {label}
                  </span>
                  <span className="skill-meta">{role}</span>
                  <span className="skill-pct">{level}%</span>
                </div>
                <div className="skill-track">
                  <div
                    className="skill-fill"
                    style={{ background: `linear-gradient(90deg, ${color}, ${color}99)` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="tech-pills reveal-item">
            {TECH_SKILLS.map(({ label, color }) => (
              <span
                key={`pill-${label}`}
                className="tech-pill"
                style={{ borderColor: color, color }}
              >
                {label}
              </span>
            ))}
          </div>
        </section>

        <section className="about-section reveal-section">
          <h2 className="about-section-title reveal-item">How it works</h2>
          <ol className="about-steps">
            <li className="about-step">
              <span className="step-num">1</span>
              <span>
                Paste any long URL into the <strong>Create new</strong> form.
              </span>
            </li>
            <li className="about-step">
              <span className="step-num">2</span>
              <span>
                Optionally add a remark and set an expiration date.
              </span>
            </li>
            <li className="about-step">
              <span className="step-num">3</span>
              <span>
                Copy the generated short link and share it anywhere.
              </span>
            </li>
            <li className="about-step">
              <span className="step-num">4</span>
              <span>
                Every click is tracked — check the <strong>Analytics</strong> page
                for live visit data.
              </span>
            </li>
          </ol>
        </section>

        <section className="about-section about-links-section reveal-section">
          <h2 className="about-section-title reveal-item">Project links</h2>
          <div className="about-link-row">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="about-link reveal-item magnetic-link"
            >
              <FaGithub className="about-link-icon" />
              Source Code
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="about-link reveal-item magnetic-link"
            >
              <FaLinkedin className="about-link-icon" />
              LinkedIn
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="about-link reveal-item magnetic-link"
            >
              <FaGlobe className="about-link-icon" />
              Portfolio
            </a>
            <a href="mailto:you@example.com" className="about-link reveal-item magnetic-link">
              <MdEmail className="about-link-icon" />
              Contact
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
