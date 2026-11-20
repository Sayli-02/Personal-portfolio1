import { assets, HAS_CUTOUT } from "./config";

const EASE = "cubic-bezier(.2,.8,.2,1)";
const EASE_OUT_HARD = "cubic-bezier(.5,0,.75,0)";
const EASE_GLIDE = "cubic-bezier(.65,0,.35,1)";

/** Survives Strict Mode remounts after a finished entrance so it does not replay. */
let entranceDone = false;

type Mode = "hero" | "case";
type Pose = { x: number; y: number; s: number; mobile: boolean };

export type EngineHooks = {
  onEntranceDone?: () => void;
  onDiveComplete?: () => void;
  /** Skip dive lock (e.g. refresh on #about / mid-page). */
  startUnlocked?: boolean;
};

export function createEngine(
  root: HTMLElement,
  hooks: EngineHooks = {},
): { destroy: () => void; unlockScroll: () => void } {
  const doc = document;
  const stage = root;
  const frame = qs<HTMLElement>(root, ".frame");
  const plate = qs<HTMLImageElement>(root, ".plate");
  // Flattened hero: cutout is optional / absent
  const cut = root.querySelector<HTMLImageElement>(".cut");
  const wm = qs<HTMLElement>(root, ".frame .wm");
  const script = root.querySelector<HTMLElement>(".frame .script");
  const badge = qs<HTMLElement>(root, ".frame .badge");
  const trans = qs<HTMLVideoElement>(root, "video.trans");
  const laptopFly = qs<HTMLElement>(root, ".laptop-fly");
  const caseplate = qs<HTMLImageElement>(root, ".caseplate");
  const screen = qs<HTMLElement>(root, ".screen");
  const flash = qs<HTMLElement>(root, ".flash");
  const screenHit = qs<HTMLElement>(root, ".screen-hit");
  const mlDash = root.querySelector<HTMLElement>("[data-ml-dash]");
  const tags = [...root.querySelectorAll<HTMLElement>(".ui .tag")];
  const hint = qs<HTMLElement>(root, ".hint");
  const ticket = qs<HTMLElement>(root, ".ticket");
  const desc = qs<HTMLElement>(root, ".desc");
  const descKids = [
    qs<HTMLElement>(desc, ".k"),
    qs<HTMLElement>(desc, "p"),
    qs<HTMLElement>(desc, ".num"),
  ];
  const prevBtn = qs<HTMLElement>(root, ".nav-case.prev");
  const nextBtn = qs<HTMLElement>(root, ".nav-case.next");
  const mWm = qs<HTMLElement>(root, ".m-wm");
  const mScript = root.querySelector<HTMLElement>(".m-script");
  const mBadgeHost = qs<HTMLElement>(root, ".m-badge");
  const t1 = qs<HTMLElement>(root, ".tag.t1");
  const t2 = qs<HTMLElement>(root, ".tag.t2");

  // Mobile badge: clone frame badge so markup matches exactly (brief §13 / rule 8)
  mBadgeHost.replaceChildren();
  const badgeClone = badge.cloneNode(true) as HTMLElement;
  mBadgeHost.appendChild(badgeClone);

  const allBadges = () =>
    [...root.querySelectorAll<HTMLElement>(".badge")];
  const allWms = () => [wm, mWm];
  const allScripts = () =>
    [script, mScript].filter((el): el is HTMLElement => !!el);

  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const D = (ms: number) => (RM ? 0 : ms);

  let mode: Mode = "hero";
  let busy = false;
  let destroyed = false;
  let transReady = false;
  let scrollUnlocked = !!hooks.startUnlocked;
  let blobUrl: string | null = null;
  let wheelLockUntil = 0;
  let touchX = 0;
  let touchY = 0;

  const timers = new Set<number>();
  const rafs = new Set<number>();
  const anims = new Set<Animation>();
  const swayAnims = new Map<HTMLElement, Animation>();

  function track<T extends Animation>(a: T): T {
    anims.add(a);
    a.finished.finally(() => anims.delete(a)).catch(() => {});
    return a;
  }

  function wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        resolve();
      }, D(ms));
      timers.add(id);
    });
  }

  function raf(): Promise<void> {
    return new Promise((resolve) => {
      const id = requestAnimationFrame(() => {
        rafs.delete(id);
        resolve();
      });
      rafs.add(id);
    });
  }

  function setBusy(v: boolean) {
    busy = v;
    doc.body.classList.toggle("busy", v);
  }

  function setN() {
    const W = innerWidth;
    const H = innerHeight;
    const n = W <= 820 ? W / 430 : Math.min(W / 1440, H / 900);
    doc.documentElement.style.setProperty("--n", `${n}px`);
  }

  function pose(m: Mode): Pose {
    const W = innerWidth;
    const H = innerHeight;
    const mobile = W <= 820;
    let x: number;
    let y: number;
    let s: number;

    if (!mobile) {
      const cover = Math.max(W / 1440, H / 810);
      const contain = Math.min(W / 1440, H / 810);
      const u = Math.min(W / 1440, H / 900);
      if (m === "hero") {
        // Soft fit: keep the full portrait readable (was cover → felt oversized)
        s = Math.min(contain * 1.05, cover * 0.82);
        x = (W - 1440 * s) / 2;
        y = (H - 810 * s) / 2;
      } else {
        const top = 66 * u;
        const fit = (H - top - 28 * u) / (762 - 79);
        if (fit >= cover) {
          s = cover;
          y = Math.min(0, Math.max(H - 810 * s, top - 79 * s));
        } else {
          s = fit;
          y = top - 79 * fit;
        }
        x = (W - 1440 * s) / 2;
      }
    } else if (m === "hero") {
      // Keep full portrait readable on phones; bias slightly smaller on short screens
      const tall = H / W >= 1.7;
      s = Math.min(W / 720, ((tall ? 0.48 : 0.54) * H) / 810);
      x = W / 2 - 720 * s;
      y = Math.max(H * 0.12, H - 760 * s);
    } else {
      const navH = 0.022 * H + 42 + 22;
      const ticketHeight = ticket.offsetHeight;
      const descHeight = desc.offsetHeight;
      const uiBottom =
        62 + ticketHeight + 18 + Math.max(60, descHeight) + 14;
      s = Math.min(
        (W - 28) / 905,
        Math.max(0.2, (H - navH - uiBottom) / (762 - 95)),
      );
      x = W / 2 - 720 * s;
      y = H - navH - 762 * s;
    }

    return { x, y, s, mobile };
  }

  function fitHero(p: Pose) {
    if (p.mobile) return;
    const W = innerWidth;
    const H = innerHeight;
    const { x, y, s } = p;
    const vl = Math.max(0, -x / s);
    const vr = Math.min(1440, (W - x) / s);
    const pad = 18 / s;
    wm.style.left = `${vl + 0.6 * pad}px`;
    wm.style.width = `${vr - vl - 1.2 * pad}px`;
    badge.style.left = `${Math.min(986, vr - pad - 417)}px`;
    const vb = Math.min(810, (H - y) / s);
    badge.style.top = `${Math.min(-165, vb - 56 / s - 935)}px`;
    if (script) script.style.left = `${vl + pad + 70}px`;
  }

  function place(m: Mode) {
    mode = m;
    const p = pose(m);
    frame.style.transform = `translate(${p.x}px,${p.y}px) scale(${p.s})`;
    frame.classList.toggle("m-case", m === "case");
    stage.classList.toggle("m-case", m === "case");
    frame.classList.toggle("d-fade", !p.mobile);
    frame.classList.toggle("m-fade", p.mobile);
    setN();
    if (p.mobile) {
      const mbadgeWidth = mBadgeHost.getBoundingClientRect().width ||
        (innerWidth * 0.27);
      doc.documentElement.style.setProperty(
        "--mbs",
        String(mbadgeWidth / 582),
      );
      doc.documentElement.style.setProperty(
        "--th",
        `${ticket.offsetHeight}px`,
      );
    }
    if (m === "hero") fitHero(p);
  }

  /** Instantly restore hero layers/pose after dive (no reverse animation). */
  function snapHeroAfterDive() {
    mode = "hero";
    doc.body.classList.remove("is-case");
    frame.classList.remove("glide");
    place("hero");

    plate.style.visibility = "";
    plate.style.opacity = "";
    plate.style.transform = "";
    plate.style.filter = "";
    plate.style.transformOrigin = "";

    caseplate.getAnimations().forEach((a) => a.cancel());
    caseplate.style.opacity = "0";
    caseplate.style.filter = "";

    laptopFly.getAnimations().forEach((a) => a.cancel());
    laptopFly.style.opacity = "0";

    trans.pause();
    trans.style.opacity = "0";
    screen.style.opacity = "0";
    if (mlDash) mlDash.classList.remove("is-on");

    // Clear fill:forwards fade-outs from heroOut
    for (const el of [...allWms(), ...allScripts(), ...allBadges()]) {
      el.getAnimations().forEach((a) => a.cancel());
      el.style.opacity = "";
      el.style.transform = "";
      el.style.clipPath = "";
      el.style.filter = "";
    }
    if (cut) {
      cut.getAnimations().forEach((a) => a.cancel());
      cut.style.opacity = "";
    }

    startSway();
  }

  function cancelSway() {
    swayAnims.forEach((a) => a.cancel());
    swayAnims.clear();
  }

  function startSway() {
    cancelSway();
    if (RM) return;
    for (const el of allBadges()) {
      const a = el.animate(
        [
          { transform: "rotate(-1.1deg)" },
          { transform: "rotate(1.1deg)" },
        ],
        {
          duration: 3200,
          direction: "alternate",
          iterations: Infinity,
          easing: "ease-in-out",
        },
      );
      swayAnims.set(el, a);
    }
  }

  function revealPre() {
    for (const el of root.querySelectorAll(".pre")) {
      el.classList.remove("pre");
      (el as HTMLElement).style.opacity = "";
    }
  }

  function runEntrance() {
    if (destroyed) return;
    if (entranceDone) {
      revealPre();
      startSway();
      hooks.onEntranceDone?.();
      return;
    }

    if (RM) {
      revealPre();
      entranceDone = true;
      hooks.onEntranceDone?.();
      return;
    }

    const spring = "cubic-bezier(.3,1.5,.5,1)";

    tags.forEach((tag, i) => {
      track(
        tag.animate(
          [
            {
              opacity: 0,
              transform: "translateY(-40px) rotate(-4deg)",
            },
            { opacity: 1, transform: "none" },
          ],
          {
            duration: 700,
            delay: 120 + i * 80,
            fill: "both",
            easing: spring,
          },
        ),
      );
    });

    // Flattened hero: rise/reveal the plate (wordmark is baked into the JPG).
    // Mobile .m-wm still gets the classic wordmark entrance.
    if (!HAS_CUTOUT) {
      track(
        plate.animate(
          [
            {
              opacity: 0,
              transform: "translateY(36px) scale(1.04)",
              filter: "blur(8px)",
            },
            {
              opacity: 1,
              transform: "none",
              filter: "blur(0px)",
            },
          ],
          { duration: 1100, delay: 260, fill: "both", easing: EASE },
        ),
      );
      track(
        mWm.animate(
          [
            {
              opacity: 0,
              transform: "translateY(60px)",
              clipPath: "inset(100% 0 0 0)",
            },
            {
              opacity: 1,
              transform: "none",
              clipPath: "inset(0)",
            },
          ],
          { duration: 1100, delay: 260, fill: "both", easing: EASE },
        ),
      );
    } else {
      for (const el of allWms()) {
        track(
          el.animate(
            [
              {
                opacity: 0,
                transform: "translateY(60px)",
                clipPath: "inset(100% 0 0 0)",
              },
              {
                opacity: 1,
                transform: "none",
                clipPath: "inset(0)",
              },
            ],
            { duration: 1100, delay: 260, fill: "both", easing: EASE },
          ),
        );
      }
    }

    for (const el of allScripts()) {
      track(
        el.animate(
          [
            {
              opacity: 0,
              clipPath: "inset(0 100% 0 0)",
            },
            { opacity: 1, clipPath: "inset(0)" },
          ],
          {
            duration: 900,
            delay: 1050,
            fill: "both",
            easing: "cubic-bezier(.5,0,.3,1)",
          },
        ),
      );
    }

    const badgeAnims = allBadges().map((el) =>
      track(
        el.animate(
          [
            {
              offset: 0,
              opacity: 0,
              transform: "translateY(-120%) rotate(8deg)",
            },
            {
              offset: 0.6,
              opacity: 1,
              transform: "translateY(0) rotate(-3deg)",
            },
            {
              offset: 0.8,
              opacity: 1,
              transform: "rotate(1.6deg)",
            },
            {
              offset: 1,
              opacity: 1,
              transform: "rotate(0deg)",
            },
          ],
          { duration: 1500, delay: 700, fill: "both", easing: EASE },
        ),
      ),
    );

    track(
      hint.animate(
        [{ opacity: 0 }, { opacity: 0.85 }],
        { duration: 600, delay: 1800, fill: "both", easing: EASE },
      ),
    );

    Promise.all(badgeAnims.map((a) => a.finished)).then(() => {
      if (destroyed || entranceDone) return;
      revealPre();
      startSway();
      entranceDone = true;
      hooks.onEntranceDone?.();
    }).catch(() => {});
  }

  function scheduleEntrance() {
    let started = false;
    const start = () => {
      if (started || destroyed) return;
      started = true;
      requestAnimationFrame(() => {
        if (!destroyed) runEntrance();
      });
    };

    const plateReady = new Promise<void>((resolve) => {
      if (plate.complete) resolve();
      else {
        plate.addEventListener("load", () => resolve(), { once: true });
        plate.addEventListener("error", () => resolve(), { once: true });
      }
    });

    const fontsReady = doc.fonts.ready.then(() => undefined).catch(() => undefined);

    const raced = Promise.race([
      Promise.all([fontsReady, plateReady]),
      new Promise<void>((resolve) => {
        const id = window.setTimeout(resolve, 2500);
        timers.add(id);
      }),
    ]);

    raced.then(start);

    const failsafe = window.setTimeout(start, 4000);
    timers.add(failsafe);
  }

  function onHitEnter(e: Event) {
    if (mode !== "hero" || RM || busy) return;
    const target = (e.currentTarget as HTMLElement).closest(
      ".badge",
    ) as HTMLElement | null;
    if (!target) return;
    track(
      target.animate(
        [
          { transform: "rotate(0deg)" },
          { transform: "rotate(-6deg)" },
          { transform: "rotate(4deg)" },
          { transform: "rotate(-2deg)" },
          { transform: "rotate(0deg)" },
        ],
        {
          duration: 1400,
          easing: "ease-out",
          composite: "add",
        },
      ),
    );
  }

  function caseOut(): Promise<void> {
    const ease = EASE_OUT_HARD;
    track(
      ticket.animate(
        [
          { opacity: 1, transform: "none" },
          {
            opacity: 0,
            transform: "translateY(-40px) rotate(4deg)",
          },
        ],
        { duration: D(380), fill: "forwards", easing: ease },
      ),
    );
    descKids.forEach((el, k) => {
      track(
        el.animate(
          [
            { opacity: 1, transform: "none" },
            { opacity: 0, transform: "translateY(-10px)" },
          ],
          {
            duration: D(300),
            delay: D(k * 40),
            fill: "forwards",
            easing: ease,
          },
        ),
      );
    });
    return wait(380);
  }

  function caseIn(first: boolean) {
    const ticketDelay = first ? 150 : 0;
    track(
      ticket.animate(
        [
          {
            offset: 0,
            opacity: 0,
            transform: "translateY(-60px) rotate(-6deg)",
          },
          {
            offset: 0.7,
            opacity: 1,
            transform: "translateY(6px) rotate(1.2deg)",
          },
          { offset: 1, opacity: 1, transform: "none" },
        ],
        {
          duration: D(800),
          delay: D(ticketDelay),
          fill: "both",
          easing: EASE,
        },
      ),
    );
    const base = first ? 250 : 80;
    descKids.forEach((el, k) => {
      track(
        el.animate(
          [
            { opacity: 0, transform: "translateY(14px)" },
            { opacity: 1, transform: "none" },
          ],
          {
            duration: D(600),
            delay: D(base + k * 70),
            fill: "both",
            easing: EASE,
          },
        ),
      );
    });
  }

  async function cinematicStillDive() {
    // Stand-in for the dive clip: camera glides in while a laptop plane
    // lifts out of the hero, rotates square-on, and fills the screen rect.
    doc.documentElement.style.setProperty("--glide", "1.7s");
    frame.classList.add("glide");
    place("case");

    // Zoom toward laptop in current sayli-hero (held front-center)
    plate.style.transformOrigin = "54% 58%";
    track(
      plate.animate(
        [
          {
            opacity: 1,
            transform: "scale(1)",
            filter: "blur(0px)",
          },
          {
            opacity: 0.15,
            transform: "scale(1.55)",
            filter: "blur(10px)",
          },
          {
            opacity: 0,
            transform: "scale(1.7)",
            filter: "blur(14px)",
          },
        ],
        {
          duration: D(1700),
          fill: "forwards",
          easing: EASE_GLIDE,
        },
      ),
    );

    // Laptop floats forward and turns to face camera (~same beat as the dive clip)
    laptopFly.style.opacity = "1";
    track(
      laptopFly.animate(
        [
          {
            offset: 0,
            opacity: 0.9,
            transform:
              "translate(40px, 180px) scale(0.34) rotateY(42deg) rotateX(20deg) rotateZ(-6deg)",
            filter: "blur(2px)",
          },
          {
            offset: 0.45,
            opacity: 1,
            transform:
              "translate(12px, 60px) scale(0.72) rotateY(14deg) rotateX(8deg) rotateZ(-2deg)",
            filter: "blur(0px)",
          },
          {
            offset: 0.78,
            opacity: 1,
            transform:
              "translate(0px, 8px) scale(0.96) rotateY(4deg) rotateX(2deg) rotateZ(0deg)",
          },
          {
            offset: 1,
            opacity: 1,
            transform:
              "translate(0px, 0px) scale(1) rotateY(0deg) rotateX(0deg) rotateZ(0deg)",
          },
        ],
        {
          duration: D(1720),
          fill: "forwards",
          easing: "cubic-bezier(.2,.7,.2,1)",
        },
      ),
    );

    track(
      caseplate.animate(
        [
          { opacity: 0, filter: "blur(12px)" },
          { opacity: 0, filter: "blur(8px)", offset: 0.7 },
          { opacity: 1, filter: "blur(0px)" },
        ],
        {
          duration: D(1720),
          fill: "forwards",
          easing: EASE,
        },
      ),
    );

    await wait(1720);
    if (destroyed) return;
    plate.style.visibility = "hidden";
    plate.style.opacity = "";
    plate.style.transform = "";
    plate.style.filter = "";
    laptopFly.style.opacity = "0";
    laptopFly.getAnimations().forEach((a) => a.cancel());
    caseplate.style.opacity = "1";
    caseplate.style.filter = "";
    await arriveCase(true);
  }

  async function arriveCase(first: boolean) {
    mode = "case";
    doc.body.classList.add("is-case");
    plate.style.visibility = "hidden";
    if (cut) cut.style.opacity = "0";
    screen.style.opacity = "1";

    track(
      flash.animate(
        [
          { opacity: 0 },
          { opacity: 0.55 },
          { opacity: 0 },
        ],
        { duration: D(600), easing: "ease-out", fill: "both" },
      ),
    );

    // ML charts on the laptop — never the old fashion reels
    if (mlDash) {
      mlDash.classList.add("is-on");
      track(
        mlDash.animate(
          [
            { opacity: 0, transform: "scale(1.06)" },
            { opacity: 1, transform: "scale(1)" },
          ],
          { duration: D(700), fill: "both", easing: EASE },
        ),
      );
    }

    caseIn(first);

    await wait(1600);
    if (destroyed) return;
    setBusy(false);
    // Unlock scroll, snap frame back to hero pose (was stuck at case scale),
    // then jump to About. Without place("hero"), scrolling home looked zoomed-in.
    scrollUnlocked = true;
    ticket.getAnimations().forEach((a) => a.cancel());
    ticket.style.opacity = "0";
    descKids.forEach((el) => {
      el.getAnimations().forEach((a) => a.cancel());
      el.style.opacity = "0";
    });
    snapHeroAfterDive();
    hooks.onDiveComplete?.();
    // hero-lock removal can change scrollbar width — re-fit after layout settles
    const id = requestAnimationFrame(() => {
      rafs.delete(id);
      const id2 = requestAnimationFrame(() => {
        rafs.delete(id2);
        if (!destroyed && mode === "hero") place("hero");
      });
      rafs.add(id2);
    });
    rafs.add(id);
  }

  async function playTransWithSpeedCurve(): Promise<void> {
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        trans.removeEventListener("ended", onEnded);
        resolve();
      };
      const onEnded = () => finish();
      trans.addEventListener("ended", onEnded);

      const tick = () => {
        if (destroyed || done) return;
        const dur = trans.duration || 5.04;
        const p = trans.currentTime / dur;
        trans.playbackRate = Math.max(
          1.2,
          1.8 + 2.4 * Math.sin(Math.PI * Math.min(p * 1.08, 1)),
        );
        if (p >= 0.995) {
          finish();
          return;
        }
        const id = requestAnimationFrame(tick);
        rafs.add(id);
      };

      trans.play().catch(() => finish());
      const id = requestAnimationFrame(tick);
      rafs.add(id);
    });
  }

  async function toCase() {
    if (busy || mode !== "hero" || destroyed) return;
    setBusy(true);
    cancelSway();

    // heroOut
    const outEase = EASE_OUT_HARD;
    for (const el of allWms()) {
      track(
        el.animate(
          [
            { opacity: 1, transform: "none" },
            { opacity: 0, transform: "translateY(-40px)" },
          ],
          { duration: D(380), fill: "forwards", easing: outEase },
        ),
      );
    }
    for (const el of allScripts()) {
      track(
        el.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: D(380), fill: "forwards", easing: outEase },
        ),
      );
    }
    for (const el of allBadges()) {
      track(
        el.animate(
          [
            { opacity: 1, transform: "none" },
            {
              opacity: 0,
              transform: "translateY(-110%) rotate(-6deg)",
            },
          ],
          { duration: D(380), fill: "forwards", easing: outEase },
        ),
      );
    }

    await wait(330);
    if (destroyed) return;

    // Never play the old Haldoren male clip. Only a local Sayali trans counts.
    if (RM || !transReady) {
      await cinematicStillDive();
      return;
    }

    trans.currentTime = 0;
    trans.style.opacity = "1";
    await raf();
    await raf();
    if (destroyed) return;
    plate.style.visibility = "hidden";

    if (cut && HAS_CUTOUT) {
      track(
        cut.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: D(260), fill: "forwards", easing: "ease-out" },
        ),
      );
    }

    doc.documentElement.style.setProperty("--glide", "1.6s");
    frame.classList.add("glide");
    place("case");

    await playTransWithSpeedCurve();
    if (destroyed) return;

    trans.pause();
    caseplate.getAnimations().forEach((a) => a.cancel());
    caseplate.style.opacity = "1";
    trans.style.opacity = "0";

    await arriveCase(true);
  }

  async function toHero() {
    if (busy || mode !== "case" || destroyed) return;
    setBusy(true);

    await caseOut();
    if (destroyed) return;
    if (mlDash) mlDash.classList.remove("is-on");
    track(
      screen.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: D(300), fill: "forwards", easing: EASE },
      ),
    );

    doc.body.classList.remove("is-case");
    doc.documentElement.style.setProperty("--glide", ".9s");
    frame.classList.add("glide");
    place("hero");

    plate.style.visibility = "";
    plate.style.transformOrigin = "50% 50%";
    laptopFly.style.opacity = "0";
    laptopFly.getAnimations().forEach((a) => a.cancel());

    track(
      caseplate.animate(
        [
          { opacity: 1, filter: "blur(0px)" },
          { opacity: 0, filter: "blur(12px)" },
        ],
        {
          duration: D(800),
          fill: "forwards",
          easing: EASE_GLIDE,
        },
      ),
    );
    track(
      plate.animate(
        [
          { transform: "scale(1.12)", filter: "blur(8px)" },
          { transform: "scale(1)", filter: "blur(0px)" },
        ],
        {
          duration: D(900),
          fill: "forwards",
          easing: EASE,
        },
      ),
    );

    await wait(250);
    if (destroyed) return;

    if (!HAS_CUTOUT) {
      track(
        mWm.animate(
          [
            { opacity: 0, transform: "translateY(40px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: D(700), fill: "forwards", easing: EASE },
        ),
      );
    }
    for (const el of allScripts()) {
      track(
        el.animate(
          [
            { opacity: 0, clipPath: "inset(0 100% 0 0)" },
            { opacity: 1, clipPath: "inset(0)" },
          ],
          {
            duration: D(700),
            delay: D(250),
            fill: "forwards",
            easing: EASE,
          },
        ),
      );
    }
    const badgeBack = allBadges().map((el) =>
      track(
        el.animate(
          [
            {
              offset: 0,
              opacity: 0,
              transform: "translateY(-110%) rotate(6deg)",
            },
            {
              offset: 0.7,
              opacity: 1,
              transform: "translateY(0) rotate(-2deg)",
            },
            {
              offset: 1,
              opacity: 1,
              transform: "rotate(0deg)",
            },
          ],
          { duration: D(1100), fill: "forwards", easing: EASE },
        ),
      ),
    );

    Promise.all(badgeBack.map((a) => a.finished))
      .then(() => {
        if (!destroyed) startSway();
      })
      .catch(() => {});

    await wait(1000);
    if (destroyed) return;
    frame.classList.remove("glide");
    caseplate.style.opacity = "0";
    caseplate.style.filter = "";
    plate.style.filter = "";
    plate.style.transform = "";
    screen.style.opacity = "0";
    setBusy(false);
  }

  function onWheel(e: WheelEvent) {
    // Strict lock until dive finishes; after that the landing page scrolls freely.
    if (!scrollUnlocked || mode === "case") {
      e.preventDefault();
    }
    const now = performance.now();
    if (now < wheelLockUntil || busy || scrollUnlocked) return;
    if (Math.abs(e.deltaY) < 18) return;
    wheelLockUntil = now + 900;
    if (mode === "hero" && e.deltaY > 0) void toCase();
  }

  function onTouchStart(e: TouchEvent) {
    const t = e.changedTouches[0];
    touchX = t.clientX;
    touchY = t.clientY;
  }

  function onTouchEnd(e: TouchEvent) {
    const dy = e.changedTouches[0].clientY - touchY;
    if (busy) return;
    if (!scrollUnlocked && mode === "hero" && dy <= -40) void toCase();
  }

  function onKey(e: KeyboardEvent) {
    if (busy) return;
    const k = e.key;
    if (!scrollUnlocked && mode === "hero") {
      if (k === "ArrowDown" || k === "PageDown" || k === " ") {
        e.preventDefault();
        void toCase();
      }
    }
  }

  function onResize() {
    frame.classList.remove("glide");
    place(mode);
  }

  // Click handlers
  const onT1 = (e: Event) => {
    e.preventDefault();
    if (mode === "case") void toHero();
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const onT2 = (e: Event) => {
    e.preventDefault();
    if (mode === "hero") void toCase();
    else hooks.onDiveComplete?.();
  };
  const onPrev = (e: Event) => {
    e.preventDefault();
    if (mode === "case") void toHero();
  };
  const onNext = (e: Event) => {
    e.preventDefault();
    hooks.onDiveComplete?.();
  };
  const onScreenHit = (e: Event) => {
    e.preventDefault();
    hooks.onDiveComplete?.();
  };

  // Bind
  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("keydown", onKey);
  window.addEventListener("resize", onResize);

  t1.addEventListener("click", onT1);
  t2.addEventListener("click", onT2);
  prevBtn.addEventListener("click", onPrev);
  nextBtn.addEventListener("click", onNext);
  screenHit.addEventListener("click", onScreenHit);

  const hits = [...root.querySelectorAll<HTMLElement>(".badge .hit")];
  hits.forEach((h) => h.addEventListener("pointerenter", onHitEnter));

  // Case still: fall back to hero if sayli-case.jpg is missing
  caseplate.addEventListener(
    "error",
    () => {
      if (caseplate.src.includes("sayli-hero")) return;
      caseplate.src = assets.plate;
    },
    { once: true },
  );

  // Sayali dive clip — blob preload (same as original) with direct-src fallback
  const markTransReady = () => {
    transReady = true;
  };
  fetch(assets.trans)
    .then((r) => {
      if (!r.ok) throw new Error("sayli trans unavailable");
      return r.blob();
    })
    .then((b) => {
      if (destroyed) return;
      blobUrl = URL.createObjectURL(b);
      trans.src = blobUrl;
      trans.load();
      if (trans.readyState >= 2) markTransReady();
      else trans.addEventListener("loadeddata", markTransReady, { once: true });
    })
    .catch(() => {
      if (destroyed) return;
      // Direct file path still plays the dive if blob fetch fails
      trans.src = assets.trans;
      trans.load();
      if (trans.readyState >= 2) markTransReady();
      else trans.addEventListener("loadeddata", markTransReady, { once: true });
      trans.addEventListener(
        "error",
        () => {
          transReady = false;
        },
        { once: true },
      );
    });

  // Init pose + entrance
  place("hero");
  scheduleEntrance();

  function unlockScroll() {
    scrollUnlocked = true;
  }

  function destroy() {
    destroyed = true;
    setBusy(false);
    doc.body.classList.remove("busy");
    // NOTE: leave body.is-case / transforms alone on mid-flight destroy;
    // Strict Mode remount rebuilds a fresh tree.

    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", onResize);

    t1.removeEventListener("click", onT1);
    t2.removeEventListener("click", onT2);
    prevBtn.removeEventListener("click", onPrev);
    nextBtn.removeEventListener("click", onNext);
    screenHit.removeEventListener("click", onScreenHit);
    hits.forEach((h) =>
      h.removeEventListener("pointerenter", onHitEnter),
    );

    timers.forEach((id) => clearTimeout(id));
    timers.clear();
    rafs.forEach((id) => cancelAnimationFrame(id));
    rafs.clear();
    cancelSway();
    anims.forEach((a) => a.cancel());
    anims.clear();

    trans.pause();

    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      blobUrl = null;
    }

    // If entrance never finished, allow the remount to run it (Strict Mode).
    // entranceDone stays true only after a completed entrance.
  }

  return { destroy, unlockScroll };
}

function qs<T extends Element = Element>(root: ParentNode, sel: string): T {
  const el = root.querySelector(sel);
  if (!el) throw new Error(`Missing ${sel}`);
  return el as T;
}
