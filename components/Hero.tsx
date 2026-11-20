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

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Strict lock: no page scroll until the laptop dive/trans finishes
    document.body.classList.add("hero-lock");

    const goAbout = () => {
      document.body.classList.remove("hero-lock");
      document.body.classList.add("hero-ready");
      requestAnimationFrame(() => {
        document.getElementById("about")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    };

    const { destroy } = createEngine(root, {
      onDiveComplete: goAbout,
    });

    return () => {
      document.body.classList.remove("hero-lock");
      document.body.classList.remove("hero-ready");
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

        <video
          className="trans"
          muted
          playsInline
          preload="auto"
          src={assets.trans}
        />

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
        <button type="button" className="tag t2 pre">
          about me
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
