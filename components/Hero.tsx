/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef } from "react";
import { assets, brand } from "@/lib/sayali/config";
import { createEngine } from "@/lib/sayali/engine";
import MlDashboard from "@/components/MlDashboard";

function Wordmark({
  className,
  viewBox,
  textX,
  textY,
  textLength,
  bottomOpacity,
  gradientId,
}: {
  className: string;
  viewBox: string;
  textX: string;
  textY: string;
  textLength: string;
  bottomOpacity: string;
  gradientId: string;
}) {
  return (
    <svg
      className={className}
      viewBox={viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
          <stop offset=".5" stopColor="#f1f5f3" stopOpacity=".9" />
          <stop
            offset="1"
            stopColor="#d7e6de"
            stopOpacity={bottomOpacity}
          />
        </linearGradient>
      </defs>
      <text
        x={textX}
        y={textY}
        textLength={textLength}
        lengthAdjust="spacingAndGlyphs"
        fill={`url(#${gradientId})`}
      >
        {brand.name}
      </text>
    </svg>
  );
}

function Badge() {
  return (
    <div className="badge pre">
      <img src={assets.badge} alt="" draggable={false} />
      <div className="card">
        <h4>
          {brand.card.heading[0]}
          <br />
          {brand.card.heading[1]}
        </h4>
        <div className="yr">{brand.card.year}</div>
        <div className="role">{brand.card.role}</div>
        <div
          className="ph"
          style={{ backgroundImage: `url(${assets.plate})` }}
        />
        {brand.card.rows.map(([label, value]) => (
          <div className="row" key={label}>
            <span>{label}</span>
            <b>{value}</b>
          </div>
        ))}
      </div>
      <div className="hit" />
    </div>
  );
}

const SECTION_HASHES = new Set([
  "#about",
  "#experience",
  "#projects",
  "#contact",
]);

function sectionId(hash: string): string | null {
  if (!SECTION_HASHES.has(hash)) return null;
  return hash.slice(1);
}

function placeSection(id: string, behavior: ScrollBehavior) {
  document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
  document.documentElement.classList.add("land-placed");
}

function clearHomeLock() {
  document.documentElement.classList.remove("land-home");
  document.body.classList.remove("hero-lock");
  document.body.classList.add("hero-ready");
}

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Home / #home refresh → lock + buffer the full dive clip.
    // A section hash (including the automatic jump to About) stays put:
    // no lock, no trans, hero is not brought back on screen.
    const deepLink = sectionId(window.location.hash);

    if (deepLink) {
      clearHomeLock();
      document.documentElement.classList.add("land-section");
      placeSection(deepLink, "auto");
    } else {
      document.documentElement.classList.remove("land-section");
      document.documentElement.classList.add("land-home");
      document.body.classList.add("hero-lock");
      window.scrollTo(0, 0);
    }

    let handoff = false;

    const goAbout = () => {
      handoff = true;
      clearHomeLock();
      const next = "/#about";
      if (window.location.hash !== "#about") {
        history.replaceState(null, "", next);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
      requestAnimationFrame(() => {
        placeSection("about", "auto");
        handoff = false;
      });
    };

    const { destroy, unlockScroll } = createEngine(root, {
      onDiveComplete: goAbout,
      startUnlocked: !!deepLink,
      skipTrans: !!deepLink,
    });

    const onHash = () => {
      const id = sectionId(window.location.hash);
      if (!id) return;
      clearHomeLock();
      unlockScroll();
      // Handoff scrolls itself. Adding land-section before land-placed would
      // blank the page for a frame while the hero is still in view.
      if (handoff) return;
      document.documentElement.classList.add("land-section");
      placeSection(id, "auto");
    };
    window.addEventListener("hashchange", onHash);

    return () => {
      document.documentElement.classList.remove("land-home");
      document.body.classList.remove("hero-lock");
      document.body.classList.remove("hero-ready");
      window.removeEventListener("hashchange", onHash);
      destroy();
    };
  }, []);

  return (
    <div className="stage flat" ref={rootRef}>
      <div className="frame">
        <img
          className="plate"
          src={assets.plate}
          alt=""
          draggable={false}
        />

        <Wordmark
          className="wm pre"
          viewBox="0 0 1440 260"
          textX="14"
          textY="214"
          textLength="1412"
          bottomOpacity=".28"
          gradientId="wmGrad"
        />

        <Badge />

        <video className="trans" muted playsInline preload="none" />

        <div className="laptop-fly" aria-hidden="true">
          <img src={assets.plate} alt="" draggable={false} />
        </div>

        <img
          className="caseplate"
          src={assets.casePlate}
          alt=""
          draggable={false}
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.src.includes("sayli-hero.png")) {
              img.src = assets.plate;
            }
          }}
        />

        <div className="screen">
          <MlDashboard />
          <div className="flash" />
        </div>

        <div className="screen-hit" />
      </div>

      <div className="ui">
        {/* Site navbar owns Home/Projects/Contact — only dive controls stay here */}
        <button type="button" className="tag t1 pre">
          my studio
        </button>

        <div className="hint pre">
          <i />
          scroll to dive in
        </div>

        <div className="ticket">
          <span className="hole tl" />
          <span className="hole tr" />
          <span className="hole bl" />
          <span className="hole br" />
          <h2>MODEL LAB</h2>
          <div className="rows">
            <div>SAYLI KULKARNI</div>
            <div>AI / ML</div>
            <div>2026</div>
          </div>
        </div>

        <div className="desc">
          <div className="k">// applied ml</div>
          <p>
            — charts, recall curves, and explainability — then into my story
            below.
          </p>
          <div className="num">LAB / ∞</div>
        </div>

        <button type="button" className="nav-case prev">
          <span className="c">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
          </span>
          previous <br />
          case
        </button>
        <button type="button" className="nav-case next">
          <span className="c">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
          next <br />
          case
        </button>

        <Wordmark
          className="m-only m-wm pre"
          viewBox="0 0 1440 240"
          textX="10"
          textY="210"
          textLength="1420"
          bottomOpacity=".3"
          gradientId="mWmGrad"
        />
        <div className="m-only m-badge" />
      </div>
    </div>
  );
}
