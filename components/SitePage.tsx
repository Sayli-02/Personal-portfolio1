import type { ReactNode } from "react";

export default function SitePage({
  eyebrow,
  headline,
  lead,
  children,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <main className="site-page">
      <div className="site-page__glow" aria-hidden="true" />
      <div className="site-page__inner">
        <header className="site-page__hero">
          <p className="site-page__eyebrow">{eyebrow}</p>
          <h1 className="site-page__title">{headline}</h1>
          <p className="site-page__lead">{lead}</p>
        </header>
        {children}
      </div>
    </main>
  );
}
