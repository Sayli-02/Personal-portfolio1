"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand } from "@/lib/sayali/config";
import { navLinks, resume } from "@/lib/sayali/content";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");
  const isHome = pathname === "/";

  useEffect(() => {
    setOpen(false);
    const sync = () => setHash(window.location.hash || "#home");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className={`site-nav${isHome ? " site-nav--home" : ""}${open ? " is-open" : ""}`}>
      <div className="site-nav__inner">
        <Link href="/#home" className="site-nav__brand" aria-label="Sayli home">
          {brand.logo}
        </Link>

        <button
          type="button"
          className="site-nav__toggle"
          aria-expanded={open}
          aria-controls="site-nav-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>

        <nav
          id="site-nav-menu"
          className={`site-nav__links${open ? " is-open" : ""}`}
          aria-label="Primary"
        >
          {navLinks.map((link) => {
            const active = isHome && hash === link.href.replace("/", "");
            return (
              <a
                key={link.href}
                href={link.href}
                className={`site-nav__link${active ? " is-active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            );
          })}
          <a
            className="site-nav__resume"
            href={resume.path}
            download={resume.filename}
            onClick={() => setOpen(false)}
          >
            {resume.label}
          </a>
        </nav>
      </div>
    </header>
  );
}
